const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Друзья пользователя
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Родственники пользователя
  relatives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  companies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  // Галерея пользователя: пути вида /upload/gallery/имя_файла.jpg (как в мемориалах)
  gallery: {
    type: [String],
    default: []
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'Имя не должно превышать 50 символов'],
    default: null
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Фамилия не должна превышать 50 символов'],
    default: null
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [50, 'Отчество не должно превышать 50 символов'],
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  dateOfBirth: {
    type: String, // Можно заменить на Date, если нужно хранить как дату
    default: null
  },
  country: {
    type: String,
    trim: true,
    maxlength: [100, 'Страна не должна превышать 100 символов'],
    default: null
  },
  city: {
    type: String,
    trim: true,
    maxlength: [100, 'Город не должен превышать 100 символов'],
    default: null
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Адрес не должен превышать 200 символов'],
    default: null
  },
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    minlength: [2, 'Имя должно содержать минимум 2 символа'],
    maxlength: [50, 'Имя не должно превышать 50 символов']
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Неверный формат email']
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [6, 'Пароль должен содержать минимум 6 символов']
  },
  avatar: {
    type: String,
    default: null
  },
  photo: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null,
    trim: true
  },
  bio: {
    type: String,
    default: null,
    maxlength: [500, 'Биография не должна превышать 500 символов']
  },
  biography: {
    type: String,
    default: null,
    maxlength: [2000, 'Биография не должна превышать 2000 символов']
  },
  interests: {
    type: String,
    default: null,
    maxlength: [1000, 'Интересы не должны превышать 1000 символов']
  },
  profession: {
    type: String,
    default: null,
    maxlength: [200, 'Профессия не должна превышать 200 символов']
  },
  education: {
    type: String,
    default: null,
    maxlength: [1000, 'Образование не должно превышать 1000 символов']
  },
  achievements: {
    type: String,
    default: null,
    maxlength: [1000, 'Достижения не должны превышать 1000 символов']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  preferences: {
    type: Object,
    default: {
      emailNotifications: true,
      pushNotifications: true,
      publicProfile: true,
      showEmail: false,
      showPhone: false,
      language: 'ru',
      theme: 'light'
    }
  }
}, {
  timestamps: true
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Удаление пароля из JSON ответа
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
