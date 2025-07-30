const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // Текст комментария (воспоминания)
  text: {
    type: String,
    required: [true, 'Текст комментария обязателен'],
    trim: true,
    maxlength: [1000, 'Комментарий не должен превышать 1000 символов']
  },
  
  // Автор комментария
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Для анонимных комментариев
  },
  
  // Имя автора (для анонимных комментариев)
  authorName: {
    type: String,
    trim: true,
    maxlength: [50, 'Имя автора не должно превышать 50 символов']
  },
  
  // Мемориал, к которому относится комментарий
  memorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memorial',
    required: true
  },
  
  // Опциональное фото к комментарию
  photo: {
    type: String, // URL изображения
    default: null
  },
  
  // Статус модерации
  isApproved: {
    type: Boolean,
    default: true // По умолчанию одобрен, можно изменить на false для модерации
  },
  
  // IP адрес для анонимных комментариев
  ipAddress: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Индексы
commentSchema.index({ memorial: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ isApproved: 1 });

// Виртуальное поле для отображаемого имени автора
commentSchema.virtual('displayAuthor').get(function() {
  if (this.author && this.author.name) {
    return this.author.name;
  }
  return this.authorName || 'Аноним';
});

// Включить виртуальные поля в JSON
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Comment', commentSchema);
