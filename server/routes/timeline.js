const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const TimelineEvent = require('../models/TimelineEvent');
const Memorial = require('../models/Memorial');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Настройка multer для загрузки фото в timeline
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../upload/timeline');
    // Создаем папку если её нет
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `timeline-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения'));
    }
  }
});

// Получение событий временной линии мемориала (альтернативный путь)

// Алиас для совместимости: /api/timeline → /api/timeline/timeline
router.get('/', async (req, res, next) => {
  // Просто проксируем на /timeline
  req.url = '/timeline' + (req.url === '/' ? '' : req.url);
  next();
});

// Основная реализация /timeline
router.get('/timeline', async (req, res) => {
  try {
    console.log('Timeline API called', req.query);
    const { memorialId, eventType, year, limit = 50, offset = 0 } = req.query;

    if (!memorialId) {
      console.log('No memorialId');
      return res.status(400).json({ message: 'memorialId обязателен' });
    }

    // Проверяем существование мемориала
    const memorial = await Memorial.findById(memorialId);
    console.log('Memorial found:', !!memorial);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Строим фильтр
    const filter = {
      memorial: memorialId,
      isPublic: true
    };

    if (eventType && eventType !== 'all') {
      filter.eventType = eventType;
    }

    if (year) {
      const startOfYear = new Date(`${year}-01-01`);
      const endOfYear = new Date(`${year}-12-31`);
      filter.date = { $gte: startOfYear, $lte: endOfYear };
    }

    console.log('Timeline filter:', filter);
    const events = await TimelineEvent.find(filter)
      .populate('author', 'name avatar')
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    console.log('Events found:', events.length);

    // Вычисляем возраст для каждого события
    const eventsWithAge = events.map(event => {
      const eventObj = event.toObject();
      if (memorial.birthDate) {
        const birthYear = new Date(memorial.birthDate).getFullYear();
        const eventYear = new Date(event.date).getFullYear();
        eventObj.ageAtEvent = eventYear - birthYear;
      }
      return eventObj;
    });

    // Возвращаем всегда массив (как в рабочей версии)
    console.log('Returning events:', eventsWithAge.length);
    res.json(Array.isArray(eventsWithAge) ? eventsWithAge : []);
  } catch (error) {
    console.error('Ошибка получения событий timeline:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение событий временной линии мемориала
router.get('/memorial/:memorialId/timeline', async (req, res) => {
  try {
    const { memorialId } = req.params;
    const { category, year, limit = 50, offset = 0 } = req.query;

    // Проверяем существование мемориала
    const memorial = await Memorial.findById(memorialId);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Строим фильтр
    const filter = {
      memorial: memorialId,
      isPublic: true
    };

    if (category && category !== 'all') {
      filter.eventType = category;
    }

    if (year) {
      const startOfYear = new Date(`${year}-01-01`);
      const endOfYear = new Date(`${year}-12-31`);
      filter.date = { $gte: startOfYear, $lte: endOfYear };
    }

    const events = await TimelineEvent.find(filter)
      .populate('author', 'name avatar')
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // Вычисляем возраст для каждого события
    const eventsWithAge = events.map(event => {
      const eventObj = event.toObject();
      if (memorial.birthDate) {
        const calculatedAge = event.calculateAge(memorial.birthDate);
        if (calculatedAge !== null) {
          eventObj.ageAtEvent = calculatedAge;
          // Пересчитываем форматированный возраст
          const years = Math.floor(calculatedAge);
          const months = Math.floor((calculatedAge - years) * 12);
          
          if (years === 0) {
            eventObj.formattedAge = months === 1 ? '1 месяц' : `${months} месяцев`;
          } else if (months === 0) {
            eventObj.formattedAge = years === 1 ? '1 год' : `${years} лет`;
          } else {
            eventObj.formattedAge = `${years} лет ${months} месяцев`;
          }
        }
      }
      return eventObj;
    });

    res.json({
      events: eventsWithAge,
      total: await TimelineEvent.countDocuments(filter),
      hasMore: (parseInt(offset) + parseInt(limit)) < await TimelineEvent.countDocuments(filter)
    });
  } catch (error) {
    console.error('Ошибка получения событий таймлайна:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создание события временной линии
router.post('/memorial/:memorialId/timeline', auth, upload.array('photos', 5), async (req, res) => {
  try {
    const { memorialId } = req.params;
    const { title, description, date, dateDisplay, eventType, location } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Название события обязательно для заполнения' });
    }

    // Проверяем существование мемориала
    const memorial = await Memorial.findById(memorialId);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Обрабатываем загруженные фото
    const photos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Сохраняем только относительный путь
        const photoUrl = `/upload/timeline/${file.filename}`;
        photos.push({
          url: photoUrl,
          caption: '', // Можно добавить caption из запроса
          uploadedAt: new Date()
        });
      });
    }

    // Создаем событие
    const eventData = {
      memorial: memorialId,
      title: title.trim(),
      photos,
      eventType: eventType || 'other',
      author: req.user.id,
      authorName: req.user.name
    };

    // Добавляем необязательные поля только если они заполнены
    if (description && description.trim()) {
      eventData.description = description.trim();
    }
    
    if (date) {
      eventData.date = new Date(date);
    }
    
    if (dateDisplay && dateDisplay.trim()) {
      eventData.dateDisplay = dateDisplay.trim();
    }
    
    if (location && location.trim()) {
      eventData.location = location.trim();
    }

    const event = new TimelineEvent(eventData);

    // Вычисляем возраст если есть дата рождения и дата события
    if (memorial.birthDate && eventData.date) {
      event.ageAtEvent = event.calculateAge(memorial.birthDate);
    }

    await event.save();
    await event.populate('author', 'name avatar');

    res.status(201).json(event);
  } catch (error) {
    console.error('Ошибка создания события:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение статистики временной линии (специфичный маршрут должен быть перед параметрическим)
router.get('/timeline/stats', async (req, res) => {
  try {
    const { memorialId } = req.query;

    if (!memorialId) {
      return res.status(400).json({ message: 'memorialId обязателен' });
    }

    const memorial = await Memorial.findById(memorialId);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Получаем статистику событий
    const totalEvents = await TimelineEvent.countDocuments({ memorial: memorialId, isPublic: true });
    
    const eventsByType = await TimelineEvent.aggregate([
      { $match: { memorial: new mongoose.Types.ObjectId(memorialId), isPublic: true } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]);

    const eventsByYear = await TimelineEvent.aggregate([
      { $match: { memorial: new mongoose.Types.ObjectId(memorialId), isPublic: true } },
      { $group: { _id: { $year: '$date' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const stats = {
      totalEvents,
      eventsByType: eventsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      eventsByYear: eventsByYear.map(item => ({
        year: item._id,
        count: item.count
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Ошибка получения статистики timeline:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение одного события
router.get('/timeline/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await TimelineEvent.findById(eventId)
      .populate('author', 'name avatar')
      .populate('memorial', 'firstName lastName birthDate');

    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    if (!event.isPublic) {
      return res.status(403).json({ message: 'Событие недоступно' });
    }

    // Вычисляем возраст если есть дата рождения
    const eventObj = event.toObject();
    if (event.memorial.birthDate) {
      eventObj.ageAtEvent = event.calculateAge(event.memorial.birthDate);
      eventObj.formattedAge = event.formattedAge;
    }

    res.json(eventObj);
  } catch (error) {
    console.error('Ошибка получения события:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновление события (только автор или владелец мемориала)
router.put('/timeline/:eventId', auth, upload.array('photos', 5), async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, date, dateDisplay, eventType, location, isPublic } = req.body;

    const event = await TimelineEvent.findById(eventId)
      .populate('memorial', 'createdBy birthDate');
    
    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    // Проверяем права (автор события или создатель мемориала)
    if (event.author.toString() !== req.user.id && 
        event.memorial.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав для редактирования' });
    }

    // Обновляем поля
    if (title !== undefined) event.title = title.trim();
    if (description !== undefined) event.description = description.trim();
    if (date !== undefined) event.date = new Date(date);
    if (dateDisplay !== undefined) event.dateDisplay = dateDisplay.trim();
    if (eventType !== undefined) event.eventType = eventType;
    if (location !== undefined) event.location = location ? location.trim() : null;
    if (isPublic !== undefined) event.isPublic = Boolean(isPublic);

    // Добавляем новые фото
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const photoUrl = `http://localhost:${process.env.PORT || 5002}/upload/timeline/${file.filename}`;
        event.photos.push({
          url: photoUrl,
          caption: '',
          uploadedAt: new Date()
        });
      });
    }

    // Пересчитываем возраст если изменилась дата
    if (date !== undefined && event.memorial.birthDate) {
      event.ageAtEvent = event.calculateAge(event.memorial.birthDate);
    }

    await event.save();
    await event.populate('author', 'name avatar');

    res.json(event);
  } catch (error) {
    console.error('Ошибка обновления события:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление фото из события
router.delete('/timeline/:eventId/photo/:photoIndex', auth, async (req, res) => {
  try {
    const { eventId, photoIndex } = req.params;

    const event = await TimelineEvent.findById(eventId)
      .populate('memorial', 'createdBy');
    
    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    // Проверяем права
    if (event.author.toString() !== req.user.id && 
        event.memorial.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав для редактирования' });
    }

    const index = parseInt(photoIndex);
    if (index < 0 || index >= event.photos.length) {
      return res.status(400).json({ message: 'Неверный индекс фото' });
    }

    // Удаляем фото из массива
    event.photos.splice(index, 1);
    await event.save();

    res.json({ message: 'Фото удалено успешно' });
  } catch (error) {
    console.error('Ошибка удаления фото:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление события
router.delete('/timeline/:eventId', auth, async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await TimelineEvent.findById(eventId)
      .populate('memorial', 'createdBy');
    
    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    // Проверяем права (автор события или создатель мемориала)
    if (event.author.toString() !== req.user.id && 
        event.memorial.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав для удаления' });
    }

    await TimelineEvent.findByIdAndDelete(eventId);

    res.json({ message: 'Событие удалено успешно' });
  } catch (error) {
    console.error('Ошибка удаления события:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение статистики временной линии
router.get('/memorial/:memorialId/timeline/stats', async (req, res) => {
  try {
    const { memorialId } = req.params;

    const memorial = await Memorial.findById(memorialId);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    const totalEvents = await TimelineEvent.countDocuments({
      memorial: memorialId,
      isPublic: true
    });

    const eventsByType = await TimelineEvent.aggregate([
      { $match: { memorial: mongoose.Types.ObjectId(memorialId), isPublic: true } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]);

    const eventsByYear = await TimelineEvent.aggregate([
      { $match: { memorial: mongoose.Types.ObjectId(memorialId), isPublic: true } },
      { $group: { 
        _id: { $year: '$date' }, 
        count: { $sum: 1 },
        events: { $push: { title: '$title', date: '$date' } }
      }},
      { $sort: { _id: 1 } }
    ]);

    const stats = {
      totalEvents,
      eventsByType: eventsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      eventsByYear: eventsByYear.map(item => ({
        year: item._id,
        count: item.count,
        events: item.events
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
