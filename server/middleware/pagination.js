/**
 * Middleware для пагинации запросов
 * Добавляет параметры page, limit, skip в req.pagination
 * Использование: router.get('/items', paginate(), async (req, res) => { ... })
 */
const paginate = (defaultLimit = 20, maxLimit = 100) => {
  return (req, res, next) => {
    // Получаем параметры из query
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || defaultLimit;
    
    // Валидация
    if (page < 1) page = 1;
    if (limit < 1) limit = defaultLimit;
    if (limit > maxLimit) limit = maxLimit;
    
    const skip = (page - 1) * limit;
    
    // Добавляем в req для использования в контроллерах
    req.pagination = {
      page,
      limit,
      skip
    };
    
    next();
  };
};

/**
 * Утилита для создания ответа с пагинацией
 * @param {Array} data - массив данных
 * @param {number} total - общее количество элементов
 * @param {object} pagination - объект пагинации из req.pagination
 * @param {object} additionalData - дополнительные данные для ответа
 * @returns {object} - форматированный ответ
 */
const paginatedResponse = (data, total, pagination, additionalData = {}) => {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    },
    ...additionalData
  };
};

/**
 * Middleware для сортировки
 * Использование: router.get('/items', sorting(['name', 'createdAt', 'price']), ...)
 * @param {Array} allowedFields - разрешенные поля для сортировки
 * @param {string} defaultField - поле сортировки по умолчанию
 * @param {string} defaultOrder - порядок сортировки по умолчанию ('asc' или 'desc')
 */
const sorting = (allowedFields = [], defaultField = 'createdAt', defaultOrder = 'desc') => {
  return (req, res, next) => {
    let sortField = req.query.sortBy || defaultField;
    let sortOrder = req.query.order || defaultOrder;
    
    // Проверяем, разрешено ли поле для сортировки
    if (allowedFields.length > 0 && !allowedFields.includes(sortField)) {
      sortField = defaultField;
    }
    
    // Преобразуем в формат MongoDB
    const sortOrderValue = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    
    req.sorting = {
      [sortField]: sortOrderValue
    };
    
    next();
  };
};

/**
 * Middleware для фильтрации
 * Использование: router.get('/items', filtering(['status', 'category']), ...)
 * @param {Array} allowedFields - разрешенные поля для фильтрации
 */
const filtering = (allowedFields = []) => {
  return (req, res, next) => {
    const filters = {};
    
    allowedFields.forEach(field => {
      if (req.query[field] !== undefined && req.query[field] !== '') {
        // Специальная обработка для boolean значений
        if (req.query[field] === 'true') {
          filters[field] = true;
        } else if (req.query[field] === 'false') {
          filters[field] = false;
        } else {
          filters[field] = req.query[field];
        }
      }
    });
    
    // Добавляем поддержку поиска по диапазону (например, priceMin, priceMax)
    if (req.query.priceMin || req.query.priceMax) {
      filters.price = {};
      if (req.query.priceMin) filters.price.$gte = parseFloat(req.query.priceMin);
      if (req.query.priceMax) filters.price.$lte = parseFloat(req.query.priceMax);
    }
    
    if (req.query.dateFrom || req.query.dateTo) {
      filters.createdAt = {};
      if (req.query.dateFrom) filters.createdAt.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) filters.createdAt.$lte = new Date(req.query.dateTo);
    }
    
    req.filters = filters;
    
    next();
  };
};

/**
 * Middleware для текстового поиска
 * Использование: router.get('/items', search(['name', 'description']), ...)
 * @param {Array} fields - поля для поиска
 */
const search = (fields = []) => {
  return (req, res, next) => {
    const searchQuery = req.query.search || req.query.q;
    
    if (searchQuery && fields.length > 0) {
      // Создаем OR запрос для поиска по всем указанным полям
      req.searchQuery = {
        $or: fields.map(field => ({
          [field]: { $regex: searchQuery, $options: 'i' } // i = case insensitive
        }))
      };
    } else if (searchQuery) {
      // Если поля не указаны, используем текстовый поиск MongoDB
      req.searchQuery = {
        $text: { $search: searchQuery }
      };
    } else {
      req.searchQuery = {};
    }
    
    next();
  };
};

/**
 * Комбинированный middleware для полной поддержки запросов списков
 * Включает пагинацию, сортировку, фильтрацию и поиск
 */
const queryHelper = (options = {}) => {
  const {
    defaultLimit = 20,
    maxLimit = 100,
    allowedSortFields = ['createdAt'],
    defaultSortField = 'createdAt',
    defaultSortOrder = 'desc',
    allowedFilterFields = [],
    searchFields = []
  } = options;
  
  return [
    paginate(defaultLimit, maxLimit),
    sorting(allowedSortFields, defaultSortField, defaultSortOrder),
    filtering(allowedFilterFields),
    search(searchFields)
  ];
};

module.exports = {
  paginate,
  paginatedResponse,
  sorting,
  filtering,
  search,
  queryHelper
};
