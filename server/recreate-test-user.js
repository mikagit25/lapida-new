const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

async function recreateTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db');
    console.log('Подключено к MongoDB');

    // Удаляем существующего пользователя
    await User.deleteOne({ email: 'test@test.com' });
    console.log('Удален старый пользователь test@test.com');

    // Создаем нового пользователя (НЕ хешируем пароль вручную, модель сделает это сама)
    const testUser = new User({
      name: 'Тест Пользователь',
      email: 'test@test.com',
      password: 'test123'  // Обычный пароль, модель его захеширует
    });

    await testUser.save();
    console.log('Создан новый тестовый пользователь:');
    console.log('Email: test@test.com');
    console.log('Пароль: test123');
    console.log('ID:', testUser._id);

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Отключено от MongoDB');
  }
}

recreateTestUser();
