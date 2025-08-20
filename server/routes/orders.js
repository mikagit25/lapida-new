const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Notification = require('../models/Notification');
const Order = require('../models/Order');
// Смена статуса заказа
router.patch('/:orderId/status', auth, async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    console.log('PATCH /orders/:orderId/status:', {
      orderId: req.params.orderId,
      orderUserId: order?.userId?.toString(),
      reqUserId: req.user._id?.toString(),
      orderCompanyId: order?.companyId?.toString(),
      reqCompanyId: req.user.companyId?.toString(),
      status: req.body.status
    });
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });
    // Проверка прав: владелец компании или сам клиент может менять статус
    const isCompanyOwner = order.companyId?.toString() === req.user.companyId?.toString();
    const isOrderOwner = order.userId?.toString() === req.user._id?.toString();
    if (!isCompanyOwner && !isOrderOwner) {
      return res.status(403).json({ message: 'Нет прав на изменение статуса' });
    }
    order.status = status;
    order.history = order.history || [];
    order.history.push({ status, date: new Date(), comment: req.body.comment || '' });
    await order.save();

    // Создать уведомление для пользователя
    await Notification.create({
      userId: order.userId,
      orderId: order._id,
      type: 'order-status',
      message: `Статус вашего заказа изменен на: ${status}`
    });

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка смены статуса', error: error.message });
  }
});
// ...existing code...
// Получить заказы пользователя
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments({ userId: req.params.userId });
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  .populate('companyId', 'name')
  .populate('items.productId', 'name price images slug');
    res.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения заказов', error: error.message });
  }
});

// Получить заказы компании
router.get('/company/:companyId', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments({ companyId: req.params.companyId });
    const orders = await Order.find({ companyId: req.params.companyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  .populate('companyId', 'name')
  .populate('items.productId', 'name price images slug');
    res.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения заказов компании', error: error.message });
  }
});

// Создать заказ
router.post('/', auth, async (req, res) => {
  try {
    const { companyId, items, comment, name, phone, address } = req.body;
    if (!companyId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'companyId и items обязательны' });
    }
    const order = new Order({
      userId: req.user._id,
      companyId,
      items,
      comment,
      name,
      phone,
      address
    });
    await order.save();
    // Уведомление для компании о новом заказе
    const Notification = require('../models/Notification');
    await Notification.create({
      companyId,
      orderId: order._id,
      type: 'new-order',
      message: `Поступил новый заказ №${order._id}`
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания заказа', error: error.message });
  }
});

// Получить заказы пользователя
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('companyId', 'name customSlug')
      .populate('items.productId', 'name price images slug');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения заказов', error: error.message });
  }
});

// Получить заказы компании
router.get('/company/:companyId', auth, async (req, res) => {
  try {
    const orders = await Order.find({ companyId: req.params.companyId })
      .sort({ createdAt: -1 })
  .populate('companyId', 'name')
  .populate('items.productId', 'name price images slug');
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
