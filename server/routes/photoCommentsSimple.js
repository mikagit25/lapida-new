const express = require('express');
const PhotoComment = require('../models/PhotoComment');
const router = express.Router();

// Получить все комментарии к фото
router.get('/all', async (req, res) => {
  try {
    const { memorialId, photoUrl } = req.query;
    if (!memorialId || !photoUrl) {
      return res.status(400).json({ error: 'memorialId и photoUrl обязательны' });
    }
    const comments = await PhotoComment.find({ memorial: memorialId, photoUrl }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера', details: error.message });
  }
});

// Добавить комментарий к фото
router.post('/add', async (req, res) => {
  try {
    const { memorialId, photoUrl, text, authorName } = req.body;
    if (!memorialId || !photoUrl || !text) {
      return res.status(400).json({ error: 'memorialId, photoUrl и text обязательны' });
    }
    const comment = new PhotoComment({
      memorial: memorialId,
      photoUrl,
      author: null,
      authorName: authorName || 'Аноним',
      text: text.trim()
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера', details: error.message });
  }
});

module.exports = router;
