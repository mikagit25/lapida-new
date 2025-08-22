const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Memorial = require('../models/Memorial');
const User = require('../models/User');

// Добавить редактора с секциями
router.post('/:id/editors', auth, async (req, res) => {
  try {
    const { userId, sections, role } = req.body;
    const memorial = await Memorial.findById(req.params.id);
    if (!memorial) return res.status(404).json({ error: 'Memorial not found' });
    // Только создатель может делегировать
    if (memorial.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'No permission' });
    }
    // Проверка на дублирование
    if (memorial.editors.some(e => e.user.toString() === userId)) {
      return res.status(400).json({ error: 'User already an editor' });
    }
    memorial.editors.push({ user: userId, sections, role });
    await memorial.save();
    res.json({ success: true, editors: memorial.editors });
  } catch (err) {
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
    // Только создатель и редакторы могут видеть
    const isEditor = memorial.editors.some(e => e.user._id.toString() === req.user._id.toString());
    if (memorial.creator.toString() !== req.user._id.toString() && !isEditor) {
      return res.status(403).json({ error: 'No permission' });
    }
    res.json({ editors: memorial.editors });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
