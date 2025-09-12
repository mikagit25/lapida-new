const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Только для админов! Установить/снять paid-статус пользователю
router.post('/set-paid', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    const { userId, paid } = req.body;
    if (!userId || typeof paid !== 'boolean') {
      return res.status(400).json({ message: 'userId и paid обязательны' });
    }
    const user = await User.findByIdAndUpdate(userId, { paid }, { new: true });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json({ message: 'Статус обновлён', user });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера', error: e.message });
  }
});

module.exports = router;
