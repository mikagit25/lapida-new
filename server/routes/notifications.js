const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Получить все уведомления
router.get('/', auth, async (req, res) => {
  try {
    // Заглушка для уведомлений
    const notifications = [];
    res.json(notifications);
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить количество непрочитанных уведомлений
router.get('/unread-count', auth, async (req, res) => {
  try {
    // Заглушка для количества непрочитанных
    const unreadCount = 0;
    res.json({ count: unreadCount });
  } catch (error) {
    console.error('Ошибка получения количества непрочитанных уведомлений:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
