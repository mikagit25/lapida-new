const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5180', 
    'http://localhost:5181', 
    'http://localhost:5182', 
    'http://localhost:5183', 
    'http://localhost:5184', 
    'http://localhost:5174', 
    'http://localhost:5175', 
    'http://localhost:5176', 
    'http://localhost:5177', 
    'http://localhost:5178', 
    'http://localhost:5179', 
    'http://localhost:3000',
    'https://lapida.one',
    'https://www.lapida.one',
    'http://lapida.one',
    'http://www.lapida.one'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статическая раздача загруженных файлов
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Статическая раздача frontend файлов
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к базе данных MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db');
    console.log('MongoDB подключена успешно');
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
};

// Маршруты
app.get('/', (req, res) => {
  res.json({ message: 'Lapida API запущен' });
});

// Маршруты API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/memorials', require('./routes/memorials-new'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/photo-comments', require('./routes/photoComments'));
app.use('/api/timeline', require('./routes/timeline'));

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

// React Router - для всех не-API маршрутов возвращаем index.html
app.get('*', (req, res) => {
  // Если это API запрос - отправляем 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API маршрут не найден' });
  }
  // Для всех остальных - отправляем React приложение
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5002;

// Запуск сервера
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
};

startServer();
