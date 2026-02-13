// Модель заказа на товар религиозной организации
const mongoose = require('mongoose');

const ReligiousProductOrderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousProduct', required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousProductOrder', ReligiousProductOrderSchema);
