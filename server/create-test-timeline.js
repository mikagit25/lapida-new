const mongoose = require('mongoose');
require('dotenv').config();

const TimelineEvent = require('./models/TimelineEvent');
const Memorial = require('./models/Memorial');

const createTestEvent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db');
    console.log('Подключен к MongoDB');

    // Найдем первый мемориал
    const memorial = await Memorial.findOne();
    if (!memorial) {
      console.log('Мемориалы не найдены');
      return;
    }

    console.log('Найден мемориал:', memorial.fullName);

    // Создадим тестовое событие
    const testEvent = new TimelineEvent({
      memorial: memorial._id,
      title: 'Рождение',
      description: 'Родился в прекрасный день',
      date: new Date('1950-05-15'),
      dateDisplay: '15 мая 1950',
      eventType: 'birth',
      location: 'Минск',
      isPublic: true,
      author: memorial.createdBy,
      photos: []
    });

    await testEvent.save();
    console.log('Создано тестовое событие:', testEvent.title);

    // Создадим еще одно событие
    const testEvent2 = new TimelineEvent({
      memorial: memorial._id,
      title: 'Окончание школы',
      description: 'Закончил среднюю школу с отличием',
      date: new Date('1968-06-20'),
      dateDisplay: '20 июня 1968',
      eventType: 'education',
      location: 'Минск',
      isPublic: true,
      author: memorial.createdBy,
      photos: []
    });

    await testEvent2.save();
    console.log('Создано тестовое событие:', testEvent2.title);

    console.log('✅ Тестовые события созданы успешно');
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    mongoose.disconnect();
  }
};

createTestEvent();
