const mongoose = require('mongoose');

const ReligiousEventReportSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousEvent', required: true },
  title: { type: String, required: true },
  reportText: { type: String },
  images: [{ type: String }], // URLs or paths to photos
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousEventReport', ReligiousEventReportSchema);
