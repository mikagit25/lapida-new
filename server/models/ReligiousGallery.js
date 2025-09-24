// Модель фотоальбома церкви
const mongoose = require('mongoose');

const ReligiousGallerySchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  title: { type: String, required: true },
  description: String,
  photos: [
    {
      url: { type: String, required: true },
      caption: String,
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousGallery', ReligiousGallerySchema);
