const mongoose = require('mongoose');

const ReligiousTeamMemberSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'ReligiousOrganization', required: true },
  name: { type: String, required: true },
  position: { type: String },
  photo: { type: String }, // URL or path
  description: { type: String },
  contacts: { type: String }, // e.g. phone, email, social
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReligiousTeamMember', ReligiousTeamMemberSchema);
