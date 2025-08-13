const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');

const getServerBaseUrl = (req) => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine subfolder by route
    let folder = 'misc';
    if (req.baseUrl.includes('avatar')) {
      folder = 'users';
    } else if (req.baseUrl.includes('gallery')) {
      folder = 'gallery';
    } else if (req.baseUrl.includes('timeline')) {
      folder = 'timeline';
    } else if (req.baseUrl.includes('virtual-flowers')) {
      folder = 'flowers';
    } else if (req.baseUrl.includes('multiple')) {
      folder = 'memorials';
    } else if (req.baseUrl.includes('memorials')) {
      folder = 'memorials';
    }
    const uploadPath = path.join(__dirname, '../upload', folder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
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
    cb(new Error('Недопустимый тип файла'), false);
  }
}

const upload = multer({ storage, fileFilter });

router.post('/multiple', authMiddleware, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }

    const fileUrls = req.files.map(file => {
      const folder = 'memorials';
      return `${getServerBaseUrl(req)}/upload/${folder}/${file.filename}`;
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

router.post('/avatar', authMiddleware, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const folder = 'users';
    const fileUrl = `${getServerBaseUrl(req)}/upload/${folder}/${req.file.filename}`;
    
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

router.post('/gallery', optionalAuthMiddleware, upload.array('photos', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }
    
    const folder = 'gallery';
    const fileUrls = req.files.map(file => {
      return `${getServerBaseUrl(req)}/upload/${folder}/${file.filename}`;
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

router.post('/timeline', optionalAuthMiddleware, upload.array('photos', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }
    const folder = 'timeline';
    const fileUrls = req.files.map(file => {
      return `${getServerBaseUrl(req)}/upload/${folder}/${file.filename}`;
    });
    console.log('Timeline upload result:', fileUrls);
    res.json({
      message: 'Фото для галереи успешно загружены',
      fileUrls: fileUrls
    });
  } catch (error) {
    console.error('Ошибка загрузки фото для галереи:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке фото' });
  }
});

router.post('/virtual-flowers', optionalAuthMiddleware, upload.single('flower'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const folder = 'flowers';
    const fileUrl = `${getServerBaseUrl(req)}/upload/${folder}/${req.file.filename}`;
    
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
