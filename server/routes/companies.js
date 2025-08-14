const express = require('express');
const Company = require('../models/Company');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Настройка хранения файлов для галереи компаний
const uploadDir = path.join(__dirname, '../public/uploads/company-gallery');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

const router = express.Router();

// Добавить товар/услугу
router.post('/:id/products', auth, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name) return res.status(400).json({ message: 'Название обязательно' });
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    company.products.push({ name, description, price, category });
    await company.save();
    res.json({ products: company.products });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления товара' });
  }
});

// Получить товары/услуги
router.get('/:id/products', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    res.json({ products: company.products });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения товаров' });
  }
});

// Добавить документ
router.post('/:id/documents', auth, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL обязателен' });
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    company.documents.push(url);
    await company.save();
    res.json({ documents: company.documents });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления документа' });
  }
});

// Добавить фото в галерею
router.post('/:id/gallery', auth, upload.single('image'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });

    // Если загружен файл
    if (req.file) {
      const fileUrl = `/uploads/company-gallery/${req.file.filename}`;
      company.gallery.push(fileUrl);
      await company.save();
      return res.json({ gallery: company.gallery });
    }

    // Если передан url
    const { url } = req.body;
    if (url) {
      company.gallery.push(url);
      await company.save();
      return res.json({ gallery: company.gallery });
    }

    return res.status(400).json({ message: 'Не передан файл или URL' });
  } catch (error) {
    console.error('Ошибка загрузки фото в галерею компании:', error);
    res.status(500).json({ message: 'Ошибка добавления фото', error: error.message, stack: error.stack });
  }
});

// Добавить отзыв
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { text, rating } = req.body;
    if (!text) return res.status(400).json({ message: 'Текст обязателен' });
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    company.reviews.push({ author: req.user._id, text, rating });
    await company.save();
    res.json({ reviews: company.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления отзыва' });
  }
});

// Создать компанию
router.post('/', auth, async (req, res) => {
  try {
    const { name, address, inn, description } = req.body;
    if (!name || !address || !inn) {
      return res.status(400).json({ message: 'Заполните все обязательные поля' });
    }
    const company = new Company({
      name,
      address,
      inn,
      description,
      owner: req.user._id
    });
    await company.save();
    res.status(201).json({ company });
  } catch (error) {
    console.error('Ошибка создания компании:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании компании' });
  }
});

// Получить список компаний
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().select('-documents -products -reviews');
    res.json({ companies });
  } catch (error) {
    console.error('Ошибка получения компаний:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении компаний' });
  }
});

// Получить одну компанию
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    res.json({ company });
  } catch (error) {
    console.error('Ошибка получения компании:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении компании' });
  }
});

module.exports = router;
