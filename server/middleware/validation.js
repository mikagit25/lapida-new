const Joi = require('joi');

// Middleware для валидации body
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации данных',
        errors
      });
    }
    
    next();
  };
};

// Middleware для валидации query
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации параметров',
        errors
      });
    }

    next();
  };
};

// Схемы валидации

// Регистрация пользователя
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Имя пользователя должно содержать только буквы и цифры',
      'string.min': 'Имя пользователя должно быть не менее 3 символов',
      'string.max': 'Имя пользователя должно быть не более 30 символов',
      'any.required': 'Имя пользователя обязательно'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Некорректный email адрес',
      'any.required': 'Email обязателен'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Пароль должен быть не менее 6 символов',
      'string.pattern.base': 'Пароль должен содержать заглавные и строчные буквы, цифры',
      'any.required': 'Пароль обязателен'
    }),
  
  fullName: Joi.string()
    .max(100)
    .optional()
    .allow(''),
  
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Некорректный формат телефона'
    })
});

// Вход пользователя
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Некорректный email адрес',
      'any.required': 'Email обязателен'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Пароль обязателен'
    })
});

// Создание мемориала
const memorialSchema = Joi.object({
  firstName: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Имя должно быть не более 100 символов',
      'any.required': 'Имя обязательно'
    }),
  
  lastName: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Фамилия должна быть не более 100 символов',
      'any.required': 'Фамилия обязательна'
    }),
  
  middleName: Joi.string()
    .max(100)
    .optional()
    .allow(''),
  
  birthDate: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Дата рождения не может быть в будущем'
    }),
  
  deathDate: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Дата смерти не может быть в будущем'
    }),
  
  biography: Joi.string()
    .max(10000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Биография должна быть не более 10000 символов'
    }),
  
  epitaph: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Эпитафия должна быть не более 1000 символов'
    })
});

// Создание заказа
const orderSchema = Joi.object({
  items: Joi.array()
    .items(Joi.object({
      productId: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().min(1).required(),
      companyId: Joi.string().required()
    }))
    .min(1)
    .required()
    .messages({
      'array.min': 'Заказ должен содержать хотя бы один товар',
      'any.required': 'Список товаров обязателен'
    }),
  
  name: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Имя должно быть не более 100 символов',
      'any.required': 'Имя обязательно'
    }),
  
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Некорректный формат телефона',
      'any.required': 'Телефон обязателен'
    }),
  
  address: Joi.string()
    .max(500)
    .required()
    .messages({
      'string.max': 'Адрес должен быть не более 500 символов',
      'any.required': 'Адрес обязателен'
    }),
  
  companyId: Joi.string()
    .required()
    .messages({
      'any.required': 'ID компании обязателен'
    }),
  
  comment: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Комментарий должен быть не более 1000 символов'
    })
});

// Создание компании
const companySchema = Joi.object({
  name: Joi.string()
    .max(200)
    .required()
    .messages({
      'string.max': 'Название компании должно быть не более 200 символов',
      'any.required': 'Название компании обязательно'
    }),
  
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'Slug должен содержать только строчные буквы, цифры и дефисы',
      'string.max': 'Slug должен быть не более 100 символов',
      'any.required': 'Slug обязателен'
    }),
  
  description: Joi.string()
    .max(5000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Описание должно быть не более 5000 символов'
    }),
  
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Некорректный формат телефона'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .allow('')
    .messages({
      'string.email': 'Некорректный email адрес'
    }),
  
  address: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Адрес должен быть не более 500 символов'
    }),
  
  city: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Город должен быть не более 100 символов'
    })
});

// Создание товара
const productSchema = Joi.object({
  name: Joi.string()
    .max(200)
    .required()
    .messages({
      'string.max': 'Название товара должно быть не более 200 символов',
      'any.required': 'Название товара обязательно'
    }),
  
  description: Joi.string()
    .max(5000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Описание должно быть не более 5000 символов'
    }),
  
  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Цена не может быть отрицательной',
      'any.required': 'Цена обязательна'
    }),
  
  category: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Категория должна быть не более 100 символов'
    }),
  
  companyId: Joi.string()
    .required()
    .messages({
      'any.required': 'ID компании обязателен'
    }),
  
  stock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.integer': 'Остаток должен быть целым числом',
      'number.min': 'Остаток не может быть отрицательным'
    })
});

// Комментарий
const commentSchema = Joi.object({
  text: Joi.string()
    .max(1000)
    .required()
    .messages({
      'string.max': 'Комментарий должен быть не более 1000 символов',
      'any.required': 'Текст комментария обязателен'
    }),
  
  authorId: Joi.string()
    .optional(),
  
  memorialId: Joi.string()
    .optional(),
  
  companyId: Joi.string()
    .optional()
});

// Пул: ликвидность
const poolLiquiditySchema = Joi.object({
  wallet: Joi.string().required(),
  amountA: Joi.number().required(),
  amountB: Joi.number().required(),
  action: Joi.string().valid('add', 'remove', 'claim', 'add-once').required(),
  txHash: Joi.string().required(),
  timestamp: Joi.date().optional()
});

// Пул: обмен/покупка
const poolExchangeSchema = Joi.object({
  wallet: Joi.string().required(),
  stablecoin: Joi.string().optional(),
  fromToken: Joi.string().optional(),
  toToken: Joi.string().optional(),
  amount: Joi.number().optional(),
  amountIn: Joi.number().optional(),
  amountOut: Joi.number().optional(),
  tokenAmount: Joi.number().optional(),
  price: Joi.number().optional(),
  txHash: Joi.string().required(),
  timestamp: Joi.date().optional()
}).custom((value, helpers) => {
  if (!value.amount && !value.amountIn) {
    return helpers.error('any.custom', { message: 'amount или amountIn обязателен' });
  }
  return value;
});

