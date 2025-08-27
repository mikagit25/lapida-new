const express = require('express');
const router = express.Router();

// Временное хранилище дней памяти (в памяти)
const memoryDays = [
  { id: 1, date: '2025-09-01', title: 'День памяти мамы', description: 'Годовщина.' },
  { id: 2, date: '2025-10-15', title: 'День памяти дедушки', description: 'День рождения.' }
];

// Получить все дни памяти
router.get('/', (req, res) => {
  res.json(memoryDays);
});

// Добавить день памяти
router.post('/', (req, res) => {
  const { date, title, description } = req.body;
  if (!date || !title) return res.status(400).json({ message: 'Дата и название обязательны' });
  const newDay = { id: Date.now(), date, title, description };
  memoryDays.push(newDay);
  res.json(newDay);
});

module.exports = router;
