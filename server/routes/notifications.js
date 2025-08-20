const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Notification = require('../models/Notification');
// Получить уведомления пользователя с пагинацией
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Notification.countDocuments({ userId: req.params.userId });
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ notifications, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения уведомлений', error: error.message });
  }
});

// Получить уведомления компании с пагинацией
router.get('/company/:companyId', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Notification.countDocuments({ companyId: req.params.companyId });
    const notifications = await Notification.find({ companyId: req.params.companyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ notifications, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения уведомлений компании', error: error.message });
  }
});
// Массовая отметка всех уведомлений компании как прочитанные
router.patch('/company/:companyId/read-all', auth, async (req, res) => {
  try {
    const result = await Notification.updateMany({ companyId: req.params.companyId, read: false }, { $set: { read: true } });
    res.json({ success: true, updated: result.nModified });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка массовой отметки уведомлений компании', error: error.message });
  }
});
// Массовая отметка всех уведомлений пользователя как прочитанные
router.patch('/user/:userId/read-all', auth, async (req, res) => {
  try {
    const result = await Notification.updateMany({ userId: req.params.userId, read: false }, { $set: { read: true } });
    res.json({ success: true, updated: result.nModified });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка массовой отметки уведомлений', error: error.message });
  }
});
// Отметить уведомление как прочитанное
router.patch('/:notificationId/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) return res.status(404).json({ message: 'Уведомление не найдено' });
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав на изменение уведомления' });
    }
    notification.read = true;
    await notification.save();
    res.json({ notification });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления уведомления', error: error.message });
  }
});

// Получить все уведомления
router.get('/', auth, async (req, res) => {
  try {
    // Получить все уведомления пользователя
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Получить количество непрочитанных уведомлений
router.get('/unread-count', auth, async (req, res) => {
  try {
    // Реальное количество непрочитанных уведомлений пользователя
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });
    res.json({ count: unreadCount });
  } catch (error) {
    console.error('Ошибка получения количества непрочитанных уведомлений:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

module.exports = router;
