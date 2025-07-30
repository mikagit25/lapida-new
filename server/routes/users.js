const express = require('express');
const User = require('../models/User');
const Memorial = require('../models/Memorial');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Получение списка пользователей (только для админов)
router.get('/', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении пользователей' });
  }
});

// Получение пользователя по ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Получение статистики пользователя
    const memorialsCount = await Memorial.countDocuments({ 
      creator: user._id,
      isPublic: true 
    });

    const tributesCount = await Memorial.aggregate([
      { $unwind: '$tributes' },
      { $match: { 'tributes.author': user._id } },
      { $count: 'total' }
    ]);

    res.json({
      user,
      stats: {
        memorials: memorialsCount,
        tributes: tributesCount[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении пользователя' });
  }
});

// Обновление роли пользователя (только для админов)
router.put('/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Неверная роль пользователя' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      message: 'Роль пользователя обновлена',
      user
    });
  } catch (error) {
    console.error('Ошибка обновления роли:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении роли' });
  }
});

// Блокировка/разблокировка пользователя (только для админов)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: Boolean(isBlocked) },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      message: `Пользователь ${isBlocked ? 'заблокирован' : 'разблокирован'}`,
      user
    });
  } catch (error) {
    console.error('Ошибка изменения статуса:', error);
    res.status(500).json({ message: 'Ошибка сервера при изменении статуса' });
  }
});

// Удаление пользователя (только для админов)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Нельзя удалить самого себя
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Нельзя удалить собственную учетную запись' });
    }

    // Удаление или передача мемориалов
    await Memorial.deleteMany({ creator: user._id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
  }
});

// Получение статистики пользователей (только для админов)
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMemorials = await Memorial.countDocuments();
    const publicMemorials = await Memorial.countDocuments({ isPublic: true });
    const pendingMemorials = await Memorial.countDocuments({ isApproved: false });

    // Статистика по датам регистрации за последние 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const newMemorials = await Memorial.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      users: {
        total: totalUsers,
        new: newUsers
      },
      memorials: {
        total: totalMemorials,
        public: publicMemorials,
        pending: pendingMemorials,
        new: newMemorials
      }
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении статистики' });
  }
});

module.exports = router;
