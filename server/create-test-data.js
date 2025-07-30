const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Импорт моделей
const Memorial = require('./models/Memorial');
const User = require('./models/User');

async function createTestData() {
  try {
    // Подключение к базе данных
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db');
    console.log('Подключено к MongoDB');

    // Создание тестового пользователя, если его нет
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Тестовый пользователь',
        email: 'test@example.com',
        password: '$2b$10$XYZ123' // Захардкоженный хеш пароля для теста
      });
      await testUser.save();
      console.log('Создан тестовый пользователь:', testUser._id);
    } else {
      console.log('Тестовый пользователь уже существует:', testUser._id);
    }

    // Создание тестового мемориала с конкретным ID
    const testMemorialId = '60b5e1234567890123456789';
    let testMemorial = await Memorial.findById(testMemorialId);
    
    if (!testMemorial) {
      testMemorial = new Memorial({
        _id: testMemorialId,
        firstName: 'Тестовое',
        lastName: 'Имя',
        description: 'Это тестовый мемориал для проверки функционала комментариев к фотографиям.',
        owner: testUser._id,
        createdBy: testUser._id,
        profileImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop',
        galleryImages: [
          {
            url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
            caption: 'Тестовая фотография 1'
          },
          {
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            caption: 'Тестовая фотография 2'
          },
          {
            url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c23a?w=400&h=300&fit=crop',
            caption: 'Тестовая фотография 3'
          }
        ],
        birthDate: new Date('1980-01-01'),
        deathDate: new Date('2023-01-01'),
        location: {
          cemetery: 'Тестовое кладбище',
          section: 'А',
          plot: '123'
        },
        biography: 'Тестовая биография для проверки функционала',
        isPrivate: false
      });
      
      await testMemorial.save();
      console.log('Создан тестовый мемориал:', testMemorial._id);
    } else {
      console.log('Тестовый мемориал уже существует:', testMemorial._id);
    }

    console.log('\nТестовые данные готовы:');
    console.log('- Пользователь ID:', testUser._id);
    console.log('- Мемориал ID:', testMemorial._id);
    console.log('- Email тестового пользователя: test@example.com');
    console.log('- Пароль: test123 (если нужно будет создать реального пользователя)');

  } catch (error) {
    console.error('Ошибка создания тестовых данных:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nОтключено от MongoDB');
  }
}

// Запуск скрипта
createTestData();
