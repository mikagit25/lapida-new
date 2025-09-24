// CRUD роуты для заказов на товары
const express = require('express');
const router = express.Router();
const ReligiousProductOrder = require('../models/ReligiousProductOrder');
const { requireAuth } = require('../middleware/auth');

// Получить все заказы пользователя
router.get('/my', requireAuth, async (req, res) => {
  try {
    const orders = await ReligiousProductOrder.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
});

// Получить все заказы организации (для владельца/админа)
router.get('/organization/:orgId', requireAuth, async (req, res) => {
  try {
    const orders = await ReligiousProductOrder.find({ organization: req.params.orgId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения заказов организации' });
  }
});

// Создать заказ на товар
router.post('/', requireAuth, async (req, res) => {
  try {
    const order = await ReligiousProductOrder.create({ ...req.body, user: req.user._id });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания заказа', details: err.message });
  }
});

// Обновить статус заказа (только владелец организации/админ)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const order = await ReligiousProductOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка обновления заказа', details: err.message });
  }
});

// Удалить заказ (только пользователь или владелец организации)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const order = await ReligiousProductOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Заказ не найден' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка удаления заказа', details: err.message });
  }
});

module.exports = router;
