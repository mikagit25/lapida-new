const express = require('express');
const router = express.Router();

// Заглушка: список групп поддержки
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Группа поддержки родителей', description: 'Обсуждения, помощь, советы.' },
    { id: 2, name: 'Группа памяти ветеранов', description: 'Воспоминания, поддержка, мероприятия.' }
  ]);
});



// Временное хранилище обсуждений и участников (в памяти)
const groupDiscussions = {};
const groupMembers = {};

// Заглушка: детали группы
router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.json({
    id,
    name: 'Группа поддержки (пример)',
    description: 'Описание и обсуждения группы.',
    members: groupMembers[id] || [],
    discussions: groupDiscussions[id] || []
  });
});

// Вступить в группу
router.post('/:id/join', (req, res) => {
  const id = req.params.id;
  const { user } = req.body;
  if (!user || typeof user !== 'string') {
    return res.status(400).json({ message: 'Имя пользователя обязательно' });
  }
  if (!groupMembers[id]) groupMembers[id] = [];
  if (!groupMembers[id].includes(user)) {
    groupMembers[id].push(user);
  }
  res.json({ success: true });
});

// Добавить обсуждение
router.post('/:id/discussions', (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Текст обсуждения обязателен' });
  }
  if (!groupDiscussions[id]) groupDiscussions[id] = [];
  groupDiscussions[id].push(text);
  res.json({ success: true });
});

module.exports = router;
