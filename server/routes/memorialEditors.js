const express = require('express');
const router = express.Router();
// Парсим JSON, так как роут подключён до глобальных парсеров в app.js
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { auth } = require('../middleware/auth');
const Memorial = require('../models/Memorial');
const User = require('../models/User');

// Добавить редактора с секциями
router.post('/:id/editors', auth, async (req, res) => {
  try {
    const { userId, sections = [], role = 'custom' } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) return res.status(404).json({ error: 'Memorial not found' });
    const ownerId = (memorial.createdBy || memorial.creator || '').toString();
    // Только создатель может делегировать
    if (!ownerId || ownerId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'No permission' });
    }
    const editorsArray = Array.isArray(memorial.editors) ? memorial.editors : [];
    // Проверка на дублирование
    if (editorsArray.some(e => e.user.toString() === userId)) {
      return res.status(400).json({ error: 'User already an editor' });
    }
    memorial.editors = editorsArray;
    memorial.editors.push({ user: userId, sections, role });
    await memorial.save();
    res.json({ success: true, editors: memorial.editors });
  } catch (err) {
    console.error('Error adding memorial editor:', err);
    res.status(500).json({ error: err.message });
  }
});

// Удалить редактора
router.delete('/:id/editors/:editorId', auth, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) return res.status(404).json({ error: 'Memorial not found' });
    if (memorial.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'No permission' });
    }
    memorial.editors = memorial.editors.filter(e => e.user.toString() !== req.params.editorId);
    await memorial.save();
    res.json({ success: true, editors: memorial.editors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить редакторов мемориала
router.get('/:id/editors', auth, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id).populate('editors.user', 'name email');
    if (!memorial) return res.status(404).json({ error: 'Memorial not found' });
    const editorsArray = Array.isArray(memorial.editors) ? memorial.editors : [];
    // Только создатель и редакторы могут видеть
    const createdBy = memorial.createdBy || memorial.creator; // поддержка разных полей
    const creatorId = createdBy ? createdBy.toString() : null;
    const isEditor = editorsArray.some(e => e.user && e.user._id && e.user._id.toString() === req.user._id.toString());
    if (creatorId !== req.user._id.toString() && !isEditor) {
      return res.status(403).json({ error: 'No permission' });
    }
    res.json({ editors: editorsArray });
  } catch (err) {
    console.error('Error fetching memorial editors:', err);
    res.status(500).json({ error: 'Failed to load editors' });
  }
});

// Проверить права на секцию
router.get('/:id/editors/check/:section', auth, async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) return res.status(404).json({ error: 'Memorial not found' });
    if (memorial.creator.toString() === req.user._id.toString()) return res.json({ canEdit: true });
    const editor = memorial.editors.find(e => e.user.toString() === req.user._id.toString());
    if (editor && editor.sections.includes(req.params.section)) {
      return res.json({ canEdit: true });
    }
    res.json({ canEdit: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
