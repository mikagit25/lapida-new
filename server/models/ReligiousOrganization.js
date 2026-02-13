// Модель данных для религиозной организации (MongoDB/Mongoose)

const mongoose = require('mongoose');

const ReligiousOrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  confession: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  description: { type: String, trim: true },
  contacts: {
    phones: [{ label: { type: String, trim: true }, value: { type: String, trim: true } }],
    email: { type: String, trim: true },
    website: { type: String, trim: true },
    messengers: {
      whatsapp: { type: String, trim: true },
      telegram: { type: String, trim: true },
      viber: { type: String, trim: true }
    },
    address: {
      city: { type: String, trim: true },
      region: { type: String, trim: true },
      street: { type: String, trim: true },
      zipcode: { type: String, trim: true },
      country: { type: String, trim: true },
      location: {
        lat: { type: Number },
        lng: { type: Number }
      }
    }
  },
  serviceAreas: [{ city: String, region: String, radiusKm: Number, zipcodes: [String] }],
  media: {
    logo: String,
    cover: String,
    gallery: [String]
  },
  documents: [{ name: String, url: String }],
  rating: {
    avg: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  responseTimeMinutes: { type: Number, default: null },
  is24x7: { type: Boolean, default: false },
  hasEmergency: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVerified: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

ReligiousOrganizationSchema.index({ 'contacts.address.city': 1 });
ReligiousOrganizationSchema.index({ confession: 1 });

module.exports = mongoose.model('ReligiousOrganization', ReligiousOrganizationSchema);
