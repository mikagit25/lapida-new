const express = require('express');
const Memorial = require('../models/Memorial');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Получить все публичные мемориалы
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { isPrivate: false };
    
    // Поиск по имени
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { biography: { $regex: search, $options: 'i' } }
      ];
    }
    
    const memorials = await Memorial.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Memorial.countDocuments(query);
    
    res.json({
      memorials,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMemorials: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении мемориалов', error: error.message });
  }
});

// Получение мемориала по ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id)
      .populate('creator', 'name avatar')
      .populate('tributes.author', 'name avatar');

    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Проверка доступа к приватному мемориалу
    if (!memorial.isPublic && (!req.user || req.user._id.toString() !== memorial.creator._id.toString())) {
      return res.status(403).json({ message: 'Доступ к мемориалу ограничен' });
    }

    // Увеличение просмотров
    await memorial.incrementViews();

    res.json(memorial);
  } catch (error) {
    console.error('Ошибка получения мемориала:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении мемориала' });
  }
});

// Создание нового мемориала
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      deceasedName,
      birthDate,
      deathDate,
      photos,
      location,
      biography,
      isPublic
    } = req.body;

    // Проверка обязательных полей
    if (!title || !description || !deceasedName || !birthDate || !deathDate || !location?.cemetery) {
      return res.status(400).json({ 
        message: 'Заполните все обязательные поля' 
      });
    }

    // Проверка дат
    if (new Date(deathDate) <= new Date(birthDate)) {
      return res.status(400).json({ 
        message: 'Дата смерти должна быть позже даты рождения' 
      });
    }

    const memorial = new Memorial({
      title,
      description,
      deceasedName,
      birthDate: new Date(birthDate),
      deathDate: new Date(deathDate),
      photos: photos || [],
      location,
      biography,
      creator: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    await memorial.save();
    await memorial.populate('creator', 'name');

    res.status(201).json({
      message: 'Мемориал успешно создан',
      memorial
    });
  } catch (error) {
    console.error('Ошибка создания мемориала:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании мемориала' });
  }
});

// Обновление мемориала
router.put('/:id', auth, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);

    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Проверка прав доступа
    if (memorial.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для редактирования мемориала' });
    }

    const updates = req.body;
    
    // Проверка дат при обновлении
    if (updates.birthDate && updates.deathDate) {
      if (new Date(updates.deathDate) <= new Date(updates.birthDate)) {
        return res.status(400).json({ 
          message: 'Дата смерти должна быть позже даты рождения' 
        });
      }
    }

    const updatedMemorial = await Memorial.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('creator', 'name');

    res.json({
      message: 'Мемориал успешно обновлен',
      memorial: updatedMemorial
    });
  } catch (error) {
    console.error('Ошибка обновления мемориала:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении мемориала' });
  }
});

// Удаление мемориала
router.delete('/:id', auth, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);

    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Проверка прав доступа
    if (memorial.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для удаления мемориала' });
    }

    await Memorial.findByIdAndDelete(req.params.id);

    res.json({ message: 'Мемориал успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления мемориала:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении мемориала' });
  }
});

// Добавление послания (tribute)
router.post('/:id/tributes', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Сообщение не может быть пустым' });
    }

    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    memorial.tributes.push({
      author: req.user._id,
      message: message.trim()
    });

    await memorial.save();
    await memorial.populate('tributes.author', 'name avatar');

    res.status(201).json({
      message: 'Послание добавлено',
      tribute: memorial.tributes[memorial.tributes.length - 1]
    });
  } catch (error) {
    console.error('Ошибка добавления послания:', error);
    res.status(500).json({ message: 'Ошибка сервера при добавлении послания' });
  }
});

// Добавление цветов
router.post('/:id/flowers', async (req, res) => {
  try {
    const { type, color, message, giverName } = req.body;

    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    const flower = {
      type: type || 'rose',
      color: color || 'red',
      message: message || '',
      giverName: giverName || 'Аноним'
    };

    if (req.user) {
      flower.giver = req.user._id;
    }

    memorial.flowers.push(flower);
    await memorial.save();

    res.status(201).json({
      message: 'Цветы возложены',
      flower: memorial.flowers[memorial.flowers.length - 1]
    });
  } catch (error) {
    console.error('Ошибка добавления цветов:', error);
    res.status(500).json({ message: 'Ошибка сервера при добавлении цветов' });
  }
});

// Получение мемориалов пользователя
router.get('/user/my', auth, async (req, res) => {
  try {
    const memorials = await Memorial.find({ creator: req.user._id })
      .sort({ createdAt: -1 });

    res.json(memorials);
  } catch (error) {
    console.error('Ошибка получения мемориалов пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении мемориалов пользователя' });
  }
});

module.exports = router;
