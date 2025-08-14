const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Memorial = require('../models/Memorial');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
// Настройка multer для загрузки фото галереи мемориала
const galleryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../upload/memorials');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const galleryUpload = multer({ storage: galleryStorage });

// Универсальный upload для фото и токена
const galleryAnyUpload = multer({ storage: galleryStorage }).any();

// Загрузка фото в галерею мемориала
router.post('/:id/gallery', galleryAnyUpload, authMiddleware, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    if (memorial.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав на добавление фото' });
    }
    const imageUrls = req.files.map(f => ({ url: '/upload/memorials/' + f.filename, caption: '' }));
    if (!memorial.galleryImages) memorial.galleryImages = [];
    memorial.galleryImages.push(...imageUrls);
    await memorial.save();
    res.json({ message: 'Фото успешно загружены', galleryImages: memorial.galleryImages });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки фото', error: error.message });
  }
});
// Удалить фото из галереи мемориала (требует авторизации)
router.delete('/:id/gallery', authMiddleware, async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) {
      return res.status(400).json({ message: 'Не указан URL фото для удаления' });
    }
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    // Проверить права
    if (!checkEditPermission(memorial, req.user._id)) {
      return res.status(403).json({ message: 'Нет прав на редактирование этого мемориала' });
    }
    // Найти фото по имени файла
    const photoFileName = path.basename(photoUrl);
    const idx = memorial.galleryImages.findIndex(img => {
      if (typeof img === 'string') return path.basename(img) === photoFileName;
      if (img.url) return path.basename(img.url) === photoFileName;
      return false;
    });
    if (idx === -1) {
      return res.status(404).json({ message: 'Фото не найдено в галерее' });
    }
    // Удалить файл с диска
    const filePath = path.join(__dirname, '../upload/gallery', photoFileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // Удалить фото из массива
    memorial.galleryImages.splice(idx, 1);
    await memorial.save();
    res.json({ message: 'Фото удалено', galleryImages: memorial.galleryImages });
  } catch (error) {
    console.error('Ошибка удаления фото из галереи:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении фото', error: error.message });
  }
});



// Функция проверки прав редактирования
const checkEditPermission = (memorial, userId) => {
  if (!memorial || !userId) return false;
  
  const memorialCreatedBy = typeof memorial.createdBy === 'object' 
    ? memorial.createdBy._id || memorial.createdBy.id 
    : memorial.createdBy;
    
  // Создатель мемориала
  if (memorialCreatedBy && memorialCreatedBy.toString() === userId.toString()) return true;
  
  // Редакторы мемориала
  if (memorial.editorsUsers && memorial.editorsUsers.includes(userId.toString())) return true;
  
  return false;
};

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
    
    // Увеличить счетчик просмотров
    await memorial.incrementViews();
    
    res.json(memorial);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении мемориала', error: error.message });
  }
});

