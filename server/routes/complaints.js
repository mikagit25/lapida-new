const express = require('express');
const router = express.Router();

// DEMO: in-memory complaints
let complaints = [
  { type: 'content', text: 'Неподходящее фото', status: 'open' },
  { type: 'user', text: 'Спам от пользователя', status: 'closed' }
];

router.get('/', (req, res) => {
  res.json({ complaints });
});

router.post('/', (req, res) => {
  const { type, text } = req.body;
  complaints.push({ type, text, status: 'open' });
  res.json({ success: true });
});

// TODO: PUT/DELETE for moderation actions

module.exports = router;
