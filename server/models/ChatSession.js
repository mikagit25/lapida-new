// models/ChatSession.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'ai', 'system'], required: true },
  content: { type: String, required: true },
  ts: { type: Date, default: Date.now }
}, { _id: false });

const ChatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  messages: [MessageSchema],
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
