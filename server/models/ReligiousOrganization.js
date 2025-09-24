// Модель данных для религиозной организации (MongoDB/Mongoose)

const mongoose = require('mongoose');

const ReligiousOrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // церковь, приход, община и др.
  confession: { type: String }, // православие, католицизм, ислам и др.
  description: { type: String },
  contacts: {
    phone: String,
    email: String,
    website: String,
    address: String
  },
  logo: String, // url
  background: String, // url for background image
  photos: [String], // массив url
  documents: [String], // массив url
  services: [{
    name: String,
    description: String,
    price: Number,
    available: Boolean
  }],
  products: [{
    name: String,
    description: String,
    price: Number,
    image: String,
    available: Boolean
  }],
  schedule: [{
    date: Date,
    title: String,
    description: String
  }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousOrganization', ReligiousOrganizationSchema);
