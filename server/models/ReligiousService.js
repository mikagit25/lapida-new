// Модель услуги религиозной организации
const mongoose = require('mongoose');

const ReligiousServiceSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  category: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  summary: { type: String, trim: true },
  description: { type: String, trim: true },
  priceMin: { type: Number },
  priceMax: { type: Number },
  currency: { type: String, default: 'RUB' },
  isEmergency: { type: Boolean, default: false },
  tags: [{ type: String, trim: true }],
  available: { type: Boolean, default: true }
}, { timestamps: true });

ReligiousServiceSchema.index({ organization: 1 });
ReligiousServiceSchema.index({ category: 1 });

module.exports = mongoose.model('ReligiousService', ReligiousServiceSchema);
