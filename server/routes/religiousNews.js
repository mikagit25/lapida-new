const express = require('express');
const router = express.Router();
const ReligiousNews = require('../models/ReligiousNews');

// Get all news (optionally by organization)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.organization ? { organization: req.query.organization } : {};
    const news = await ReligiousNews.find(filter).sort({ publishedAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get news by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await ReligiousNews.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create news
router.post('/', async (req, res) => {
  try {
    const news = new ReligiousNews(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update news
router.put('/:id', async (req, res) => {
  try {
    const news = await ReligiousNews.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    const news = await ReligiousNews.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json({ message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
