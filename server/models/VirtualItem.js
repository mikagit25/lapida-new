const mongoose = require('mongoose');

const virtualItemSchema = new mongoose.Schema({
  memorialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memorial',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['flower', 'candle']
  },
  itemType: {
    type: String,
    required: true // rose, tulip, white-candle, etc.
  },
  icon: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    maxLength: 200
  },
  authorName: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true // время жизни в миллисекундах
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Индекс для быстрого поиска по мемориалу и типу
virtualItemSchema.index({ memorialId: 1, type: 1 });

// Удаляем автоматический TTL индекс - элементы будут фильтроваться по duration в коде
// virtualItemSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('VirtualItem', virtualItemSchema);
