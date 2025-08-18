console.log('Маршрут products.js загружен');
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
// Каталог товаров
router.get('/', async (req, res) => {
  try {
    const { search = '', category = '', sort = 'new', minPrice, maxPrice } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }
    let products = await Product.find(query).populate('company', 'name');
    // Сортировка
    if (sort === 'price-asc') {
      products = products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products = products.sort((a, b) => b.price - a.price);
    } else if (sort === 'new') {
      products = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    // Формируем ответ с названием компании
    products = products.map(p => ({
      ...p.toObject(),
      companyId: p.company?._id,
      companyName: p.company?.name
    }));
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения каталога', error: error.message });
  }
});

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
  // Ищем только по slug
    console.log('Запрошен товар по slugOrId:', slugOrId);
    console.log('Все товары:', allProducts.map(p => ({ _id: p._id.toString(), slug: p.slug, name: p.name })));
    const foundBySlug = await Product.findOne({ slug: slugOrId });
    if (!foundBySlug) {
      console.log('Товар не найден по slug:', slugOrId);
      return res.status(404).json({ message: 'Товар не найден', slugOrId });
    }
    console.log('Найденный товар:', foundBySlug);
    res.json({ product: foundBySlug });
  } catch (error) {
    console.log('Ошибка получения товара:', error.message);
    res.status(500).json({ message: 'Ошибка получения товара', error: error.message });
  }
});

module.exports = router;
