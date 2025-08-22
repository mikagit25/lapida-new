const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number },
  category: { type: String },
  sku: { type: String },
  quantity: { type: Number },
  unit: { type: String },
  images: [{ type: String }], // массив ссылок на фото
  tags: { type: [String], default: [] }, // массив тегов
  rating: { type: Number, default: 0 }, // рейтинг товара
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
