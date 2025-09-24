// CRUD роуты для услуг религиозных организаций
const express = require('express');
const router = express.Router();
const ReligiousService = require('../models/ReligiousService');
const { auth } = require('../middleware/auth');

// Получить все услуги организации
router.get('/organization/:orgId', async (req, res) => {
  try {
    const services = await ReligiousService.find({ organization: req.params.orgId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения услуг' });
  }
});

// Получить одну услугу
router.get('/:id', async (req, res) => {
  try {
    const service = await ReligiousService.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Услуга не найдена' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения услуги' });
  }
});

// Создать услугу (только владелец/админ)
router.post('/', auth, async (req, res) => {
  try {
    const service = await ReligiousService.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания услуги', details: err.message });
  }
});

// Обновить услугу (только владелец/админ)
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await ReligiousService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ error: 'Услуга не найдена' });
    res.json(service);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка обновления услуги', details: err.message });
  }
});

// Удалить услугу (только владелец/админ)
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await ReligiousService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Услуга не найдена' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка удаления услуги', details: err.message });
  }
});

module.exports = router;
