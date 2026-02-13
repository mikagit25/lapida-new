const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { adminAuth } = require('../middleware/auth');

// Получить все жалобы (можно фильтровать по статусу)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const complaints = await Report.find(filter).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения жалоб', error: error.message });
  }
});

// Создать жалобу (публичный endpoint)
router.post('/', async (req, res) => {
  try {
    const { type, text, targetId } = req.body;

    if (!type || !text) {
      return res.status(400).json({ message: 'type и text обязательны' });
    }

    const complaint = new Report({
      type,
      targetId: targetId || 'unknown',
      reason: text,
      status: 'open'
    });

    await complaint.save();
    res.status(201).json({ complaint });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания жалобы', error: error.message });
  }
});

// Обновить статус жалобы (только админ)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Статус должен быть open или closed' });
    }

    const complaint = await Report.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Жалоба не найдена' });
    }

    res.json({ complaint });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления статуса', error: error.message });
  }
});

// Удалить жалобу (только админ)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Report.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Жалоба не найдена' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления жалобы', error: error.message });
  }
});

module.exports = router;
