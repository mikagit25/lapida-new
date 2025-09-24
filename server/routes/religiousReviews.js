// CRUD роуты для отзывов о религиозных организациях, услугах и товарах
const express = require('express');
const router = express.Router();
const ReligiousReview = require('../models/ReligiousReview');
const { requireAuth } = require('../middleware/auth');

// Получить отзывы по организации
router.get('/organization/:orgId', async (req, res) => {
  try {
    const reviews = await ReligiousReview.find({ organization: req.params.orgId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения отзывов' });
  }
});

// Получить отзывы по целевому объекту (услуга/товар)
router.get('/target/:type/:id', async (req, res) => {
  try {
    const reviews = await ReligiousReview.find({ targetType: req.params.type, targetId: req.params.id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения отзывов' });
  }
});

// Оставить отзыв
router.post('/', requireAuth, async (req, res) => {
  try {
    const review = await ReligiousReview.create({ ...req.body, user: req.user._id });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания отзыва', details: err.message });
  }
});

// Удалить отзыв (только автор)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const review = await ReligiousReview.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Отзыв не найден' });
    if (String(review.user) !== String(req.user._id)) return res.status(403).json({ error: 'Нет прав на удаление' });
    await review.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка удаления отзыва', details: err.message });
  }
});

module.exports = router;
