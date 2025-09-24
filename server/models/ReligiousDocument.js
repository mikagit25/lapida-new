const mongoose = require('mongoose');

const ReligiousDocumentSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL or path to file
  description: { type: String },
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousDocument', ReligiousDocumentSchema);
