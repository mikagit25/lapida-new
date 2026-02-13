/**
 * Пример оптимизированного роута с использованием всех новых возможностей
 * Этот файл демонстрирует best practices для производительности
 */

const express = require('express');
const router = express.Router();
const Memorial = require('../models/Memorial');
const { cacheMiddleware, invalidateCache, cacheKeys } = require('../middleware/cache');
const { queryHelper, paginatedResponse } = require('../middleware/pagination');
const { validate, memorialSchema } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');
const multer = require('multer');
const { optimizeUploadedImages } = require('../middleware/imageOptimization');

// Настройка multer для загрузки файлов
const upload = multer({ 
  dest: 'upload/memorials',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

/**
 * GET /api/memorials - Список мемориалов
 * 
 * Использует:
 * - Кэширование (5 минут)
 * - Pagination
 * - Сортировку (по дате создания, просмотрам, имени)
 * - Фильтрацию (по публичности)
 * - Поиск (по имени и биографии)
 * 
 * Примеры запросов:
 * GET /api/memorials?page=1&limit=20
 * GET /api/memorials?sortBy=views&order=desc
 * GET /api/memorials?search=Иван
 * GET /api/memorials?isPublic=true&page=1&limit=10&sortBy=createdAt&order=desc
 */
router.get('/',
  // Кэширование на 5 минут с динамическим ключом на основе query параметров
  cacheMiddleware(300, (req) => {
    const queryString = JSON.stringify(req.query);
    return `cache:memorials:list:${queryString}`;
  }),
  // Подключаем все query helpers
  queryHelper({
    defaultLimit: 20,
    maxLimit: 100,
    allowedSortFields: ['createdAt', 'views', 'firstName', 'lastName', 'deathDate'],
    defaultSortField: 'createdAt',
    defaultSortOrder: 'desc',
    allowedFilterFields: ['isPublic'],
    searchFields: ['firstName', 'lastName', 'biography']
  }),
  async (req, res) => {
    try {
      const { page, limit, skip } = req.pagination;
      
      // Строим запрос с фильтрами и поиском
      const query = {
        ...req.filters,
        ...req.searchQuery
      };
      
      // Получаем данные с использованием индексов
      const [memorials, total] = await Promise.all([
        Memorial.find(query)
          .select('firstName lastName birthDate deathDate profileImage shareUrl views createdAt') // Выбираем только нужные поля
          .sort(req.sorting)
          .skip(skip)
          .limit(limit)
          .lean(), // lean() для лучшей производительности
        Memorial.countDocuments(query)
      ]);
      
      res.json(paginatedResponse(memorials, total, req.pagination));
      
    } catch (error) {
      console.error('Error fetching memorials:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка при получении мемориалов',
        error: error.message 
      });
    }
  }
);

/**
 * GET /api/memorials/:id - Получить мемориал по ID
 * 
 * Использует:
 * - Кэширование (10 минут)
 * - Индексы MongoDB
 * - Счетчик просмотров в Redis
 */
router.get('/:id',
  cacheMiddleware(600, (req) => cacheKeys.memorial(req.params.id)),
  async (req, res) => {
    try {
      const memorial = await Memorial.findById(req.params.id)
        .populate('createdBy', 'username email fullName')
        .lean();
      
      if (!memorial) {
        return res.status(404).json({ 
          success: false, 
          message: 'Мемориал не найден' 
        });
      }
      
      // Увеличиваем счетчик просмотров в Redis
      const { cacheUtils } = require('../middleware/cache');
      const views = await cacheUtils.incr(`memorial:${req.params.id}:views`, 86400);
      
      // Периодически синхронизируем с MongoDB (каждые 10 просмотров)
      if (views % 10 === 0) {
        Memorial.findByIdAndUpdate(req.params.id, { 
          $inc: { views: 10 } 
        }).exec(); // Не ждем результата
      }
      
      res.json({ 
        success: true, 
        memorial: {
          ...memorial,
          views: memorial.views + views
        }
      });
      
    } catch (error) {
      console.error('Error fetching memorial:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка при получении мемориала',
        error: error.message 
      });
    }
  }
);

/**
 * POST /api/memorials - Создать новый мемориал
 * 
 * Использует:
 * - Валидацию данных
 * - Аутентификацию
 * - Инвалидацию кэша
 */
router.post('/',
  authMiddleware,
  validate(memorialSchema),
  invalidateCache(() => [
    cacheKeys.memorialsList(),
    'cache:memorials:list:*'
  ]),
  async (req, res) => {
    try {
      const memorial = await Memorial.create({
        ...req.body,
        createdBy: req.user.id
      });
      
      res.status(201).json({ 
        success: true, 
        memorial 
      });
      
    } catch (error) {
      console.error('Error creating memorial:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка при создании мемориала',
        error: error.message 
      });
    }
  }
);

