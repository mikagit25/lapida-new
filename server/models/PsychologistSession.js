const mongoose = require('mongoose');

const psychologistSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ['user', 'ai', 'system'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

psychologistSessionSchema.index({ sessionId: 1 });
psychologistSessionSchema.index({ userId: 1 });

module.exports = mongoose.model('PsychologistSession', psychologistSessionSchema);
