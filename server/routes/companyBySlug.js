const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// Получить компанию по customSlug
router.get('/api/companies/by-slug/:slug', async (req, res) => {
  const company = await Company.findOne({ customSlug: req.params.slug });
  if (!company) return res.status(404).json({ message: 'Компания не найдена' });
  res.json({ company });
});

module.exports = router;
