const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Company = require('../models/Company');
const Memorial = require('../models/Memorial');
const Report = require('../models/Report');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Актуальная статистика для админ-панели
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [users, companies, memorials, reportsTotal, reportsOpen, orders, products] = await Promise.all([
      User.countDocuments(),
      Company.countDocuments(),
      Memorial.countDocuments(),
      Report.countDocuments(),
      Report.countDocuments({ status: 'open' }),
      Order.countDocuments(),
      Product.countDocuments()
    ]);

    res.json({
      users,
      companies,
      memorials,
      complaints: reportsTotal,
      complaintsOpen: reportsOpen,
      orders,
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения статистики', error: error.message });
  }
});

module.exports = router;
