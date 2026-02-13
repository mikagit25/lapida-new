# Примеры использования валидации в роутах

## Как добавить валидацию в существующие роуты

### 1. Аутентификация (routes/auth.js)

```javascript
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

// Регистрация
router.post('/register', validate(registerSchema), async (req, res) => {
  // Данные уже провалидированы
  try {
    const { username, email, password, fullName, phone } = req.body;
    
    // Проверка существующего пользователя
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Пользователь с таким email или username уже существует' 
      });
    }
    
    // Создание пользователя...
    // ... остальной код
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Вход
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Неверный email или пароль' 
      });
    }
    
    // Проверка пароля...
    // ... остальной код
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 2. Мемориалы (routes/memorials-new.js)

```javascript
const { validate, memorialSchema, commentSchema } = require('../middleware/validation');

// Создание мемориала
router.post('/', authenticate, validate(memorialSchema), async (req, res) => {
  try {
    const memorialData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const memorial = await Memorial.create(memorialData);
    res.status(201).json({ success: true, memorial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Добавление комментария
router.post('/:id/comments', authenticate, validate(commentSchema), async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.create({
      text,
      memorialId: req.params.id,
      authorId: req.user.id
    });
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 3. Заказы (routes/orders.js)

```javascript
const { validate, orderSchema } = require('../middleware/validation');

// Создание заказа
router.post('/', validate(orderSchema), async (req, res) => {
  try {
    const { items, name, phone, address, companyId, comment } = req.body;
    
    // Проверка товаров
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    
    if (products.length !== productIds.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Некоторые товары не найдены' 
      });
    }
    
    // Создание заказа
    const order = await Order.create({
      items,
      customerName: name,
      customerPhone: phone,
      deliveryAddress: address,
      companyId,
      comment,
      status: 'pending',
      totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
    
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 4. Компании (routes/companies.js)

```javascript
const { validate, companySchema, productSchema } = require('../middleware/validation');

// Создание компании
router.post('/', authenticate, validate(companySchema), async (req, res) => {
  try {
    // Проверка уникальности slug
    const existingCompany = await Company.findOne({ slug: req.body.slug });
    if (existingCompany) {
      return res.status(400).json({ 
        success: false, 
        message: 'Компания с таким slug уже существует' 
      });
    }
    
    const company = await Company.create({
      ...req.body,
      ownerId: req.user.id
    });
    
    res.status(201).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 5. Товары (routes/products.js)

```javascript
const { validate, productSchema } = require('../middleware/validation');

// Создание товара
router.post('/', authenticate, validate(productSchema), async (req, res) => {
  try {
    // Проверка прав доступа к компании
    const company = await Company.findById(req.body.companyId);
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Компания не найдена' 
      });
    }
    
    if (company.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Нет прав для добавления товаров в эту компанию' 
      });
    }
    
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## Создание кастомных схем валидации

Если нужна дополнительная валидация, добавьте новую схему в `middleware/validation.js`:

```javascript
// Пример: валидация для религиозных организаций
const religiousOrgSchema = Joi.object({
  name: Joi.string()
    .max(200)
    .required(),
  
  type: Joi.string()
    .valid('church', 'mosque', 'synagogue', 'temple', 'other')
    .required(),
  
  address: Joi.string()
    .max(500)
    .required(),
  
  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .optional(),
  
  email: Joi.string()
    .email()
    .optional(),
  
  schedule: Joi.array()
    .items(Joi.object({
      day: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      openTime: Joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
      closeTime: Joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    }))
    .optional()
});

module.exports = {
  // ...existing exports
  religiousOrgSchema
};
```

## Тестирование валидации

```bash
# Тест регистрации с невалидными данными
curl -X POST http://localhost:10000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ab",
    "email": "invalid-email",
    "password": "123"
  }'

# Ожидаемый ответ:
{
  "success": false,
  "message": "Ошибка валидации данных",
  "errors": [
    {
      "field": "username",
      "message": "Имя пользователя должно быть не менее 3 символов"
    },
    {
      "field": "email",
      "message": "Некорректный email адрес"
    },
    {
      "field": "password",
      "message": "Пароль должен быть не менее 6 символов"
    }
  ]
}
```

## Важные заметки

1. **Всегда используйте валидацию** для endpoints, которые принимают пользовательские данные
2. **Не доверяйте клиенту** - валидация на фронтенде не защищает от атак
3. **Валидация != авторизация** - после валидации проверьте права пользователя
4. **Проверяйте связанные сущности** - существование компании, товара и т.д.
5. **Логируйте попытки с невалидными данными** - это может быть признаком атаки

## Обработка ошибок

Все схемы валидации возвращают единый формат ошибок:

```javascript
{
  "success": false,
  "message": "Ошибка валидации данных",
  "errors": [
    {
      "field": "имя_поля",
      "message": "описание ошибки"
    }
  ]
}
```

На фронтенде можно обрабатывать так:

```javascript
try {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  
  const data = await response.json();
  
  if (!data.success) {
    if (data.errors) {
      // Отобразить ошибки для каждого поля
      data.errors.forEach(err => {
        console.error(`${err.field}: ${err.message}`);
      });
    } else {
      console.error(data.message);
    }
  }
} catch (error) {
  console.error('Network error:', error);
}
```
