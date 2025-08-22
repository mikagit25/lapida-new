// Обновление статуса публичности мемориала (публикация/скрытие)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { isPublic } = req.body;
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    // Проверка прав
    const userId = req.user.id || req.user._id;
    const memorialCreatorId = memorial.createdBy?.toString() || memorial.createdBy;
    if (memorialCreatorId !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для изменения статуса мемориала' });
    }
    memorial.isPublic = Boolean(isPublic);
    await memorial.save();
    res.json({ message: 'Статус мемориала обновлен', isPublic: memorial.isPublic });
  } catch (error) {
    console.error('Ошибка обновления статуса мемориала:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении статуса мемориала' });
  }
});
// --- Галерея мемориала ---
const memorialGalleryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../upload/memorials');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'memorial-' + req.params.id + '-' + Date.now() + '-' + Math.floor(Math.random()*1e9) + ext);
  }
});
const memorialGalleryUpload = multer({ storage: memorialGalleryStorage });

// Загрузка фото в галерею мемориала
router.post('/:id/gallery', authMiddleware, memorialGalleryUpload.array('photos', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }
    const imageUrls = req.files.map(f => '/upload/memorials/' + f.filename);
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    // Проверка прав
    if (memorial.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для редактирования мемориала' });
    }
    if (!memorial.galleryImages) memorial.galleryImages = [];
    memorial.galleryImages.push(...imageUrls);
    await memorial.save();
    res.json({ message: 'Фото успешно загружены', images: memorial.galleryImages });
  } catch (error) {
    console.error('Ошибка загрузки фото в галерею мемориала:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке фото' });
  }
});
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Memorial = require('../models/Memorial');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');
const { checkEditPermission } = require('../utils/permissions');

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
    // Поиск мемориалов по createdBy (унификация логики)
    const memorials = await Memorial.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(memorials);
  } catch (error) {
    console.error('Ошибка получения мемориалов пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении мемориалов пользователя' });
  }
});

// Настройка multer для загрузки фонов шапки
const headerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../upload/headers');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'header-' + req.params.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadHeader = multer({ 
  storage: headerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения'), false);
    }
  }
});

// Обновление фона шапки мемориала
router.put('/:id/header-background', authMiddleware, uploadHeader.single('headerBackground'), async (req, res) => {
  try {
    console.log('=== Запрос на обновление фона шапки ===');
    console.log('Memorial ID:', req.params.id);
    console.log('User ID:', req.user._id);
    console.log('File:', req.file ? req.file.filename : 'НЕТ ФАЙЛА');
    
    const memorial = await Memorial.findById(req.params.id);
    
    if (!memorial) {
      console.log('ОШИБКА: Мемориал не найден');
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    console.log('Мемориал найден:', memorial.title);

    // Проверяем права на редактирование
    if (!checkEditPermission(memorial, req.user._id)) {
      console.log('ОШИБКА: Нет прав на редактирование');
      return res.status(403).json({ 
        message: 'Нет прав на редактирование этого мемориала' 
      });
    }

    console.log('Права проверены - OK');

    // Удаляем старый файл фона если есть
    if (memorial.headerBackground) {
      console.log('Удаляем старый фон:', memorial.headerBackground);
      const oldPath = path.join(__dirname, '../upload/headers', path.basename(memorial.headerBackground));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log('Старый файл удален');
      }
    }

    // Обновляем путь к новому фону
    const headerBackgroundUrl = `/upload/headers/${req.file.filename}`;
    console.log('Новый путь к фону:', headerBackgroundUrl);
    
    memorial.headerBackground = headerBackgroundUrl;
    await memorial.save();
    
    console.log('Мемориал сохранен в базе данных');
    console.log('Финальный headerBackground в базе:', memorial.headerBackground);

    res.json({ 
      message: 'Фон шапки обновлен успешно',
      headerBackground: headerBackgroundUrl
    });
    
    console.log('=== Ответ отправлен клиенту ===');
  } catch (error) {
    console.error('=== ОШИБКА при обновлении фона шапки ===', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при обновлении фона шапки' 
    });
  }
});

// Удаление фона шапки мемориала
router.delete('/:id/header-background', authMiddleware, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);
    
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Проверяем права на редактирование
    if (!checkEditPermission(memorial, req.user._id)) {
      return res.status(403).json({ 
        message: 'Нет прав на редактирование этого мемориала' 
      });
    }

    // Удаляем файл фона
    if (memorial.headerBackground) {
      const filePath = path.join(__dirname, '../upload/headers', path.basename(memorial.headerBackground));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Очищаем поле в базе данных
    memorial.headerBackground = null;
    await memorial.save();

    res.json({ message: 'Фон шапки удален успешно' });
  } catch (error) {
    console.error('Ошибка удаления фона шапки:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при удалении фона шапки' 
    });
  }
});

