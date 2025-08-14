
const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const Memorial = require('../models/Memorial');
const Comment = require('../models/Comment');
const { auth, adminAuth } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Удаление фото из галереи пользователя
router.delete('/me/gallery', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ message: 'Некорректный путь к фото' });
    }
    // Проверяем, что фото действительно принадлежит пользователю
    const user = await User.findById(req.user._id);
    if (!user || !user.gallery.includes(imageUrl)) {
      return res.status(404).json({ message: 'Фото не найдено в вашей галерее' });
    }
    // Удаляем файл физически
    const filePath = path.join(__dirname, '../upload/gallery', path.basename(imageUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // Удаляем путь из массива gallery
    user.gallery = user.gallery.filter(img => img !== imageUrl);
    await user.save();
    res.json({ message: 'Фото удалено', images: user.gallery });
  } catch (error) {
    console.error('Ошибка удаления фото из галереи:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении фото' });
  }
});

// --- Галерея пользователя ---
const userGalleryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Сохраняем в upload/gallery, как мемориалы
    const uploadDir = path.join(__dirname, '../upload/gallery');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'user-' + req.user._id + '-' + Date.now() + '-' + Math.floor(Math.random()*1e9) + ext);
  }
});
const userGalleryUpload = multer({ storage: userGalleryStorage });

// Загрузка фото в галерею пользователя
router.post('/me/gallery', auth, userGalleryUpload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }
    // Пути для сохранения в БД и для фронта — /upload/gallery/...
    const imageUrls = req.files.map(f => '/upload/gallery/' + f.filename);
    // Добавляем в массив gallery пользователя
    const user = await User.findById(req.user._id);
    if (!user.gallery) user.gallery = [];
    user.gallery.push(...imageUrls);
    await user.save();
    res.json({ message: 'Фото успешно загружены', images: user.gallery });
  } catch (error) {
    console.error('Ошибка загрузки фото в галерею:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке фото' });
  }
});

// --- Аватар пользователя ---
// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/avatars');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// Загрузка аватара
router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
// Удаление аватара
router.delete('/me/avatar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.avatar) {
      return res.status(404).json({ message: 'Аватар не найден' });
    }
    // Путь к файлу аватара
    const filePath = path.join(__dirname, '../public', user.avatar);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    user.avatar = null;
    await user.save();
    res.json({ message: 'Аватар удалён', user });
  } catch (error) {
    console.error('Ошибка удаления аватара:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении аватара' });
  }
});
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }
    // Путь для сохранения в БД (относительно public)
    const avatarUrl = '/uploads/avatars/' + req.file.filename;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');
    res.json({
      message: 'Аватар успешно обновлен',
      user
    });
  } catch (error) {
    console.error('Ошибка загрузки аватара:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке аватара' });
  }
});

// Получение статистики текущего пользователя
router.get('/me/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Количество мемориалов пользователя
    const memorialsCreated = await Memorial.countDocuments({ 
      creator: userId 
    });

    // Количество комментариев пользователя
    const commentsLeft = await Comment.countDocuments({ author: userId });

    // Количество цветов пользователя (используем поле isFlower в комментариях)
    const flowersLeft = await Comment.countDocuments({ 
      author: userId,
      isFlower: true 
    });

    res.json({
      memorialsCreated,
      commentsLeft,
      flowersLeft,
      totalViews: 0 // Заглушка для просмотров
    });
  } catch (error) {
    console.error('Ошибка получения статистики пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении статистики' });
  }
});

// Получение мемориалов текущего пользователя
router.get('/me/memorials', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const memorials = await Memorial.find({ creator: userId })
      .populate('creator', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Memorial.countDocuments({ creator: userId });

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

// Получение комментариев текущего пользователя
router.get('/me/comments', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Получаем комментарии из модели Comment
    const comments = await Comment.find({ author: userId })
      .populate('author', 'name avatar')
      .populate('memorial', 'fullName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ author: userId });

    res.json({
      comments,
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

// Обновление профиля пользователя
router.put('/me/profile', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    // Собираем все возможные поля из тела запроса
    const {
      name,
      email,
      bio,
      phone,
      avatar,
      firstName,
      lastName,
      middleName,
      gender,
      dateOfBirth,
      country,
      city,
      address
    } = req.body;

    // Подготавливаем данные для обновления
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (middleName !== undefined) updateData.middleName = middleName;
    if (gender !== undefined) updateData.gender = gender;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (country !== undefined) updateData.country = country;
    if (city !== undefined) updateData.city = city;
    if (address !== undefined) updateData.address = address;

    // Обновляем пользователя
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email уже используется' });
    }
    res.status(500).json({ message: 'Ошибка сервера при обновлении профиля' });
  }
});

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

// Получение истории активности пользователя
router.get('/me/activity', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type || 'all';
    const dateRange = parseInt(req.query.dateRange) || 30;

    // Вычисляем дату начала периода
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    let activities = [];

    // Получаем комментарии пользователя как активность
    const comments = await Comment.find({
      author: userId,
      createdAt: { $gte: startDate }
    })
    .populate('memorial', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

    // Преобразуем комментарии в формат активности
    const commentActivities = comments.map(comment => ({
      id: comment._id,
      type: comment.isFlower ? 'flower' : 'comment',
      action: comment.isFlower ? 'Оставил цветок' : 'Оставил комментарий',
      target: comment.memorial?.name || 'Мемориал',
      targetSlug: comment.memorial?.slug,
      content: comment.text,
      date: comment.createdAt
    }));

    activities = [...commentActivities];

    // Если тип не 'all', фильтруем по типу
    if (type !== 'all') {
      activities = activities.filter(activity => activity.type === type);
    }

    // Сортируем по дате
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      activities: activities.slice(0, limit),
      totalCount: activities.length,
      page,
      totalPages: Math.ceil(activities.length / limit)
    });
  } catch (error) {
    console.error('Ошибка получения истории активности:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении истории активности' });
  }
});

// Получение настроек пользователя
router.get('/me/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');
    
    const defaultPreferences = {
      emailNotifications: true,
      pushNotifications: true,
      publicProfile: true,
      showEmail: false,
      showPhone: false,
      language: 'ru',
      theme: 'light'
    };

    res.json({
      preferences: {
        ...defaultPreferences,
        ...(user.preferences || {})
      }
    });
  } catch (error) {
    console.error('Ошибка получения настроек:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении настроек' });
  }
});

// Обновление настроек пользователя
router.put('/me/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true }
    ).select('preferences');

    res.json({
      message: 'Настройки успешно обновлены',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении настроек' });
  }
});

// Обновление биографии пользователя
router.put('/me/biography', auth, async (req, res) => {
  try {
    const { biography, interests, profession, education, achievements } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        biography,
        interests,
        profession,
        education,
        achievements
      },
      { new: true }
    ).select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');

    res.json({
      message: 'Биография успешно обновлена',
      user
    });
  } catch (error) {
    console.error('Ошибка обновления биографии:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении биографии' });
  }
});

module.exports = router;
