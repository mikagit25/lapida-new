const mongoose = require('mongoose');

const CompanyViewSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  count: { type: Number, default: 1 },
});

CompanyViewSchema.index({ companyId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('CompanyView', CompanyViewSchema);
