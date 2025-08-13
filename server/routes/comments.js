const express = require('express');
const Comment = require('../models/Comment');
const Memorial = require('../models/Memorial');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');

const router = express.Router();

// Добавляем логирование всех запросов к роуту
router.use((req, res, next) => {
  console.log(`[Comments Route] ${req.method} ${req.originalUrl}`, req.body);
  next();
});

// Получить комментарии для мемориала
router.get('/memorial/:memorialId', async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const filter = {
      memorial: req.params.memorialId,
      isApproved: true
    };
    if (type) {
      filter.type = type;
    }
    const comments = await Comment.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Comment.countDocuments(filter);
    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении комментариев', error: error.message });
  }
});

// Добавить комментарий (опциональная авторизация - анонимные комментарии разрешены)
router.post('/', optionalAuthMiddleware, async (req, res) => {
  try {
    const { text, memorial, authorName, photo, type } = req.body;
    
    // Проверить, что мемориал существует
    const memorialDoc = await Memorial.findById(memorial);
    if (!memorialDoc) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }
    
    // Проверить доступ к приватному мемориалу
    if (memorialDoc.isPrivate && !req.user) {
      return res.status(403).json({ message: 'Для комментирования приватного мемориала требуется авторизация' });
    }
    
    const comment = new Comment({
      text,
      memorial,
      author: req.user ? req.user.id : null,
      authorName: req.user ? null : authorName, // Имя только для анонимных комментариев
      photo,
      type: type || 'general', // Устанавливаем тип комментария
      ipAddress: req.ip
    });
    
    await comment.save();
    await comment.populate('author', 'name');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании комментария', error: error.message });
  }
});

// Обновить комментарий (только для авторизованных пользователей - своих комментариев)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }
    
    // Проверить, что пользователь - автор комментария
    if (!comment.author || comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'У вас нет прав на редактирование этого комментария' });
    }
    
    const { text, photo } = req.body;
    
    if (text !== undefined) comment.text = text;
    if (photo !== undefined) comment.photo = photo;
    
    await comment.save();
    await comment.populate('author', 'name');
    
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении комментария', error: error.message });
  }
});

// Удалить комментарий (автор или владелец мемориала)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('memorial');
    
    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }
    
    // Проверить права: автор комментария или владелец мемориала
    const isAuthor = comment.author && comment.author.toString() === req.user.id;
    const isMemorialOwner = comment.memorial.createdBy.toString() === req.user.id;
    
    if (!isAuthor && !isMemorialOwner) {
      return res.status(403).json({ message: 'У вас нет прав на удаление этого комментария' });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Комментарий успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении комментария', error: error.message });
  }
});

// Модерация комментариев (только для владельца мемориала)
router.patch('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('memorial');
    
    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }
    
    // Проверить, что пользователь - владелец мемориала
    if (comment.memorial.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'У вас нет прав на модерацию этого комментария' });
    }
    
    comment.isApproved = req.body.isApproved;
    await comment.save();
    
    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при модерации комментария', error: error.message });
  }
});

module.exports = router;
