const express = require('express');
const router = express.Router();
const Page = require('../models/Page');

// Получить все страницы
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find();
    res.json({ pages });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения страниц', error: error.message });
  }
});

// Создать страницу
router.post('/', async (req, res) => {
  try {
    const { path, title, content } = req.body;
    const page = new Page({ path, title, content });
    await page.save();
    res.status(201).json({ page });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания страницы', error: error.message });
  }
});

// Обновить страницу
router.put('/:id', async (req, res) => {
  try {
    const { title, content, isHidden } = req.body;
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { title, content, isHidden, updatedAt: Date.now() },
      { new: true }
    );
    res.json({ page });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления страницы', error: error.message });
  }
});

// Удалить страницу
router.delete('/:id', async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления страницы', error: error.message });
  }
});

module.exports = router;
