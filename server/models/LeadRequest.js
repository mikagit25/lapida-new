const mongoose = require('mongoose');

const LeadRequestSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousService' }],
  userName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  message: { type: String, trim: true },
  channel: { type: String, enum: ['web', 'phone', 'chat', 'offline'], default: 'web' },
  status: { type: String, enum: ['new', 'in_progress', 'done', 'rejected'], default: 'new' },
  source: { type: String, trim: true },
  meta: {},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LeadRequestSchema.index({ organization: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('LeadRequest', LeadRequestSchema);
