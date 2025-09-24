const mongoose = require('mongoose');

const ReligiousEventSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String },
  images: [{ type: String }], // URLs or paths
  registrationEnabled: { type: Boolean, default: false },
  registrationCount: { type: Number, default: 0 },
  registrationLimit: { type: Number },
  registrationList: [{
    name: String,
    email: String,
    phone: String,
    registeredAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousEvent', ReligiousEventSchema);
