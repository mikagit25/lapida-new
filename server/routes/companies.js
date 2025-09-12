const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Company = require('../models/Company');
const { auth } = require('../middleware/auth');
const Product = require('../models/Product');
// ...existing code...
// Сохранить/обновить ERPNext API-токен (только owner)
router.put('/:id/erpnext-token', require('../middleware/auth').auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Требуется токен' });
    company.erpnextToken = token;
    await company.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сохранения токена', error: error.message });
  }
});

// Проверить соединение с ERPNext (только owner)
router.post('/:id/erpnext-test', require('../middleware/auth').auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    const token = company.erpnextToken;
    if (!token) return res.status(400).json({ message: 'Токен не задан' });
    // Пример запроса к ERPNext (Sales Order)
    const axios = require('axios');
    const ERP_API = process.env.ERPNEXT_API_URL || 'http://localhost:8080/api/resource/Sales Order';
    try {
      const erpRes = await axios.get(ERP_API, { headers: { Authorization: `token ${token}` } });
      if (erpRes.data && erpRes.data.data) {
        res.json({ success: true, count: erpRes.data.data.length });
      } else {
        res.status(400).json({ success: false, message: 'Нет данных' });
      }
    } catch (e) {
      res.status(400).json({ success: false, message: 'Ошибка соединения с ERPNext', error: e.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка проверки ERPNext', error: error.message });
  }
});
const CompanyView = require('../models/CompanyView');
const Order = require('../models/Order');
// --- Аналитика компании ---
// GET /companies/:id/analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const companyId = req.params.id;
    // Просмотры всего
    const totalViewsAgg = await CompanyView.aggregate([
      { $match: { companyId: mongoose.Types.ObjectId(companyId) } },
      { $group: { _id: null, total: { $sum: '$count' } } }
    ]);
    const views = totalViewsAgg[0]?.total || 0;

    // Просмотры по дням (последние 14 дней)
    const today = new Date();
    const fromDate = new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000);
    const fromStr = fromDate.toISOString().slice(0, 10);
    const viewsByDay = await CompanyView.find({
      companyId,
      date: { $gte: fromStr }
    }).sort({ date: 1 });
    const viewsByDayArr = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(fromDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().slice(0, 10);
      const found = viewsByDay.find(v => v.date === dateStr);
      viewsByDayArr.push({ date: dateStr, count: found ? found.count : 0 });
    }

    // Заказы
    const ordersCount = await Order.countDocuments({ companyId });
    // Отзывы
    const company = await Company.findById(companyId).select('reviews');
    const reviewsCount = company && company.reviews ? company.reviews.length : 0;

    res.json({ stats: {
      views,
      orders: ordersCount,
      reviews: reviewsCount,
      viewsByDay: viewsByDayArr
    }});
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения аналитики', error: error.message });
  }
});
// --- История компании ---
const historyDir = path.join(__dirname, '../public/uploads/company-history');
if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir, { recursive: true });
}
const historyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, historyDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, filename);
  }
});
const uploadHistory = multer({ storage: historyStorage });

// Получить историю компании
router.get('/:id/history', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    res.json({ history: company.history || [] });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения истории', error: error.message });
  }
});

// Добавить этап в историю (только владелец)
router.post('/:id/history', auth, uploadHistory.single('image'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    const { date, title, description } = req.body;
    if (!date || !title) return res.status(400).json({ message: 'Требуется дата и заголовок' });
    const imageUrl = req.file ? `/uploads/company-history/${req.file.filename}` : '';
    const stage = { date, title, description: description || '', image: imageUrl };
    company.history.push(stage);
    await company.save();
    res.json({ history: company.history });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления этапа', error: error.message });
  }
});

// Удалить этап из истории (по индексу, только владелец)
router.delete('/:id/history/:idx', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    const idx = parseInt(req.params.idx, 10);
    if (isNaN(idx) || idx < 0 || idx >= company.history.length) return res.status(400).json({ message: 'Некорректный индекс' });
    company.history.splice(idx, 1);
    await company.save();
    res.json({ history: company.history });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления этапа', error: error.message });
  }
});
// Рекомендации/похожие компании по категории (исключая текущую)
router.get('/recommendations', async (req, res) => {
  try {
    const { category, exclude } = req.query;
    if (!category) return res.json({ companies: [] });
    const query = { _id: { $ne: exclude }, ...(category ? { 'products.category': category } : {}) };
    // Находим компании, у которых есть товары с такой категорией
    const companies = await Company.find(query).limit(8).select('name customSlug description address');
    res.json({ companies });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения рекомендаций', error: error.message });
  }
});
// Контактная форма: отправить сообщение владельцу компании
router.post('/:id/contact', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'Все поля обязательны' });
    // Здесь можно отправить email владельцу компании или сохранить сообщение в БД
    // Пока просто логируем
    console.log(`[CONTACT FORM] Компания: ${company.name} (${company._id}) | От: ${name} <${email}> | Сообщение: ${message}`);
    res.json({ message: 'Сообщение отправлено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка отправки сообщения', error: error.message });
  }
});
// Удалить работу из портфолио (по индексу, только владелец)
router.delete('/:id/portfolio/:idx', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    const idx = parseInt(req.params.idx, 10);
    if (isNaN(idx) || idx < 0 || idx >= company.portfolio.length) return res.status(400).json({ message: 'Некорректный индекс' });
    company.portfolio.splice(idx, 1);
    await company.save();
    res.json({ portfolio: company.portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления работы', error: error.message });
  }
});
// --- Portfolio (работы компании) ---
const portfolioDir = path.join(__dirname, '../public/uploads/company-portfolio');
if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true });
}
const portfolioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, portfolioDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, filename);
  }
});
const uploadPortfolio = multer({ storage: portfolioStorage });

