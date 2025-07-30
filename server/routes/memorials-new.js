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

// Получить мемориал по shareUrl (публичный доступ)
router.get('/share/:shareUrl', async (req, res) => {
  try {
    const memorial = await Memorial.findOne({ shareUrl: req.params.shareUrl })
      .populate('createdBy', 'name')
      .populate('allowedUsers', 'name email');
    
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    
    // Увеличиваем счетчик просмотров
    memorial.viewCount = (memorial.viewCount || 0) + 1;
    await memorial.save();
    
    res.json(memorial);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении мемориала', error: error.message });
  }
});

// Получить мемориал по customSlug (красивая ссылка)
router.get('/slug/:slug', async (req, res) => {
  try {
    const memorial = await Memorial.findOne({ customSlug: req.params.slug })
      .populate('createdBy', 'name')
      .populate('allowedUsers', 'name email');
    
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    
    // Проверка приватности
    if (memorial.isPrivate) {
      return res.status(403).json({ message: 'Мемориал недоступен' });
    }
    
    // Увеличиваем счетчик просмотров
    memorial.viewCount = (memorial.viewCount || 0) + 1;
    await memorial.save();
    
    res.json(memorial);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении мемориала', error: error.message });
  }
});

// Получить мемориалы пользователя (требует авторизации)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const memorials = await Memorial.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Memorial.countDocuments({ createdBy: req.user.id });
    
    res.json({
      memorials,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMemorials: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении ваших мемориалов', error: error.message });
  }
});

// Создать новый мемориал (требует авторизации)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('POST /memorials - body:', req.body);
    console.log('POST /memorials - user:', req.user ? { _id: req.user._id, name: req.user.name } : 'no user');
    
    const {
      firstName,
      lastName,
      birthDate,
      deathDate,
      biography,
      epitaph,
      profileImage,
      location,
      galleryImages = [],
      timeline = [],
      isPrivate = false
    } = req.body;
    
    // Валидация обязательных полей
    if (!firstName || !lastName || !birthDate || !deathDate || !location?.cemetery) {
      return res.status(400).json({ 
        message: 'Обязательные поля: firstName, lastName, birthDate, deathDate, location.cemetery',
        missing: {
          firstName: !firstName,
          lastName: !lastName, 
          birthDate: !birthDate,
          deathDate: !deathDate,
          cemetery: !location?.cemetery
        }
      });
    }
    
    const memorial = new Memorial({
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      deathDate: new Date(deathDate),
      biography,
      epitaph,
      profileImage,
      location,
      galleryImages,
      timeline,
      isPrivate,
      createdBy: req.user._id
    });
    
    await memorial.save();
    await memorial.populate('createdBy', 'name email');
    
    res.status(201).json(memorial);
  } catch (error) {
    console.error('Error creating memorial:', error);
    res.status(400).json({ message: 'Ошибка при создании мемориала', error: error.message });
  }
});

// Обновить мемориал (требует авторизации и быть владельцем)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);
    
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    
    // Проверить, что пользователь - владелец мемориала
    if (memorial.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'У вас нет прав на редактирование этого мемориала' });
    }
    
    const allowedUpdates = [
      'firstName', 'lastName', 'birthDate', 'deathDate', 'biography', 'epitaph',
      'profileImage', 'galleryImages', 'timeline', 'isPrivate', 'allowedUsers'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'birthDate' || field === 'deathDate') {
          memorial[field] = new Date(req.body[field]);
        } else {
          memorial[field] = req.body[field];
        }
      }
    });
    
    await memorial.save();
    await memorial.populate('createdBy', 'name email');
    
    res.json(memorial);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении мемориала', error: error.message });
  }
});

// Удалить мемориал (требует авторизации и быть владельцем)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);
    
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    
    // Проверить, что пользователь - владелец мемориала
    if (memorial.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'У вас нет прав на удаление этого мемориала' });
    }
    
    // Удалить все комментарии к мемориалу
    await Comment.deleteMany({ memorial: req.params.id });
    
    // Удалить мемориал
    await Memorial.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Мемориал успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении мемориала', error: error.message });
  }
});

// Обновить галерею мемориала (требует авторизации)
router.patch('/:id/gallery', authMiddleware, async (req, res) => {
  try {
    const { galleryImages } = req.body;
    
    const memorial = await Memorial.findById(req.params.id);
    
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    
    // Проверить, что пользователь - владелец мемориала или мемориал публичный
    if (memorial.isPrivate && memorial.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'У вас нет прав на редактирование этого мемориала' });
    }
    
    memorial.galleryImages = galleryImages;
    await memorial.save();
    
    res.json(memorial);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении галереи', error: error.message });
  }
});

module.exports = router;
