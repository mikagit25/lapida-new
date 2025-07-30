const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');

const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../upload');
    
    // Создаем папки если их нет
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    let folder = '';
    // Определяем папку по пути запроса
    if (req.route.path === '/single') {
      folder = 'memorials';
    } else if (req.route.path === '/gallery') {
      folder = 'gallery';
    } else {
      folder = 'misc';
    }
    
    const finalPath = path.join(uploadPath, folder);
    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }
    
    cb(null, finalPath);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Фильтр файлов - только изображения и видео
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения (JPEG, PNG, GIF, WebP) и видео (MP4, MOV, AVI, MKV)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB максимум
  },
  fileFilter: fileFilter
});

// Загрузка одного файла (портрет мемориала)
router.post('/single', optionalAuthMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }
    
    // Возвращаем путь к файлу относительно сервера
    const fullPath = req.file.path.replace(/\\/g, '/');
    const uploadIndex = fullPath.indexOf('/upload/');
    const relativePath = uploadIndex !== -1 ? fullPath.substring(uploadIndex + 8) : req.file.filename;
    const fileUrl = `http://localhost:5002/upload/${relativePath}`;
    
    console.log('Upload result:', {
      fullPath,
      relativePath,
      fileUrl
    });
    
    res.json({
      message: 'Файл успешно загружен',
      fileUrl: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Ошибка загрузки файла', error: error.message });
  }
});

// Загрузка нескольких файлов (галерея)
router.post('/gallery', optionalAuthMiddleware, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }
    
    const uploadedFiles = req.files.map(file => {
      const fullPath = file.path.replace(/\\/g, '/');
      const uploadIndex = fullPath.indexOf('/upload/');
      const relativePath = uploadIndex !== -1 ? fullPath.substring(uploadIndex + 8) : file.filename;
      return {
        fileUrl: `http://localhost:5002/upload/${relativePath}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
      };
    });
    
    res.json({
      message: 'Файлы успешно загружены',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Ошибка загрузки файлов', error: error.message });
  }
});

// Удаление файла
router.delete('/file', authMiddleware, (req, res) => {
  try {
    const { fileUrl } = req.body;
    
    if (!fileUrl) {
      return res.status(400).json({ message: 'URL файла не указан' });
    }
    
    // Извлекаем путь к файлу
    const filePath = path.join(__dirname, '../upload', fileUrl.replace('/upload/', ''));
    
    // Проверяем существование файла
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Файл успешно удален' });
    } else {
      res.status(404).json({ message: 'Файл не найден' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Ошибка удаления файла', error: error.message });
  }
});

module.exports = router;
