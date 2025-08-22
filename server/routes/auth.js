const express = require('express');
const passport = require('../oauth');

// --- OAuth маршруты временно отключены ---
/*
// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
  res.redirect('/?oauth=success');
});
// Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', session: false }), (req, res) => {
  res.redirect('/?oauth=success');
});
// Apple
router.get('/apple', passport.authenticate('apple'));
router.post('/apple/callback', passport.authenticate('apple', { failureRedirect: '/login', session: false }), (req, res) => {
  res.redirect('/?oauth=success');
});
// LinkedIn
router.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }));
router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login', session: false }), (req, res) => {
  res.redirect('/?oauth=success');
});
*/
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../upload/users');
    // Создаем папку если её нет
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'user-' + req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: function (req, file, cb) {
    // Проверяем тип файла
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения'), false);
    }
  }
});

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверка обязательных полей
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Все поля обязательны для заполнения' 
      });
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Пароль должен содержать минимум 6 символов' 
      });
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Пользователь с таким email уже существует' 
      });
    }

    // Создание нового пользователя
    const user = new User({ name, email, password });
    await user.save();

    // Генерация токена
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        gallery: user.gallery,
        phone: user.phone,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при регистрации' 
    });
  }
});

// Авторизация
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email и пароль обязательны' 
      });
    }

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Неверный email или пароль' 
      });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Неверный email или пароль' 
      });
    }

    // Генерация токена
    const token = generateToken(user._id);

    // Установка токена в cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // для локальной разработки
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
    });

    res.json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        gallery: user.gallery,
        phone: user.phone,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при авторизации' 
    });
  }
});

// Получение профиля пользователя
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при получении профиля' 
    });
  }
});

// Обновление профиля
router.put('/profile', auth, upload.single('photo'), async (req, res) => {
  try {
    // Собираем все возможные поля профиля
    const {
      name, email, phone, bio,
      firstName, lastName, middleName,
      gender, dateOfBirth, country, city, address,
      biography, interests, profession, education, achievements
    } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) {
      // Проверка уникальности email
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user._id } 
      });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Пользователь с таким email уже существует' 
        });
      }
      updates.email = email;
    }
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (middleName !== undefined) updates.middleName = middleName;
    if (gender !== undefined) updates.gender = gender;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
    if (country !== undefined) updates.country = country;
    if (city !== undefined) updates.city = city;
    if (address !== undefined) updates.address = address;
    if (biography !== undefined) updates.biography = biography;
    if (interests !== undefined) updates.interests = interests;
    if (profession !== undefined) updates.profession = profession;
    if (education !== undefined) updates.education = education;
    if (achievements !== undefined) updates.achievements = achievements;

    // Если загружен новый файл фото
    if (req.file) {
      // Удаляем старое фото если есть
      const currentUser = await User.findById(req.user._id);
      if (currentUser.photo) {
        const oldPhotoPath = path.join(__dirname, '../', currentUser.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      // Сохраняем путь к новому фото
      updates.photo = '/upload/users/' + req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id, 
      updates, 
      { new: true, runValidators: true }
    );

    // Получаем полный объект пользователя после обновления
    const fullUser = await User.findById(user._id);
    res.json({
      message: 'Профиль успешно обновлен',
      user: fullUser.toJSON()
    });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при обновлении профиля' 
    });
  }
});

// Изменение пароля
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Текущий пароль и новый пароль обязательны' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Новый пароль должен содержать минимум 6 символов' 
      });
    }

    // Проверка текущего пароля
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Неверный текущий пароль' 
      });
    }

    // Обновление пароля
    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Ошибка изменения пароля:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при изменении пароля' 
    });
  }
});

// Проверка токена
router.get('/verify', auth, async (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