// Обновление фона аватара мемориала
router.put('/:id/avatar-background', authMiddleware, uploadHeader.single('avatarBackground'), async (req, res) => {
  try {
    console.log('=== Запрос на обновление фона аватара ===');
    console.log('Memorial ID:', req.params.id);
    console.log('User ID:', req.user._id);
    console.log('File:', req.file ? req.file.filename : 'НЕТ ФАЙЛА');
    
    const memorial = await Memorial.findById(req.params.id);
    
    if (!memorial) {
      console.log('ОШИБКА: Мемориал не найден');
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    console.log('Мемориал найден:', memorial.title);

    // Проверяем права на редактирование
    if (!checkEditPermission(memorial, req.user._id)) {
      console.log('ОШИБКА: Нет прав на редактирование');
      return res.status(403).json({ 
        message: 'Нет прав на редактирование этого мемориала' 
      });
    }

    console.log('Права проверены - OK');

    // Удаляем старый файл фона если есть
    if (memorial.avatarBackground) {
      console.log('Удаляем старый фон аватара:', memorial.avatarBackground);
      const oldPath = path.join(__dirname, '../upload/headers', path.basename(memorial.avatarBackground));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log('Старый файл удален');
      }
    }

    // Обновляем путь к новому фону аватара
    const avatarBackgroundUrl = `/upload/headers/${req.file.filename}`;
    console.log('Новый путь к фону аватара:', avatarBackgroundUrl);
    
    memorial.avatarBackground = avatarBackgroundUrl;
    await memorial.save();
    
    console.log('Мемориал сохранен в базе данных');
    console.log('Финальный avatarBackground в базе:', memorial.avatarBackground);

    res.json({ 
      message: 'Фон аватара обновлен успешно',
      avatarBackground: avatarBackgroundUrl
    });
    
    console.log('=== Ответ отправлен клиенту ===');
  } catch (error) {
    console.error('=== ОШИБКА при обновлении фона аватара ===', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при обновлении фона аватара' 
    });
  }
});

// Удаление фона аватара мемориала
router.delete('/:id/avatar-background', authMiddleware, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);
    
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Проверяем права на редактирование
    if (!checkEditPermission(memorial, req.user._id)) {
      return res.status(403).json({ 
        message: 'Нет прав на редактирование этого мемориала' 
      });
    }

    // Удаляем файл с диска если есть
    if (memorial.avatarBackground) {
      const filePath = path.join(__dirname, '../upload/headers', path.basename(memorial.avatarBackground));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Очищаем поле в базе данных
    memorial.avatarBackground = null;
    await memorial.save();

    res.json({ message: 'Фон аватара удален успешно' });
  } catch (error) {
    console.error('Ошибка удаления фона аватара:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при удалении фона аватара' 
    });
  }
});

// Обновление фонового изображения страницы
router.put('/:id/page-background', authMiddleware, uploadHeader.single('pageBackground'), async (req, res) => {
  console.log('=== ЗАПРОС на обновление фона страницы ===');
  console.log('Memorial ID:', req.params.id);
  console.log('File:', req.file ? req.file.filename : 'Нет файла');
  
  try {
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      console.log('Мемориал не найден');
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    console.log('Мемориал найден:', memorial.firstName, memorial.lastName);

    // Проверка прав доступа
    const userId = req.user.id || req.user._id;
    const memorialCreatorId = memorial.createdBy?.toString() || memorial.createdBy;
    
    if (memorialCreatorId !== userId.toString()) {
      console.log('Недостаточно прав для редактирования');
      return res.status(403).json({ message: 'Недостаточно прав для редактирования этого мемориала' });
    }

    if (!req.file) {
      console.log('Файл не загружен');
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    console.log('Начинаем обработку нового фона страницы...');

    // Удаляем старый файл если есть
    if (memorial.pageBackground) {
      console.log('Удаляем старый фон страницы:', memorial.pageBackground);
      const oldPath = path.join(__dirname, '../upload/headers', path.basename(memorial.pageBackground));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log('Старый файл удален');
      }
    }

    // Обновляем путь к новому фону страницы
    const pageBackgroundUrl = `/upload/headers/${req.file.filename}`;
    console.log('Новый путь к фону страницы:', pageBackgroundUrl);
    
    memorial.pageBackground = pageBackgroundUrl;
    await memorial.save();
    
    console.log('Мемориал сохранен в базе данных');
    console.log('Финальный pageBackground в базе:', memorial.pageBackground);

    res.json({ 
      message: 'Фон страницы обновлен успешно',
      pageBackground: pageBackgroundUrl
    });
    
    console.log('=== Ответ отправлен клиенту ===');
  } catch (error) {
    console.error('=== ОШИБКА при обновлении фона страницы ===', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при загрузке фона страницы',
      error: error.message 
    });
  }
});

// Удаление фонового изображения страницы
router.delete('/:id/page-background', authMiddleware, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Проверка прав доступа
    const userId = req.user.id || req.user._id;
    const memorialCreatorId = memorial.createdBy?.toString() || memorial.createdBy;
    
    if (memorialCreatorId !== userId.toString()) {
      return res.status(403).json({ message: 'Недостаточно прав для редактирования этого мемориала' });
    }

    // Удаляем файл с диска если есть
    if (memorial.pageBackground) {
      const filePath = path.join(__dirname, '../upload/headers', path.basename(memorial.pageBackground));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Очищаем поле в базе данных
    memorial.pageBackground = null;
    await memorial.save();

    res.json({ message: 'Фон страницы удален успешно' });
  } catch (error) {
    console.error('Ошибка удаления фона страницы:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при удалении фона страницы' 
    });
  }
});

module.exports = router;