/**
 * PUT /api/memorials/:id - Обновить мемориал
 * 
 * Использует:
 * - Валидацию данных
 * - Аутентификацию и проверку прав
 * - Инвалидацию кэша
 */
router.put('/:id',
  authMiddleware,
  validate(memorialSchema),
  invalidateCache((req) => [
    cacheKeys.memorial(req.params.id),
    cacheKeys.memorialsList(),
    'cache:memorials:list:*'
  ]),
  async (req, res) => {
    try {
      const memorial = await Memorial.findById(req.params.id);
      
      if (!memorial) {
        return res.status(404).json({ 
          success: false, 
          message: 'Мемориал не найден' 
        });
      }
      
      // Проверка прав доступа
      if (memorial.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Нет прав для редактирования этого мемориала' 
        });
      }
      
      Object.assign(memorial, req.body);
      await memorial.save();
      
      res.json({ 
        success: true, 
        memorial 
      });
      
    } catch (error) {
      console.error('Error updating memorial:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка при обновлении мемориала',
        error: error.message 
      });
    }
  }
);

/**
 * POST /api/memorials/:id/photo - Загрузить фото в галерею
 * 
 * Использует:
 * - Multer для загрузки файлов
 * - Автоматическую оптимизацию изображений (Sharp)
 * - Создание нескольких размеров и форматов
 * - Инвалидацию кэша
 */
router.post('/:id/photo',
  authMiddleware,
  upload.single('photo'),
  optimizeUploadedImages({
    sizes: ['thumbnail', 'medium', 'large'],
    formats: ['jpeg', 'webp'],
    keepOriginal: true
  }),
  invalidateCache((req) => [
    cacheKeys.memorial(req.params.id),
    'cache:memorials:list:*'
  ]),
  async (req, res) => {
    try {
      const memorial = await Memorial.findById(req.params.id);
      
      if (!memorial) {
        return res.status(404).json({ 
          success: false, 
          message: 'Мемориал не найден' 
        });
      }
      
      // Проверка прав доступа
      if (memorial.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Нет прав для добавления фото' 
        });
      }
      
      // Добавляем фото в галерею
      memorial.galleryImages.push({
        url: req.file.path,
        caption: req.body.caption || '',
        optimized: req.file.optimized, // Информация об оптимизированных версиях
        uploadedAt: new Date()
      });
      
      await memorial.save();
      
      res.json({ 
        success: true, 
        photo: memorial.galleryImages[memorial.galleryImages.length - 1]
      });
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка при загрузке фото',
        error: error.message 
      });
    }
  }
);

/**
 * GET /api/memorials/popular/top - Топ популярных мемориалов
 * 
 * Использует:
 * - Агрегированный запрос с индексами
 * - Кэширование на 1 час (данные меняются редко)
 */
router.get('/popular/top',
  cacheMiddleware(3600, () => 'cache:memorials:popular:top'),
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const popularMemorials = await Memorial.find({ isPublic: true })
        .select('firstName lastName profileImage views shareUrl')
        .sort({ views: -1 })
        .limit(limit)
        .lean();
      
      res.json({ 
        success: true, 
        data: popularMemorials 
      });
      
    } catch (error) {
      console.error('Error fetching popular memorials:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка при получении популярных мемориалов',
        error: error.message 
      });
    }
  }
);

/**
 * DELETE /api/memorials/:id - Удалить мемориал
 * 
 * Использует:
 * - Аутентификацию и проверку прав
 * - Инвалидацию всех связанных кэшей
 */
router.delete('/:id',
  authMiddleware,
  invalidateCache((req) => [
    cacheKeys.memorial(req.params.id),
    cacheKeys.memorialsList(),
    'cache:memorials:*'
  ]),
  async (req, res) => {
    try {
      const memorial = await Memorial.findById(req.params.id);
      
      if (!memorial) {
        return res.status(404).json({ 
          success: false, 
          message: 'Мемориал не найден' 
        });
      }
      
      // Проверка прав доступа
      if (memorial.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Нет прав для удаления этого мемориала' 
        });
      }
      
      await memorial.deleteOne();
      
      res.json({ 
        success: true, 
        message: 'Мемориал успешно удален' 
      });
      
    } catch (error) {
      console.error('Error deleting memorial:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Ошибка при удалении мемориала',
        error: error.message 
      });
    }
  }
);

module.exports = router;
