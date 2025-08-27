const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const uploadDir = path.join(__dirname, '../upload/media');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Временное хранилище файлов (в памяти)
const mediaFiles = [];

// Загрузка файла
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Файл обязателен' });
  const file = {
    id: Date.now(),
    name: req.file.originalname,
    type: req.file.mimetype,
    url: '/upload/media/' + req.file.filename
  };
  mediaFiles.push(file);
  res.json(file);
});

// Получить все файлы
router.get('/', (req, res) => {
  res.json(mediaFiles);
});

module.exports = router;
