const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// Проверка доступности customSlug
router.get('/api/companies/check-slug', async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug || typeof slug !== 'string') return res.status(400).json({ available: false, message: 'Некорректный slug' });
    const exists = await Company.findOne({ customSlug: slug });
    res.json({ available: !exists });
  } catch (err) {
    console.error('Ошибка проверки slug:', err);
    if (err && err.stack) console.error('Stack:', err.stack);
    res.status(500).json({ available: false, message: 'Ошибка сервера при проверке slug', error: err?.message || err });
  }
});

module.exports = router;
