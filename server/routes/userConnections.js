const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Получить список друзей
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email avatar');
    res.json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить список родственников
router.get('/relatives', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('relatives', 'name email avatar');
    res.json({ relatives: user.relatives });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Добавить друга
router.post('/friends/:id', auth, async (req, res) => {
  try {
    const friendId = req.params.id;
    if (friendId === req.user._id.toString()) return res.status(400).json({ error: 'Нельзя добавить себя' });
    const user = await User.findById(req.user._id);
    if (user.friends.includes(friendId)) return res.status(400).json({ error: 'Уже в друзьях' });
    user.friends.push(friendId);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить друга
router.delete('/friends/:id', auth, async (req, res) => {
  try {
    const friendId = req.params.id;
    const user = await User.findById(req.user._id);
    user.friends = user.friends.filter(f => f.toString() !== friendId);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Добавить родственника
router.post('/relatives/:id', auth, async (req, res) => {
  try {
    const relativeId = req.params.id;
    if (relativeId === req.user._id.toString()) return res.status(400).json({ error: 'Нельзя добавить себя' });
    const user = await User.findById(req.user._id);
    if (user.relatives.includes(relativeId)) return res.status(400).json({ error: 'Уже в родственниках' });
    user.relatives.push(relativeId);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить родственника
router.delete('/relatives/:id', auth, async (req, res) => {
  try {
    const relativeId = req.params.id;
    const user = await User.findById(req.user._id);
    user.relatives = user.relatives.filter(r => r.toString() !== relativeId);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
