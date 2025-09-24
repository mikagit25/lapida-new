// Модель товара религиозной организации
const mongoose = require('mongoose');

const ReligiousProductSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  name: { type: String, required: true },
  description: String,
  price: Number,
  image: String,
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousProduct', ReligiousProductSchema);
