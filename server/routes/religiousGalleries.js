// CRUD роуты для галереи (фотоальбомов) религиозной организации
const express = require('express');
const router = express.Router();
const ReligiousGallery = require('../models/ReligiousGallery');
const { auth } = require('../middleware/auth');

// Получить все альбомы организации
router.get('/organization/:orgId', async (req, res) => {
  try {
    const galleries = await ReligiousGallery.find({ organization: req.params.orgId }).sort({ createdAt: -1 });
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения галерей' });
  }
});

// Получить один альбом
router.get('/:id', async (req, res) => {
  try {
    const gallery = await ReligiousGallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Альбом не найден' });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения альбома' });
  }
});

// Создать альбом (только владелец/админ)
router.post('/', auth, async (req, res) => {
  try {
    const gallery = await ReligiousGallery.create(req.body);
    res.status(201).json(gallery);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания альбома', details: err.message });
  }
});

// Обновить альбом (только владелец/админ)
router.put('/:id', auth, async (req, res) => {
  try {
    const gallery = await ReligiousGallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gallery) return res.status(404).json({ error: 'Альбом не найден' });
    res.json(gallery);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка обновления альбома', details: err.message });
  }
});

// Удалить альбом (только владелец/админ)
router.delete('/:id', auth, async (req, res) => {
  try {
    const gallery = await ReligiousGallery.findByIdAndDelete(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Альбом не найден' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка удаления альбома', details: err.message });
  }
});

module.exports = router;
