const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'memorial', 'user', etc.
  targetId: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
