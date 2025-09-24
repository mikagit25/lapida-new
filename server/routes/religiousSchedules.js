// CRUD роуты для расписания церкви (службы, события)
const express = require('express');
const router = express.Router();
const ReligiousSchedule = require('../models/ReligiousSchedule');
const { auth } = require('../middleware/auth');

// Получить расписание организации
router.get('/organization/:orgId', async (req, res) => {
  try {
    const schedule = await ReligiousSchedule.find({ organization: req.params.orgId }).sort({ date: 1, time: 1 });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения расписания' });
  }
});

// Получить одно событие
router.get('/:id', async (req, res) => {
  try {
    const event = await ReligiousSchedule.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Событие не найдено' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения события' });
  }
});

// Создать событие (только владелец/админ)
router.post('/', auth, async (req, res) => {
  try {
    const event = await ReligiousSchedule.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания события', details: err.message });
  }
});

// Обновить событие (только владелец/админ)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await ReligiousSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: 'Событие не найдено' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка обновления события', details: err.message });
  }
});

// Удалить событие (только владелец/админ)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await ReligiousSchedule.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Событие не найдено' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка удаления события', details: err.message });
  }
});

module.exports = router;
