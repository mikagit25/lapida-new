const mongoose = require('mongoose');

const memorialSchema = new mongoose.Schema({
  // Основная информация (согласно ТЗ)
  firstName: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    maxlength: [50, 'Имя не должно превышать 50 символов']
  },
  lastName: {
    type: String,
    required: [true, 'Фамилия обязательна'],
    trim: true,
    maxlength: [50, 'Фамилия не должна превышать 50 символов']
  },
  
  // Даты
  birthDate: {
    type: Date,
    required: [true, 'Дата рождения обязательна']
  },
  deathDate: {
    type: Date,
    required: [true, 'Дата смерти обязательна'],
    validate: {
      validator: function(value) {
        return value > this.birthDate;
      },
      message: 'Дата смерти должна быть позже даты рождения'
    }
  },
  
  // Биография и эпитафия (согласно ТЗ)
  biography: {
    type: String,
    trim: true,
    maxlength: [5000, 'Биография не должна превышать 5000 символов']
  },
  epitaph: {
    type: String,
    trim: true,
    maxlength: [500, 'Эпитафия не должна превышать 500 символов']
  },
  
  // Главное фото
  profileImage: {
    type: String, // URL изображения
    default: null
  },
  
  // Галерея (согласно ТЗ)
  galleryImages: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: [200, 'Подпись не должна превышать 200 символов']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Таймлайн жизни (согласно ТЗ)
  timeline: [{
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear()
    },
    event: {
      type: String,
      required: true,
      maxlength: [200, 'Событие не должно превышать 200 символов']
    },
    description: {
      type: String,
      maxlength: [1000, 'Описание события не должно превышать 1000 символов']
    },
    image: String // URL изображения события
  }],
  
  // Настройки доступа (согласно ТЗ)
  isPrivate: {
    type: Boolean,
    default: false
  },
  
  // QR-код и шэринг (согласно ТЗ)
  shareUrl: {
    type: String,
    unique: true
  },
  location: {
    cemetery: {
      type: String,
      required: [true, 'Название кладбища обязательно'],
      trim: true
    },
    section: {
      type: String,
      trim: true
    },
    plot: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  biography: {
    type: String,
    maxlength: [5000, 'Биография не должна превышать 5000 символов']
  },
  tributes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: [true, 'Сообщение обязательно'],
      maxlength: [500, 'Сообщение не должно превышать 500 символов']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  flowers: [{
    type: {
      type: String,
      enum: ['rose', 'lily', 'carnation', 'tulip', 'other'],
      default: 'rose'
    },
    color: {
      type: String,
      enum: ['red', 'white', 'pink', 'yellow', 'purple', 'other'],
      default: 'red'
    },
    message: {
      type: String,
      maxlength: [200, 'Сообщение не должно превышать 200 символов']
    },
    giver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    giverName: {
      type: String,
      maxlength: [50, 'Имя не должно превышать 50 символов']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Владелец (согласно ТЗ)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Гости для приватных мемориалов (согласно ТЗ)
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Статистика
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Генерация уникальной ссылки для шэринга (согласно ТЗ)
memorialSchema.pre('save', function(next) {
  if (!this.shareUrl) {
    const firstName = this.firstName.toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
    const lastName = this.lastName.toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
    this.shareUrl = `${firstName}-${lastName}-${Date.now()}`;
  }
  next();
});

// Виртуальное поле для полного имени (согласно ТЗ)
memorialSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Виртуальное поле для возраста (согласно ТЗ)
memorialSchema.virtual('age').get(function() {
  const birth = new Date(this.birthDate);
  const death = new Date(this.deathDate);
  let age = death.getFullYear() - birth.getFullYear();
  const monthDiff = death.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});

// Виртуальное поле для форматированных дат
memorialSchema.virtual('lifespan').get(function() {
  const birth = new Date(this.birthDate).toLocaleDateString('ru-RU');
  const death = new Date(this.deathDate).toLocaleDateString('ru-RU');
  return `${birth} - ${death}`;
});

// Индексы для поиска (согласно ТЗ)
memorialSchema.index({ firstName: 'text', lastName: 'text', biography: 'text' });
memorialSchema.index({ createdBy: 1, createdAt: -1 });
memorialSchema.index({ isPrivate: 1 });
memorialSchema.index({ shareUrl: 1 });

// Метод для увеличения просмотров
memorialSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Включить виртуальные поля в JSON
memorialSchema.set('toJSON', { virtuals: true });
memorialSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Memorial', memorialSchema);
