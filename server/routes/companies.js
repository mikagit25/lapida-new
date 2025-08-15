
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const Company = require('../models/Company');
const { auth } = require('../middleware/auth');
const Product = require('../models/Product');

// Удалить фото из галереи компании
router.delete('/:id/gallery', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL обязателен' });

    company.gallery = company.gallery.filter(photo => photo !== url);
    await company.save();
    res.json({ gallery: company.gallery });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления фото', error: error.message });
  }
});

// Получить все товары компании
router.get('/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ company: req.params.id });
    console.log('Products for company', req.params.id, ':', products);
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Ошибка получения товаров', error: error.message });
  }
});

// --- upload объявляется ниже ---
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

// --- CRUD товары/услуги через отдельную коллекцию Product ---
// Добавить товар/услугу с несколькими фото
router.post('/:id/products', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name) return res.status(400).json({ message: 'Название обязательно' });
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => `/uploads/company-gallery/${f.filename}`);
    }
    // Генерируем slug: латиница, цифры, дефисы, уникальность по id
    // Транслитерация кириллицы в латиницу для slug
    function translit(str) {
      const ru = ['а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я'];
      const en = ['a','b','v','g','d','e','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','sch','','y','','e','yu','ya'];
      return str.split('').map(s => {
        const lower = s.toLowerCase();
        const idx = ru.indexOf(lower);
        if (idx >= 0) return en[idx];
        if (/^[a-z0-9]$/i.test(s)) return s.toLowerCase();
        if (s === ' ' || s === '_' || s === '-') return '-';
        return '';
      }).join('').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    }

    // slug = транслит названия + короткий id
    const tempId = Math.random().toString(36).slice(2, 8);
    const baseSlug = translit(name);
    let product = await Product.create({
      company: company._id,
      name,
      slug: baseSlug + '-' + tempId,
      description,
      price,
      category,
      images
    });
    // После создания товара обновляем slug с реальным id
    product.slug = baseSlug + '-' + product._id.toString().slice(-6);
    await product.save();
  // Диагностика: выводим все товары после создания и сам созданный товар
  const allProducts = await Product.find({});
  console.log('Все товары после создания:', allProducts.map(p => p._id.toString()));
  console.log('Созданный товар:', product);
  res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления товара', error: error.message });
  }
});

// Редактировать товар
router.put('/:id/products/:productId', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    // Если передан список оставшихся фото, используем его
    let imagesFromClient = req.body.existingImages;
    if (imagesFromClient) {
      if (typeof imagesFromClient === 'string') {
        try {
          imagesFromClient = JSON.parse(imagesFromClient);
        } catch (e) {
          imagesFromClient = [imagesFromClient];
        }
      }
      // Добавляем новые фото только к актуальному списку
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => `/uploads/company-gallery/${f.filename}`);
        product.images = [...imagesFromClient, ...newImages];
      } else {
        product.images = imagesFromClient;
      }
    } else {
      // Если existingImages не передан, добавляем новые фото к текущему массиву
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => `/uploads/company-gallery/${f.filename}`);
        product.images = [...product.images, ...newImages];
      }
    }
    await product.save();
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка редактирования товара', error: error.message });
  }
});

// Удалить товар
router.delete('/:id/products/:productId', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    await Product.deleteOne({ _id: req.params.productId, company: company._id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления товара', error: error.message });
  }
});

// --- upload объявляется ниже ---
// Настройка хранения файлов для логотипов компаний
const logoDir = path.join(__dirname, '../public/uploads/company-logos');
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}
const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, logoDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, filename);
  }
});
const uploadLogo = multer({ storage: logoStorage });

