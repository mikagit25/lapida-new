const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

// Создать заказ
router.post('/', auth, async (req, res) => {
  try {
    const { companyId, items, comment } = req.body;
    if (!companyId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'companyId и items обязательны' });
    }
    const order = new Order({
      userId: req.user._id,
      companyId,
      items,
      comment
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания заказа', error: error.message });
  }
});

// Получить заказы пользователя
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения заказов', error: error.message });
  }
});

// Получить заказы компании
router.get('/company/:companyId', auth, async (req, res) => {
  try {
    const orders = await Order.find({ companyId: req.params.companyId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения заказов компании', error: error.message });
  }
});

// Получить заказ по id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения заказа', error: error.message });
  }
});

// Обновить статус заказа
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, paymentStatus, comment } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (comment) order.comment = comment;
    order.updatedAt = Date.now();
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления заказа', error: error.message });
  }
});

// Удалить заказ
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });
    res.json({ message: 'Заказ удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления заказа', error: error.message });
  }
});

module.exports = router;
