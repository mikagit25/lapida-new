const express = require('express');
const router = express.Router();

// DEMO: in-memory events
let demoEvents = [
  { date: '2024-01-01', title: 'Создан мемориал', description: 'Мемориал Иван Иванов открыт.' },
  { date: '2024-02-15', title: 'Добавлено фото', description: 'Загружено первое фото.' },
  { date: '2024-03-10', title: 'Добавлен родственник', description: 'Добавлена Мария Иванова.' }
];

router.get('/', (req, res) => {
  res.json({ events: demoEvents });
});

// TODO: POST/PUT/DELETE for editing events

module.exports = router;
