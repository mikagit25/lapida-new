const mongoose = require('mongoose');

const photoCommentSchema = new mongoose.Schema({
  memorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memorial',
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Индекс для быстрого поиска комментариев к фото
photoCommentSchema.index({ memorial: 1, photoUrl: 1, createdAt: -1 });

module.exports = mongoose.model('PhotoComment', photoCommentSchema);
