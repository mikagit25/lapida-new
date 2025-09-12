const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Модель для виртуальных элементов
const VirtualItem = require('../models/VirtualItem');

// Получить все цветы для мемориала
router.get('/flowers/:memorialId', async (req, res) => {
  try {
    const { memorialId } = req.params;
    
    const flowers = await VirtualItem.find({
      memorialId,
      type: 'flower'
    }).sort({ createdAt: -1 });
    
    res.json({ flowers });
  } catch (error) {
    console.error('Error fetching flowers:', error);
    res.status(500).json({ message: 'Ошибка при загрузке цветов' });
  }
});

// Добавить цветок
router.post('/flowers', auth, async (req, res) => {
  try {
    const { memorialId, type, icon, name, color, comment, duration } = req.body;
    
    // Используем имя из авторизованного пользователя
    const authorName = req.user.name || req.user.email || 'Аноним';
    
    const flower = new VirtualItem({
      memorialId,
      type: 'flower',
      itemType: type,
      icon,
      name,
      color,
      comment,
      authorName,
      authorId: req.user.id,
      duration: duration || 7 * 24 * 60 * 60 * 1000, // По умолчанию 7 дней
      createdAt: new Date()
    });
    
    await flower.save();
    
    res.status(201).json({ flower });
  } catch (error) {
    console.error('Error adding flower:', error);
    res.status(500).json({ message: 'Ошибка при добавлении цветка' });
  }
});

// Получить все свечи для мемориала
router.get('/candles/:memorialId', async (req, res) => {
  try {
    const { memorialId } = req.params;
    
    // Преобразуем строку в ObjectId для поиска в MongoDB
    const objectId = mongoose.Types.ObjectId.isValid(memorialId) 
      ? new mongoose.Types.ObjectId(memorialId) 
      : memorialId;

    const candles = await VirtualItem.find({
      memorialId: objectId,
      type: 'candle'
    }).sort({ createdAt: -1 });
    
    res.json({ candles });
  } catch (error) {
    console.error('Error fetching candles:', error);
    res.status(500).json({ message: 'Ошибка при загрузке свечей' });
  }
});

// Добавить свечу
router.post('/candles', auth, async (req, res) => {
  try {
    console.log('🕯️ Создание свечи - начало');
    console.log('Body:', req.body);
    console.log('User:', req.user);
    
    const { memorialId, type, icon, name, color, comment, duration } = req.body;
    
    // Используем имя из авторизованного пользователя
    const authorName = req.user.name || req.user.email || 'Аноним';
    
    const candle = new VirtualItem({
      memorialId,
      type: 'candle',
      itemType: type,
      icon,
      name,
      color,
      comment,
      authorName,
      authorId: req.user.id,
      duration: duration || 24 * 60 * 60 * 1000, // По умолчанию 24 часа
      createdAt: new Date()
    });

    console.log('Создаем свечу:', candle);
    await candle.save();
    console.log('🕯️ Свеча сохранена:', candle._id);
    
    res.status(201).json({ candle });
  } catch (error) {
    console.error('❌ Error adding candle:', error);
    res.status(500).json({ message: 'Ошибка при добавлении свечи' });
  }
});

// Получить все виртуальные предметы определённого типа для мемориала
router.get('/:type/:memorialId', async (req, res) => {
  try {
    const { type, memorialId } = req.params;
    if (!['gift', 'prayer', 'note', 'dove'].includes(type)) {
      return res.status(400).json({ message: 'Недопустимый тип предмета' });
    }
    const items = await VirtualItem.find({ memorialId, type }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    console.error('Error fetching virtual items:', error);
    res.status(500).json({ message: 'Ошибка при загрузке предметов' });
  }
});

// Добавить виртуальный предмет (gift, prayer, note, dove)
router.post('/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    if (!['gift', 'prayer', 'note', 'dove'].includes(type)) {
      return res.status(400).json({ message: 'Недопустимый тип предмета' });
    }
    const { memorialId, icon, name, color, comment, duration } = req.body;
    const authorName = req.user.name || req.user.email || 'Аноним';
    const item = new VirtualItem({
      memorialId,
      type,
      itemType: name || type,
      icon: icon || '',
      name: name || '',
      color: color || '',
      comment: comment || '',
      authorName,
      authorId: req.user.id,
      duration: duration || 7 * 24 * 60 * 60 * 1000,
      createdAt: new Date()
    });
    await item.save();
    res.status(201).json({ item });
  } catch (error) {
    console.error('Error adding virtual item:', error);
    res.status(500).json({ message: 'Ошибка при добавлении предмета' });
  }
});

// Удалить виртуальный элемент (только автор или владелец мемориала)
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const item = await VirtualItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Элемент не найден' });
    }
    
    // Проверяем права на удаление
    if (item.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }
    
    await VirtualItem.findByIdAndDelete(itemId);
    
    res.json({ message: 'Элемент удален' });
  } catch (error) {
    console.error('Error deleting virtual item:', error);
    res.status(500).json({ message: 'Ошибка при удалении элемента' });
  }
});

module.exports = router;
