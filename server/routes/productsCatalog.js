const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Получить все товары всех компаний с фильтрацией и сортировкой
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
  } catch (err) {
    res.status(500).json({ message: 'Ошибка получения товаров' });
  }
});

module.exports = router;
