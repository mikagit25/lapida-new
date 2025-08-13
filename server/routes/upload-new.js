const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');

// Функция для получения базового URL сервера
const getServerBaseUrl = (req) => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

const router = express.Router();

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../upload');
    
    // Создаем папку upload если её нет
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Фильтр для проверки типа файлов
const fileFilter = (req, file, cb) => {
  // Разрешенные типы изображений
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый тип файла. Разрешены только изображения.'), false);
  }
};

// Настройка multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Загрузка одного изображения
router.post('/single', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const fullPath = req.file.path.replace(/\\/g, '/');
    const uploadIndex = fullPath.indexOf('/upload/');
    const relativePath = uploadIndex !== -1 ? fullPath.substring(uploadIndex + 8) : req.file.filename;
    const fileUrl = `${getServerBaseUrl(req)}/upload/${relativePath}`;
    
    console.log('Single upload result:', fileUrl);
    
    res.json({ 
      message: 'Файл успешно загружен',
      fileUrl: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке файла' });
  }
});

// Загрузка нескольких изображений
router.post('/multiple', authMiddleware, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }

    const fileUrls = req.files.map(file => {
      const fullPath = file.path.replace(/\\/g, '/');
      const uploadIndex = fullPath.indexOf('/upload/');
      const relativePath = uploadIndex !== -1 ? fullPath.substring(uploadIndex + 8) : file.filename;
      return `${getServerBaseUrl(req)}/upload/${relativePath}`;
    });
    
    console.log('Multiple upload result:', fileUrls);
    
    res.json({ 
      message: 'Файлы успешно загружены',
      fileUrls: fileUrls
    });
  } catch (error) {
    console.error('Ошибка загрузки файлов:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке файлов' });
  }
});

// Загрузка аватара
router.post('/avatar', authMiddleware, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const fullPath = req.file.path.replace(/\\/g, '/');
    const uploadIndex = fullPath.indexOf('/upload/');
    const relativePath = uploadIndex !== -1 ? fullPath.substring(uploadIndex + 8) : req.file.filename;
    const fileUrl = `${getServerBaseUrl(req)}/upload/${relativePath}`;
    
    console.log('Avatar upload result:', fileUrl);
    
    res.json({ 
      message: 'Аватар успешно загружен',
      fileUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Ошибка загрузки аватара:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке аватара' });
  }
});

// Загрузка фото для галереи
router.post('/gallery', optionalAuthMiddleware, upload.array('photos', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }
    
    const fileUrls = req.files.map(file => {
      const fullPath = file.path.replace(/\\/g, '/');
      const uploadIndex = fullPath.indexOf('/upload/');
      const relativePath = uploadIndex !== -1 ? fullPath.substring(uploadIndex + 8) : file.filename;
      return `${getServerBaseUrl(req)}/upload/${relativePath}`;
    });
    
    console.log('Gallery upload result:', fileUrls);
    
    res.json({ 
      message: 'Фото для галереи успешно загружены',
      fileUrls: fileUrls
    });
  } catch (error) {
    console.error('Ошибка загрузки фото для галереи:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке фото' });
  }
});

// Загрузка фото для timeline
router.post('/timeline', optionalAuthMiddleware, upload.array('photos', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }
    
    const fileUrls = req.files.map(file => {
      const fullPath = file.path.replace(/\\/g, '/');
      const uploadIndex = fullPath.indexOf('/upload/');
      const relativePath = uploadIndex !== -1 ? fullPath.substring(uploadIndex + 8) : file.filename;
      return `${getServerBaseUrl(req)}/upload/${relativePath}`;
    });
    
    console.log('Timeline upload result:', fileUrls);
    
    res.json({ 
      message: 'Фото для timeline успешно загружены',
      fileUrls: fileUrls
    });
  } catch (error) {
    console.error('Ошибка загрузки фото для timeline:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке фото' });
  }
});

// Загрузка фото для виртуальных цветов
router.post('/virtual-flowers', optionalAuthMiddleware, upload.single('flower'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const fullPath = req.file.path.replace(/\\/g, '/');
    const uploadIndex = fullPath.indexOf('/upload/');
    const relativePath = uploadIndex !== -1 ? fullPath.substring(uploadIndex + 8) : req.file.filename;
    const fileUrl = `${getServerBaseUrl(req)}/upload/${relativePath}`;
    
    console.log('Virtual flower upload result:', fileUrl);
    
    res.json({ 
      message: 'Цветок успешно загружен',
      fileUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Ошибка загрузки цветка:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке цветка' });
  }
});

module.exports = router;
