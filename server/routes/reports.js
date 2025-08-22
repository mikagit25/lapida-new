const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Получить все жалобы
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения жалоб', error: error.message });
  }
});

// Создать жалобу
router.post('/', async (req, res) => {
  try {
    const { type, targetId, reason } = req.body;
    const report = new Report({ type, targetId, reason });
    await report.save();
    res.status(201).json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания жалобы', error: error.message });
  }
});

// Обновить статус жалобы
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления статуса', error: error.message });
  }
});

// Удалить жалобу
router.delete('/:id', async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления жалобы', error: error.message });
  }
});

module.exports = router;
