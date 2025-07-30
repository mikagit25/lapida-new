const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Memorial = require('./models/Memorial');

async function addShareUrl() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db');
    console.log('Подключено к MongoDB');

    // Находим тестовый мемориал
    const memorial = await Memorial.findById('60b5e1234567890123456789');
    
    if (memorial) {
      // Добавляем shareUrl
      memorial.shareUrl = 'test-memorial-share';
      await memorial.save();
      console.log('ShareUrl добавлен к мемориалу:', memorial.shareUrl);
    } else {
      console.log('Мемориал не найден');
    }

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Отключено от MongoDB');
  }
}

addShareUrl();
