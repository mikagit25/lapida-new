const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
  memorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memorial',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Заголовок события обязателен'],
    trim: true,
    maxlength: [200, 'Заголовок не должен превышать 200 символов']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Описание не должно превышать 2000 символов']
  },
  date: {
    type: Date
  },
  dateDisplay: {
    type: String,
    trim: true
  },
  photos: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: '',
      maxlength: [500, 'Подпись к фото не должна превышать 500 символов']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  eventType: {
    type: String,
    enum: ['birth', 'education', 'career', 'family', 'achievement', 'travel', 'health', 'hobby', 'life', 'other'],
    default: 'other'
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Местоположение не должно превышать 200 символов']
  },
  ageAtEvent: {
    type: Number,
    min: 0,
    max: 150
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  authorName: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Индекс для хронологического отображения
timelineEventSchema.index({ memorial: 1, date: 1 });
timelineEventSchema.index({ memorial: 1, isPublic: 1, date: 1 });
timelineEventSchema.index({ memorial: 1, eventType: 1 });

// Виртуальное поле для форматированного возраста
timelineEventSchema.virtual('formattedAge').get(function() {
  if (this.ageAtEvent !== undefined && this.ageAtEvent !== null) {
    const years = Math.floor(this.ageAtEvent);
    const months = Math.floor((this.ageAtEvent - years) * 12);
    
    if (years === 0) {
      return months === 1 ? '1 месяц' : `${months} месяцев`;
    } else if (months === 0) {
      return years === 1 ? '1 год' : `${years} лет`;
    } else {
      return `${years} лет ${months} месяцев`;
    }
  }
  return null;
});

// Метод для автоматического вычисления возраста на основе даты рождения
timelineEventSchema.methods.calculateAge = function(birthDate) {
  if (!birthDate || !this.date) return null;
  
  const birth = new Date(birthDate);
  const event = new Date(this.date);
  
  if (event < birth) return null;
  
  const diffTime = event - birth;
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  
  return Math.max(0, diffYears);
};

// Метод для форматирования даты
timelineEventSchema.methods.formatDate = function() {
  const date = new Date(this.date);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Настройка JSON вывода
timelineEventSchema.set('toJSON', { virtuals: true });
timelineEventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TimelineEvent', timelineEventSchema);
