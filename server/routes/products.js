const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Получить один товар по id
// Получить один товар по slug или id
router.get('/:slugOrId', async (req, res) => {
  // Диагностика: выводим все товары с их slug
  const allProductsForSlug = await Product.find({});
  console.log('Все товары для поиска по slug:', allProductsForSlug.map(p => ({ id: p._id.toString(), slug: p.slug, name: p.name })));
  try {
    const { slugOrId } = req.params;
    const allProducts = await Product.find({});
    console.log('Все товары:', allProducts.map(p => p._id.toString()));
    console.log('Запрошенный slugOrId:', slugOrId);
    let product = null;
    // Если строка похожа на ObjectId, ищем по id, иначе по slug
    const mongoose = require('mongoose');
    if (/^[a-fA-F0-9]{24}$/.test(slugOrId)) {
      try {
        product = await Product.findById(mongoose.Types.ObjectId(slugOrId));
      } catch (e) {
        console.log('Ошибка при поиске товара по ObjectId:', e.message);
      }
    }
    if (!product) {
      const foundBySlug = await Product.findOne({ slug: slugOrId });
      console.log('Поиск по slug:', slugOrId, 'Результат:', foundBySlug);
      product = foundBySlug;
    }
    console.log('Найденный товар:', product);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });
    res.json({ product });
  } catch (error) {
    console.log('Ошибка получения товара:', error.message);
    res.status(500).json({ message: 'Ошибка получения товара', error: error.message });
  }
});

module.exports = router;
