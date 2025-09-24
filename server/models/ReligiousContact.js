const mongoose = require('mongoose');

const ReligiousContactSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  type: { type: String, required: true }, // phone, email, address, site, social, etc.
  value: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousContact', ReligiousContactSchema);
