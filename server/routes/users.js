const express = require('express');
const User = require('../models/User');
const Memorial = require('../models/Memorial');
const Comment = require('../models/Comment');
const PhotoComment = require('../models/PhotoComment');
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
    await Memorial.deleteMany({ createdBy: user._id });

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

// Получение статистики текущего пользователя
router.get('/me/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Количество созданных мемориалов
    const memorialsCreated = await Memorial.countDocuments({ createdBy: userId });

    // Количество оставленных цветов (по комментариям)
    const flowersLeft = await Comment.countDocuments({ 
      author: userId,
      isFlower: true 
    });

    // Количество оставленных комментариев (включая фото комментарии)
    const regularComments = await Comment.countDocuments({ 
      author: userId,
      isFlower: { $ne: true }
    });
    const photoComments = await PhotoComment.countDocuments({ author: userId });
    const commentsLeft = regularComments + photoComments;

    // Обновляем статистику в профиле пользователя
    await User.findByIdAndUpdate(userId, {
      'statistics.memorialsCreated': memorialsCreated,
      'statistics.flowersLeft': flowersLeft,
      'statistics.commentsLeft': commentsLeft,
      'statistics.lastActivity': new Date()
    });

    res.json({
      memorialsCreated,
      flowersLeft,
      commentsLeft,
      lastActivity: new Date()
    });
  } catch (error) {
    console.error('Ошибка получения статистики пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении статистики' });
  }
});

// Получение мемориалов пользователя
router.get('/me/memorials', auth, async (req, res) => {
  try {
    console.log('User requesting memorials:', req.user?.name, req.user?.id);
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const memorials = await Memorial.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name photo');

    const total = await Memorial.countDocuments({ createdBy: userId });

    console.log(`Found ${memorials.length} memorials for user ${userId}, total: ${total}`);

    res.json({
      memorials,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Ошибка получения мемориалов пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении мемориалов' });
  }
});

// Получение комментариев пользователя
router.get('/me/comments', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Получаем обычные комментарии
    const regularComments = await Comment.find({ author: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('memorial', 'firstName lastName photo')
      .populate('author', 'name photo');

    // Получаем фото комментарии
    const photoComments = await PhotoComment.find({ author: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('memorial', 'firstName lastName photo')
      .populate('author', 'name photo');

    // Объединяем и сортируем по дате
    const allComments = [...regularComments.map(c => ({...c.toObject(), type: 'regular'})), 
                        ...photoComments.map(c => ({...c.toObject(), type: 'photo'}))];
    
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const paginatedComments = allComments.slice(skip, skip + limit);

    const totalRegular = await Comment.countDocuments({ author: userId });
    const totalPhoto = await PhotoComment.countDocuments({ author: userId });
    const total = totalRegular + totalPhoto;

    res.json({
      comments: paginatedComments,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Ошибка получения комментариев пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении комментариев' });
  }
});

// Обновление настроек пользователя
router.put('/me/settings', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { emailNotifications, privacyLevel, theme, language } = req.body;

    const updateData = {};
    if (emailNotifications !== undefined) updateData['settings.emailNotifications'] = emailNotifications;
    if (privacyLevel !== undefined) updateData['settings.privacyLevel'] = privacyLevel;
    if (theme !== undefined) updateData['settings.theme'] = theme;
    if (language !== undefined) updateData['settings.language'] = language;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении настроек' });
  }
});

module.exports = router;