// Получить работы компании
router.get('/:id/portfolio', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    res.json({ portfolio: company.portfolio || [] });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения портфолио', error: error.message });
  }
});

// Добавить работу в портфолио (только владелец)
router.post('/:id/portfolio', auth, uploadPortfolio.single('image'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    const { title, description, date } = req.body;
    if (!title || !req.file) return res.status(400).json({ message: 'Требуется изображение и заголовок' });
    const imageUrl = `/uploads/company-portfolio/${req.file.filename}`;
    const work = { image: imageUrl, title, description: description || '', date: date || '' };
    if (!Array.isArray(company.portfolio)) {
      company.portfolio = [];
    }
    company.portfolio.push(work);
    await company.save();
    res.json({ portfolio: company.portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления работы', error: error.message });
  }
});
// ...existing code...

// Удалить компанию
router.delete('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав на удаление этой компании' });
    }
    // Удалить связанные товары
    await Product.deleteMany({ company: company._id });
    // Удалить связанные файлы (галерея, документы, лого, headerBackground)
    const fileFields = ['gallery', 'documents', 'logo', 'headerBackground'];
    for (const field of fileFields) {
      if (Array.isArray(company[field])) {
        for (const file of company[field]) {
          if (file && typeof file === 'string' && file.startsWith('/uploads/')) {
            try {
              fs.unlinkSync(path.join(__dirname, '../public', file));
            } catch (e) {}
          }
        }
      } else if (company[field] && typeof company[field] === 'string' && company[field].startsWith('/uploads/')) {
        try {
          fs.unlinkSync(path.join(__dirname, '../public', company[field]));
        } catch (e) {}
      }
    }
    await company.deleteOne();
    res.json({ message: 'Компания и связанные данные удалены' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления компании', error: error.message });
  }
});

// Получить отзывы компании
router.get('/:id/reviews', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    res.json({ reviews: company.reviews || [] });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения отзывов' });
  }
});

// Получить компанию по customSlug (короткий адрес)
router.get('/by-slug/:customSlug', async (req, res) => {
  try {
    const company = await Company.findOne({ customSlug: req.params.customSlug });
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    let isOwner = false;
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
    // Инкрементировать просмотры
    try {
      const CompanyView = require('../models/CompanyView');
      const todayStr = new Date().toISOString().slice(0, 10);
      await CompanyView.findOneAndUpdate(
        { companyId: company._id, date: todayStr },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    } catch (e) { console.error('Ошибка записи CompanyView:', e); }

    const companyObj = company.toObject();
    companyObj.isOwner = isOwner;
    companyObj.phones = Array.isArray(company.phones) ? company.phones : [];
    companyObj.emails = Array.isArray(company.emails) ? company.emails : [];
    const products = await Product.find({ company: company._id });
    companyObj.products = products;
    res.json({ company: companyObj });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при получении компании' });
  }
});
// Временно отключено: Получить компанию по customSlug (короткий адрес)
// router.get('/slug/:customSlug', async (req, res) => {
//   try {
//     const company = await Company.findOne({ customSlug: req.params.customSlug });
//     if (!company) return res.status(404).json({ message: 'Компания не найдена' });
//     let isOwner = false;
//     try {
//       const authHeader = req.header('Authorization');
//       const cookieToken = req.cookies?.token;
//       let token = null;
//       if (authHeader && authHeader.startsWith('Bearer ')) {
//         token = authHeader.replace('Bearer ', '');
//       } else if (cookieToken) {
//         token = cookieToken;
//       }
//       if (token) {
//         const jwt = require('jsonwebtoken');
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (decoded && decoded.userId && company.owner && company.owner.toString() === decoded.userId.toString()) {
//           isOwner = true;
//         }
//       }
//     } catch (e) {}
//     const companyObj = company.toObject();
//     companyObj.isOwner = isOwner;
//     companyObj.phones = Array.isArray(company.phones) ? company.phones : [];
//     companyObj.emails = Array.isArray(company.emails) ? company.emails : [];
//     const products = await Product.find({ company: company._id });
//     companyObj.products = products;
//     res.json({ company: companyObj });
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка сервера при получении компании' });
//   }
// });

// Проверка уникальности customSlug
router.get('/check-slug', async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug) return res.json({ available: false });
    const exists = await Company.findOne({ customSlug: slug });
    res.json({ available: !exists });
  } catch (error) {
    res.status(500).json({ available: false, message: 'Ошибка проверки slug' });
  }
});

