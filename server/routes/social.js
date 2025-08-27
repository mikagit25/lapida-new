const express = require('express');
const router = express.Router();

// DEMO: in-memory likes/comments
let likes = {};
let comments = {};

router.post('/like', (req, res) => {
  const { itemId } = req.body;
  likes[itemId] = (likes[itemId] || 0) + 1;
  res.json({ success: true, count: likes[itemId] });
});

router.post('/comment', (req, res) => {
  const { itemId, text } = req.body;
  if (!comments[itemId]) comments[itemId] = [];
  comments[itemId].push({ author: 'Аноним', text });
  res.json({ success: true });
});

router.get('/comments', (req, res) => {
  const { itemId } = req.query;
  res.json({ comments: comments[itemId] || [] });
});

module.exports = router;