// Получить мемориал по customSlug (публичный доступ)
router.get('/slug/:slug', async (req, res) => {
  try {
    const memorial = await Memorial.findOne({ customSlug: req.params.slug })
      .populate('createdBy', 'name')
      .populate('allowedUsers', 'name email');
    
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    
    // Увеличить счетчик просмотров
    await memorial.incrementViews();
    
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
      timeline = [],
      isPrivate = false
    } = req.body;
    // galleryImages всегда пустой массив при создании
    const galleryImages = Array.isArray(req.body.galleryImages) ? req.body.galleryImages : [];
    // Валидация обязательных полей
    if (!firstName || !lastName || !birthDate || !deathDate || !location?.cemetery) {
      return res.status(400).json({ 
        message: 'Обязательные поля: firstName, lastName, birthDate, deathDate, location.cemetery',
        missing: {
          firstName: !firstName,
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
    const allowedUpdates = [
      'firstName', 'lastName', 'birthDate', 'deathDate', 'biography', 'epitaph', 'profileImage', 'galleryImages', 'timeline', 'isPrivate', 'location'
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

    console.log('Мемориал найден:', memorial.firstName, memorial.lastName);

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

// Настройка multer для загрузки фото захоронения
const graveStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../upload/graves');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'grave-' + req.params.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadGrave = multer({ 
  storage: graveStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения'), false);
    }
  }
});

// Обновление фото захоронения
router.put('/:id/grave-photo', authMiddleware, uploadGrave.single('gravePhoto'), async (req, res) => {
  try {
    console.log('=== Запрос на добавление фото захоронения ===');
    console.log('Memorial ID:', req.params.id);
    console.log('User ID:', req.user._id);
    console.log('File:', req.file ? req.file.filename : 'НЕТ ФАЙЛА');
    console.log('Description:', req.body.description);
    
    const memorial = await Memorial.findById(req.params.id);
    
    if (!memorial) {
      console.log('ОШИБКА: Мемориал не найден');
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    console.log('Мемориал найден:', memorial.firstName, memorial.lastName);

    // Проверяем права на редактирование
    if (!checkEditPermission(memorial, req.user._id)) {
      console.log('ОШИБКА: Нет прав на редактирование');
      return res.status(403).json({ 
        message: 'Нет прав на редактирование этого мемориала' 
      });
    }

    console.log('Права проверены - OK');

    // Создаем URL для нового фото
    const gravePhotoUrl = `/upload/graves/${req.file.filename}`;
    console.log('Новый путь к фото захоронения:', gravePhotoUrl);
    
    // Инициализируем location если его нет
    if (!memorial.location) {
      memorial.location = {};
    }
    
    // Инициализируем массив gravePhotos если его нет
    if (!memorial.location.gravePhotos) {
      memorial.location.gravePhotos = [];
    }
    
    // Добавляем новое фото в массив
    memorial.location.gravePhotos.push({
      url: gravePhotoUrl,
      uploadedAt: new Date(),
      description: req.body.description || ''
    });
    
    await memorial.save();
    
    console.log('Мемориал сохранен в базе данных');
    console.log('Добавлено фото захоронения:', gravePhotoUrl);

    res.json({ 
      message: 'Фото захоронения добавлено успешно',
      gravePhoto: {
        url: gravePhotoUrl,
        uploadedAt: new Date(),
        description: req.body.description || ''
      },
      totalPhotos: memorial.location.gravePhotos.length,
      memorial: memorial  // Добавляем полный объект мемориала
    });
    
    console.log('=== Ответ отправлен клиенту ===');
  } catch (error) {
    console.error('=== ОШИБКА при добавлении фото захоронения ===', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при добавлении фото захоронения' 
    });
  }
});

// Удаление конкретного фото захоронения
router.delete('/:id/grave-photo/:photoIndex', authMiddleware, async (req, res) => {
  try {
    const { photoIndex } = req.params;
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

    // Проверяем индекс
    if (!memorial.location?.gravePhotos || photoIndex >= memorial.location.gravePhotos.length) {
      return res.status(404).json({ message: 'Фото не найдено' });
    }

    // Получаем фото для удаления
    const photoToDelete = memorial.location.gravePhotos[photoIndex];
    
    // Удаляем файл
    if (photoToDelete.url) {
      const filePath = path.join(__dirname, '../upload/graves', path.basename(photoToDelete.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Удаляем фото из массива
    memorial.location.gravePhotos.splice(photoIndex, 1);
    await memorial.save();

    res.json({ 
      message: 'Фото захоронения удалено успешно',
      remainingPhotos: memorial.location.gravePhotos.length,
      memorial: memorial  // Добавляем полный объект мемориала
    });
  } catch (error) {
    console.error('Ошибка удаления фото захоронения:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при удалении фото захоронения' 
    });
  }
});

// Настройка multer для загрузки фона страницы
const pageBackgroundStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../upload/page-backgrounds');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'page-bg-' + req.params.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadPageBackground = multer({ 
  storage: pageBackgroundStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения'), false);
    }
  }
});

// Установка фона страницы
router.put('/:id/page-background', authMiddleware, uploadPageBackground.single('pageBackground'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Удаляем старый файл, если он есть
    if (memorial.pageBackground) {
      const oldFilePath = path.join(__dirname, '..', memorial.pageBackground);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Сохраняем путь к новому файлу
    const relativePath = `/upload/${req.file.filename}`;
    memorial.pageBackground = relativePath;
    await memorial.save();

    res.json({
      message: 'Фон страницы успешно обновлен',
      pageBackground: relativePath
    });
  } catch (error) {
    console.error('Ошибка установки фона страницы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление фона страницы
router.delete('/:id/page-background', authMiddleware, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    // Удаляем файл с диска
    if (memorial.pageBackground) {
      const filePath = path.join(__dirname, '..', memorial.pageBackground);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Убираем ссылку из базы данных
    memorial.pageBackground = null;
    await memorial.save();

    res.json({ message: 'Фон страницы успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления фона страницы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить галерею мемориала (требует авторизации)
router.patch('/:id/gallery', authMiddleware, async (req, res) => {
  try {
    const { galleryImages } = req.body;
    const memorial = await require('../models/Memorial').findById(req.params.id);
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

// Обновить главную фотографию мемориала (требует авторизации)
router.patch('/:id/profile-image', authMiddleware, async (req, res) => {
  try {
    const { profileImage } = req.body;
    const memorial = await require('../models/Memorial').findById(req.params.id);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    if (memorial.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав на редактирование главной фотографии' });
    }
    memorial.profileImage = profileImage;
    await memorial.save();
    res.json(memorial);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении главной фотографии', error: error.message });
  }
});

module.exports = router;