// Загрузить/заменить логотип компании
router.put('/:id/logo', auth, uploadLogo.single('logo'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    // Удалить старый логотип
    if (company.logo) {
      const oldPath = path.join(logoDir, path.basename(company.logo));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    // Сохранить новый логотип
    if (req.file) {
      const logoUrl = `/uploads/company-logos/${req.file.filename}`;
      company.logo = logoUrl;
      await company.save();
      return res.json({ logo: logoUrl, company });
    }
    return res.status(400).json({ message: 'Файл не загружен' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки логотипа' });
  }
});

// Удалить логотип компании
router.delete('/:id/logo', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    if (company.logo) {
      const logoPath = path.join(logoDir, path.basename(company.logo));
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
      company.logo = '';
      await company.save();
      return res.json({ message: 'Логотип удалён', company });
    }
    return res.status(400).json({ message: 'Логотип не найден' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления логотипа' });
  }
});
// Обновить данные компании
// Обновить данные компании и контакты
router.put('/:id', auth, async (req, res) => {
  try {
  const { name, address, inn, description, contacts, phones, emails, lat, lng } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
  company.name = name || company.name;
  company.address = address || company.address;
  company.inn = inn || company.inn;
  company.description = description || company.description;
  if (contacts) company.contacts = { ...company.contacts, ...contacts };
  if (Array.isArray(phones)) company.phones = phones;
  if (Array.isArray(emails)) company.emails = emails;
  if (typeof lat === 'number' || lat === null) company.lat = lat;
  if (typeof lng === 'number' || lng === null) company.lng = lng;
    company.updatedAt = Date.now();
    await company.save();
    res.json({ company });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления компании' });
  }
});

// Получить товары/услуги
// Добавить отзыв
router.post('/:id/reviews', async (req, res) => {
  try {
    const { author, text, rating } = req.body;
    if (!text || !rating) return res.status(400).json({ message: 'Текст и рейтинг обязательны' });
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    company.reviews.push({ author, text, rating });
    await company.save();
    res.json({ reviews: company.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления отзыва' });
  }
});
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
// Добавить новость
// Добавить сотрудника
router.post('/:id/team', auth, async (req, res) => {
  try {
    const { name, position, photo, contacts } = req.body;
    if (!name || !position) return res.status(400).json({ message: 'Имя и должность обязательны' });
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    company.team.push({ name, position, photo, contacts });
    await company.save();
    res.json({ team: company.team });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления сотрудника' });
  }
});

// Получить команду
router.get('/:id/team', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    res.json({ team: company.team });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения команды' });
  }
});

// Удалить сотрудника
router.delete('/:id/team/:teamId', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    company.team = company.team.filter(t => t._id.toString() !== req.params.teamId);
    await company.save();
    res.json({ team: company.team });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления сотрудника' });
  }
});
router.post('/:id/news', auth, async (req, res) => {
  try {
    const { title, text, image } = req.body;
    if (!title || !text) return res.status(400).json({ message: 'Заголовок и текст обязательны' });
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    company.news.push({ title, text, image });
    await company.save();
    res.json({ news: company.news });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления новости' });
  }
});

// Получить новости
router.get('/:id/news', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    res.json({ news: company.news });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения новостей' });
  }
});

// Удалить новость
router.delete('/:id/news/:newsId', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    company.news = company.news.filter(n => n._id.toString() !== req.params.newsId);
    await company.save();
    res.json({ news: company.news });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления новости' });
  }
});
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

    let isOwner = false;
    // Проверка авторизации через токен/cookie
    try {
      const authHeader = req.header('Authorization');
      const cookieToken = req.cookies?.token;
      let token = null;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      } else if (cookieToken) {
        token = cookieToken;
      }
      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.userId && company.owner && company.owner.toString() === decoded.userId.toString()) {
          isOwner = true;
        }
      }
    } catch (e) {}

  // Вставляем isOwner и контакты в ответ
  const companyObj = company.toObject();
  companyObj.isOwner = isOwner;
  companyObj.phones = Array.isArray(company.phones) ? company.phones : [];
  companyObj.emails = Array.isArray(company.emails) ? company.emails : [];
  // Получить актуальные товары из коллекции Product
  const products = await Product.find({ company: company._id });
  companyObj.products = products;
  res.json({ company: companyObj });
  } catch (error) {
    console.error('Ошибка получения компании:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении компании' });
  }
});

module.exports = router;
