const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db');
    console.log('Подключено к MongoDB');

    // Проверяем, есть ли уже пользователь с таким email
    const existingUser = await User.findOne({ email: 'test@test.com' });
    if (existingUser) {
      console.log('Пользователь test@test.com уже существует');
      return;
    }

    // Хешируем пароль
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash('test123', saltRounds);

    // Создаем пользователя
    const testUser = new User({
      name: 'Тест Пользователь',
      email: 'test@test.com',
      password: hashedPassword
    });

    await testUser.save();
    console.log('Создан тестовый пользователь:');
    console.log('Email: test@test.com');
    console.log('Пароль: test123');
    console.log('ID:', testUser._id);

  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Отключено от MongoDB');
  }
}

createTestUser();
