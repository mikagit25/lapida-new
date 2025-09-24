// Модель услуги религиозной организации
const mongoose = require('mongoose');

const ReligiousServiceSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  name: { type: String, required: true },
  description: String,
  price: Number,
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousService', ReligiousServiceSchema);
