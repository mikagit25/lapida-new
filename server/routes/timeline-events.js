const express = require('express');
const router = express.Router();
const TimelineEvent = require('../models/TimelineEvent');
const Memorial = require('../models/Memorial');
const { auth, adminAuth } = require('../middleware/auth');

// Список событий по мемориалу (публичный)
router.get('/:memorialId', async (req, res) => {
  try {
    const { memorialId } = req.params;
    const events = await TimelineEvent.find({ memorial: memorialId })
      .sort({ date: 1 })
      .lean();
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения событий', error: error.message });
  }
});

// Создать событие (авторизованный пользователь)
router.post('/:memorialId', auth, async (req, res) => {
  try {
    const { memorialId } = req.params;
    const memorial = await Memorial.findById(memorialId);
    if (!memorial) {
      return res.status(404).json({ message: 'Мемориал не найден' });
    }

    const { title, description, date, dateDisplay, eventType, location, ageAtEvent, isPublic = true, authorName } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Заголовок обязателен' });
    }

    const event = await TimelineEvent.create({
      memorial: memorialId,
      title,
      description,
      date: date ? new Date(date) : undefined,
      dateDisplay,
      eventType,
      location,
      ageAtEvent,
      isPublic,
      author: req.user?._id,
      authorName: authorName || req.user?.name
    });

    res.status(201).json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания события', error: error.message });
  }
});

// Обновить событие (автор или админ)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await TimelineEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }

    const isOwner = event.author && req.user && event.author.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Недостаточно прав для обновления' });
    }

    const updatable = ['title', 'description', 'date', 'dateDisplay', 'eventType', 'location', 'ageAtEvent', 'isPublic'];
    updatable.forEach((field) => {
      if (field in req.body) {
        event[field] = field === 'date' && req.body[field] ? new Date(req.body[field]) : req.body[field];
      }
    });

    await event.save();
    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления события', error: error.message });
  }
});

// Удалить событие (админ)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await TimelineEvent.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Событие не найдено' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления события', error: error.message });
  }
});

module.exports = router;
