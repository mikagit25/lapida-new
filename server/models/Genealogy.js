const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilyMemberSchema = new Schema({
  name: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  memorialId: { type: Schema.Types.ObjectId, ref: 'Memorial' }
});

const GenealogySchema = new Schema({
  members: [FamilyMemberSchema]
});

module.exports = mongoose.model('Genealogy', GenealogySchema);