// --- Загрузка горизонтальных обоев за аватаром ---
const headerBgDir = path.join(__dirname, '../public/uploads/company-header-backgrounds');
if (!fs.existsSync(headerBgDir)) {
  fs.mkdirSync(headerBgDir, { recursive: true });
}
const headerBgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, headerBgDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, filename);
  }
});
const uploadHeaderBg = multer({ storage: headerBgStorage });

// Загрузить/сменить горизонтальные обои
router.put('/:id/header-background', auth, uploadHeaderBg.single('headerBackground'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    if (!req.file) return res.status(400).json({ message: 'Файл не загружен' });
    // Удалить старый файл, если был
    if (company.headerBackground) {
      const oldPath = path.join(__dirname, '../public', company.headerBackground);
      fs.unlink(oldPath, () => {});
    }
    // Сохранить новый путь
    company.headerBackground = `/uploads/company-header-backgrounds/${req.file.filename}`;
    await company.save();
    res.json({ headerBackground: company.headerBackground });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки обоев', error: error.message });
  }
});

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
  const { name, description, price, category, sku, quantity, unit } = req.body;
    if (!name) return res.status(400).json({ message: 'Название обязательно' });
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Компания не найдена' });
    if (company.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Нет доступа' });
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => `/uploads/company-gallery/${f.filename}`);
    }

    // Генерация артикула (sku), если не передан
    let generatedSku = sku;
    if (!generatedSku) {
      // SKU: первые 3 буквы транслита названия + 4 цифры времени + 2 символа компании
      const base = translit(name).replace(/[^a-z0-9]/g, '').slice(0, 3).toUpperCase();
      const time = Date.now().toString().slice(-4);
      const comp = company._id.toString().slice(-2).toUpperCase();
      generatedSku = `${base}${time}${comp}`;
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
      sku: generatedSku,
      quantity,
      unit,
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
  if (sku) product.sku = sku;
  if (quantity) product.quantity = quantity;
  if (unit) product.unit = unit;
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
  const { name, address, inn, description, contacts, phones, emails, lat, lng, customSlug, news } = req.body;
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
  if (typeof customSlug === 'string' && customSlug.trim()) company.customSlug = customSlug.trim();
  if (Array.isArray(news)) company.news = news;
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
// Дублирующий маршрут, возвращающий company.products, закомментирован для избежания конфликта
// router.get('/:id/products', async (req, res) => {
//   try {
//     const company = await Company.findById(req.params.id);
//     if (!company) return res.status(404).json({ message: 'Компания не найдена' });
//     res.json({ products: company.products });
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка получения товаров' });
//   }
// });

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
    // Генерация customSlug (транслит + уникальный хвост)
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
    let baseSlug = translit(name);
    let slug = baseSlug;
    let i = 1;
    // Проверка уникальности customSlug
    while (await Company.findOne({ customSlug: slug })) {
      slug = baseSlug + '-' + i;
      i++;
    }

    const company = new Company({
      name,
      address,
      inn,
      description,
      owner: req.user._id,
      customSlug: slug
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
    // Преобразуем logo в avatar для фронта
    const companiesWithAvatar = companies.map(c => {
      const obj = c.toObject();
      obj.avatar = obj.logo || '';
      return obj;
    });
    res.json({ companies: companiesWithAvatar });
  } catch (error) {
    console.error('Ошибка получения компаний:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении компаний' });
  }
});

// Получить одну компанию по id или customSlug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let company = null;
    // Если id похож на ObjectId (24 hex символа) — ищем по id, иначе по customSlug
    if (/^[a-f\d]{24}$/i.test(id)) {
      company = await Company.findById(id);
    } else {
      company = await Company.findOne({ customSlug: id });
    }
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

    // Инкрементировать просмотры
    try {
      const CompanyView = require('../models/CompanyView');
      const todayStr = new Date().toISOString().slice(0, 10);
      await CompanyView.findOneAndUpdate(
        { companyId: company._id, date: todayStr },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    } catch (e) { console.error('Ошибка записи CompanyView:', e); }

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
