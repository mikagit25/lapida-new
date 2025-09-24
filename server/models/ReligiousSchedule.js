// Модель расписания событий/служб церкви
const mongoose = require('mongoose');

const ReligiousScheduleSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  time: String,
  type: { type: String, enum: ['service', 'event', 'meeting', 'other'], default: 'service' },
  location: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousSchedule', ReligiousScheduleSchema);