// Пул: стейкинг
const poolStakingSchema = Joi.object({
  wallet: Joi.string().required(),
  amount: Joi.number().required(),
  mlpd: Joi.number().required(),
  txHash: Joi.string().required(),
  timestamp: Joi.date().optional()
});

// Пул: query для истории
const poolHistoryQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(500).optional(),
  skip: Joi.number().integer().min(0).optional(),
  type: Joi.string().valid('liquidity', 'exchange', 'staking').optional(),
  wallet: Joi.string().optional(),
  from: Joi.date().optional(),
  to: Joi.date().optional(),
  cursorTs: Joi.date().optional(),
  cursorId: Joi.string().optional()
});

// Организации: создание/обновление
const organizationSchema = Joi.object({
  name: Joi.string().max(200).required(),
  // slug может не приходить с клиента — генерируем на сервере
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).max(200).optional(),
  confession: Joi.string().max(100).optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  description: Joi.string().max(5000).optional(),
  contacts: Joi.object({
    phones: Joi.array().items(Joi.object({
      label: Joi.string().max(50).optional(),
      value: Joi.string().max(50).required()
    })).optional(),
    email: Joi.string().email().optional(),
    website: Joi.string().uri().optional(),
    messengers: Joi.object({
      whatsapp: Joi.string().optional(),
      telegram: Joi.string().optional(),
      viber: Joi.string().optional()
    }).optional(),
    address: Joi.object({
      city: Joi.string().max(100).optional(),
      region: Joi.string().max(100).optional(),
      street: Joi.string().max(200).optional(),
      zipcode: Joi.string().max(20).optional(),
      country: Joi.string().max(100).optional(),
      location: Joi.object({ lat: Joi.number(), lng: Joi.number() }).optional()
    }).optional()
  }).optional(),
  serviceAreas: Joi.array().items(Joi.object({
    city: Joi.string().optional(),
    region: Joi.string().optional(),
    radiusKm: Joi.number().min(0).optional(),
    zipcodes: Joi.array().items(Joi.string()).optional()
  })).optional(),
  media: Joi.object({
    logo: Joi.string().uri().optional(),
    cover: Joi.string().uri().optional(),
    gallery: Joi.array().items(Joi.string().uri()).optional()
  }).optional(),
  documents: Joi.array().items(Joi.object({ name: Joi.string().max(200), url: Joi.string().uri() })).optional(),
  is24x7: Joi.boolean().optional(),
  hasEmergency: Joi.boolean().optional(),
  isVerified: Joi.boolean().optional(),
  isPublic: Joi.boolean().optional()
});

const organizationQuerySchema = Joi.object({
  city: Joi.string().optional(),
  confession: Joi.string().optional(),
  service: Joi.string().optional(),
  emergency: Joi.boolean().optional(),
  q: Joi.string().max(200).optional(),
  sort: Joi.string().valid('rating', 'response', 'new').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

// Услуга организации
const organizationServiceSchema = Joi.object({
  organization: Joi.string().required(),
  category: Joi.string().max(100).optional(),
  name: Joi.string().max(200).required(),
  summary: Joi.string().max(500).optional(),
  description: Joi.string().max(5000).optional(),
  priceMin: Joi.number().min(0).optional(),
  priceMax: Joi.number().min(0).optional(),
  currency: Joi.string().max(10).optional(),
  isEmergency: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  available: Joi.boolean().optional()
});

const organizationServiceListSchema = Joi.object({
  category: Joi.string().max(100).optional(),
  available: Joi.boolean().optional(),
  emergency: Joi.boolean().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  sort: Joi.string().valid('created_desc', 'price_asc', 'price_desc', 'emergency').optional(),
  limit: Joi.number().integer().min(1).max(200).default(50),
  skip: Joi.number().integer().min(0).default(0)
});

// Заявка/лид
const leadSchema = Joi.object({
  organization: Joi.string().required(),
  services: Joi.array().items(Joi.string()).optional(),
  userName: Joi.string().max(200).required(),
  phone: Joi.string().max(50).required(),
  email: Joi.string().email().optional(),
  message: Joi.string().max(2000).optional(),
  channel: Joi.string().valid('web', 'phone', 'chat', 'offline').optional(),
  source: Joi.string().max(100).optional()
});

const leadStatusSchema = Joi.object({
  status: Joi.string().valid('new', 'in_progress', 'done', 'rejected').optional(),
  message: Joi.string().max(2000).optional()
}).or('status', 'message');

const leadListQuerySchema = Joi.object({
  status: Joi.string().valid('new', 'in_progress', 'done', 'rejected').optional(),
  channel: Joi.string().valid('web', 'phone', 'chat', 'offline').optional(),
  from: Joi.date().optional(),
  to: Joi.date().optional(),
  sort: Joi.string().valid('newest', 'oldest', 'status').optional(),
  limit: Joi.number().integer().min(1).max(200).default(50),
  skip: Joi.number().integer().min(0).default(0)
});

module.exports = {
  validate,
  validateQuery,
  registerSchema,
  loginSchema,
  memorialSchema,
  orderSchema,
  companySchema,
  productSchema,
  commentSchema,
  poolLiquiditySchema,
  poolExchangeSchema,
  poolStakingSchema,
  poolHistoryQuerySchema,
  organizationSchema,
  organizationQuerySchema,
  organizationServiceSchema,
  organizationServiceListSchema,
  leadSchema,
  leadStatusSchema,
  leadListQuerySchema
};
