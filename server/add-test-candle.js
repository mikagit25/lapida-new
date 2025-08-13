const mongoose = require('mongoose');
require('dotenv').config();

// Подключение к MongoDB - используем ту же базу что и сервер
console.log('Подключаемся к:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB подключена'))
  .catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Модель VirtualItem (должна быть такая же, как в models/VirtualItem.js)
const VirtualItem = require('./models/VirtualItem');

async function addTestCandle() {
  try {
    // Добавляем тестовую свечу для мемориала
    const testCandle = new VirtualItem({
      memorialId: '688a6601f6e54cf011b947c8', // ID мемориала из логов
      type: 'candle',
      itemType: 'classic',
      icon: '🕯️',
      name: 'Классическая',
      color: '#f59e0b',
      comment: 'Тестовая свеча памяти',
      authorName: 'Тестовый пользователь',
      authorId: 'test-user-id',
      duration: 24 * 60 * 60 * 1000, // 24 часа
      createdAt: new Date()
    });

    await testCandle.save();
    console.log('Тестовая свеча добавлена:', testCandle);
    
    // Проверим, что свеча сохранилась
    const candles = await VirtualItem.find({ 
      memorialId: '688a6601f6e54cf011b947c8', 
      type: 'candle' 
    });
    console.log('Все свечи для мемориала:', candles);
    
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при добавлении тестовой свечи:', error);
    process.exit(1);
  }
}

addTestCandle();
