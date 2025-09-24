const mongoose = require('mongoose');

const ReligiousNewsSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  title: { type: String, required: true },
  text: { type: String },
  images: [{ type: String }], // URLs or paths
  publishedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousNews', ReligiousNewsSchema);
