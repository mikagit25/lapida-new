const express = require('express');
const PhotoComment = require('../models/PhotoComment');
const Memorial = require('../models/Memorial');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Получение всех комментариев к фото
router.get('/memorial/:memorialId/photo', async (req, res) => {
  try {
    const { memorialId } = req.params;
    const { photoUrl } = req.query;

    if (!photoUrl) {
      return res.status(400).json({ error: 'photoUrl обязателен' });
    }

    const comments = await PhotoComment.find({
      memorial: memorialId,
      photoUrl: photoUrl
    })
    .populate('author', 'name')
    .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    console.error('Ошибка получения комментариев:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавление комментария к фото
router.post('/memorial/:memorialId/photo/comment', auth, async (req, res) => {
  try {
    const { memorialId } = req.params;
    const { photoUrl, text } = req.body;

    if (!photoUrl || !text) {
      return res.status(400).json({ error: 'photoUrl и text обязательны' });
    }

    // Проверяем существование мемориала
    const memorial = await Memorial.findById(memorialId);
    if (!memorial) {
      return res.status(404).json({ error: 'Мемориал не найден' });
    }

    // Создаем комментарий
    const comment = new PhotoComment({
      memorial: memorialId,
      photoUrl,
      author: req.user.id,
      authorName: req.user.name,
      text: text.trim()
    });

    await comment.save();
    await comment.populate('author', 'name');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Ошибка создания комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление комментария (только автор или владелец мемориала)
router.delete('/comment/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await PhotoComment.findById(commentId).populate('memorial');
    if (!comment) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    // Проверяем права: автор комментария или владелец мемориала
    if (comment.author.toString() !== req.user.id && 
        comment.memorial.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Нет прав для удаления' });
    }

    await PhotoComment.findByIdAndDelete(commentId);
    res.json({ message: 'Комментарий удален' });
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
