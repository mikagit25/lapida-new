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
  
  // Кастомный slug для красивых URL
  customSlug: {
    type: String,
    unique: true,
    sparse: true, // позволяет null значения
    validate: {
      validator: function(v) {
        // Проверяем, что slug содержит только допустимые символы
        return !v || /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug может содержать только строчные буквы, цифры и дефисы'
    }
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
    },
    gravePhotos: [{
      url: {
        type: String,
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      description: {
        type: String,
        trim: true,
        maxlength: [200, 'Описание не должно превышать 200 символов']
      }
    }]
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
  
  // Пользователи с правом редактирования
  editorsUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Фоновое изображение шапки
  headerBackground: {
    type: String,
    default: null
  },
  
  // Фоновое изображение за аватаром
  avatarBackground: {
    type: String,
    default: null
  },
  
  // Фоновое изображение всей страницы
  pageBackground: {
    type: String,
    default: null
  },
  
  // Статистика
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Генерация уникальной ссылки для шэринга (согласно ТЗ)
memorialSchema.pre('save', async function(next) {
  // Генерируем shareUrl если его нет
  if (!this.shareUrl) {
    const firstName = this.firstName.toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
    const lastName = this.lastName.toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
    this.shareUrl = `${firstName}-${lastName}-${Date.now()}`;
  }
  
  // Генерируем customSlug если его нет, но только для новых мемориалов
  if (this.isNew && !this.customSlug) {
    // Функция транслитерации
    const transliterate = (text) => {
      const cyrillicToLatin = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '-'
      };
      
      return text
        .toLowerCase()
        .split('')
        .map(char => cyrillicToLatin[char] || char)
        .join('')
        .replace(/[^\w\s-]/g, '') // удаляем остальные спецсимволы
        .replace(/\s+/g, '-') // заменяем пробелы на дефисы
        .replace(/-+/g, '-') // удаляем множественные дефисы
        .replace(/^-+|-+$/g, ''); // убираем дефисы в начале и конце
    };

    const baseSlug = transliterate(`${this.firstName} ${this.lastName}`);
    
    // Если slug пустой после обработки, используем shareUrl
    if (!baseSlug || baseSlug === '-' || baseSlug === '') {
      this.customSlug = this.shareUrl || `memorial-${Date.now()}`;
    } else {
      // Проверяем уникальность slug'а
      let slug = baseSlug;
      let counter = 1;
      
      while (await this.constructor.findOne({ customSlug: slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      this.customSlug = slug;
    }
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
 memorialSchema.index({ shareUrl: 1, customSlug: 1 });

// Метод для увеличения просмотров
memorialSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Включить виртуальные поля в JSON
memorialSchema.set('toJSON', { virtuals: true });
memorialSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Memorial', memorialSchema);
