const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  gallery: { type: [String], default: [] },
  price: { type: Number },
  category: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const companySchema = new mongoose.Schema({
  contacts: {
    type: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      website: { type: String, default: '' },
      socials: { type: [String], default: [] },
      map: { type: String, default: '' }
    },
    default: {}
  },
  phones: { type: [String], default: [] },
  emails: { type: [String], default: [] },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
  team: {
    type: [
      {
        name: { type: String, required: true },
        position: { type: String, required: true },
        photo: { type: String, default: '' },
        contacts: { type: String, default: '' }
      }
    ],
    default: []
  },
  name: { type: String, required: true },
  customSlug: { type: String, unique: true, sparse: true },
  address: { type: String, required: true },
  inn: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String },
  extra: { type: String, default: '' }, // дополнительная строка под названием
  logo: { type: String, default: '' },
  gallery: { type: [String], default: [] },
  products: { type: [productSchema], default: [] },
  documents: { type: [String], default: [] },
  status: { type: String, enum: ['pending', 'verified'], default: 'pending' },
  reviews: { type: [reviewSchema], default: [] },
  news: {
    type: [
      {
        title: { type: String, required: true },
        text: { type: String, required: true },
        image: { type: String, default: '' },
        date: { type: Date, default: Date.now }
      }
    ],
    default: []
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  headerBackground: { type: String, default: '' }
});

module.exports = mongoose.model('Company', companySchema);
