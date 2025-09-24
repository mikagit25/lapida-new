// CRUD роуты для товаров религиозных организаций
const express = require('express');
const router = express.Router();
const ReligiousProduct = require('../models/ReligiousProduct');
const { auth } = require('../middleware/auth');

// Получить все товары организации
router.get('/organization/:orgId', async (req, res) => {
  try {
    const products = await ReligiousProduct.find({ organization: req.params.orgId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения товаров' });
  }
});

// Получить один товар
router.get('/:id', async (req, res) => {
  try {
    const product = await ReligiousProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения товара' });
  }
});

// Создать товар (только владелец/админ)
router.post('/', auth, async (req, res) => {
  try {
    const product = await ReligiousProduct.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания товара', details: err.message });
  }
});

// Обновить товар (только владелец/админ)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await ReligiousProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка обновления товара', details: err.message });
  }
});

// Удалить товар (только владелец/админ)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await ReligiousProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка удаления товара', details: err.message });
  }
});

module.exports = router;
