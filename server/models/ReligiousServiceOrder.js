// Модель заказа на услугу религиозной организации
const mongoose = require('mongoose');

const ReligiousServiceOrderSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousService', required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: String, // записка/пожелание
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousServiceOrder', ReligiousServiceOrderSchema);
