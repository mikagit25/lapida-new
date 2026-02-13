const express = require('express');
const router = express.Router();
const ReligiousService = require('../models/ReligiousService');
const ReligiousOrganization = require('../models/ReligiousOrganization');
const { auth } = require('../middleware/auth');
const { validate, validateQuery, organizationServiceSchema, organizationServiceListSchema } = require('../middleware/validation');

// Получить услуги организации
router.get('/org/:orgId', validateQuery(organizationServiceListSchema), async (req, res) => {
  try {
    const { limit = 50, skip = 0, available, category, emergency, sort, minPrice, maxPrice } = req.query;
    const limitNum = Math.min(Number(limit), 200);
    const skipNum = Number(skip);

    const filter = { organization: req.params.orgId };
    if (available !== undefined) filter.available = available === true || available === 'true';
    if (emergency !== undefined) filter.isEmergency = emergency === true || emergency === 'true';
    if (category) filter.category = new RegExp(category, 'i');
    const priceFilter = {};
    if (minPrice !== undefined) priceFilter.$gte = Number(minPrice);
    if (maxPrice !== undefined) priceFilter.$lte = Number(maxPrice);
    if (Object.keys(priceFilter).length > 0) filter.priceMin = priceFilter;

    const sortMap = {
      created_desc: { createdAt: -1 },
      price_asc: { priceMin: 1, createdAt: -1 },
      price_desc: { priceMin: -1, createdAt: -1 },
      emergency: { isEmergency: -1, createdAt: -1 }
    };
    const sortOption = sortMap[sort] || sortMap.created_desc;

    const [total, services] = await Promise.all([
      ReligiousService.countDocuments(filter),
      ReligiousService.find(filter)
        .sort(sortOption)
        .skip(skipNum)
        .limit(limitNum)
        .lean()
    ]);

    res.json({
      services,
      pagination: {
        total,
        limit: limitNum,
        skip: skipNum,
        hasMore: skipNum + services.length < total
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения услуг', details: err.message });
  }
});

// Получить услугу по id (публично, если организация публична и услуга доступна)
router.get('/:id', async (req, res) => {
  try {
    const service = await ReligiousService.findById(req.params.id).lean();
    if (!service) return res.status(404).json({ error: 'Услуга не найдена' });

    const org = await ReligiousOrganization.findById(service.organization).lean();
    if (!org || !org.isPublic) return res.status(404).json({ error: 'Организация не найдена' });
    if (service.available === false) return res.status(404).json({ error: 'Услуга не активна' });

    res.json({ service, organization: org });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения услуги', details: err.message });
  }
});

// Создать услугу
router.post('/', auth, validate(organizationServiceSchema), async (req, res) => {
  try {
    const org = await ReligiousOrganization.findById(req.body.organization);
    if (!org) return res.status(404).json({ error: 'Организация не найдена' });
    const isOwner = String(org.owner) === String(req.user._id) || (org.admins || []).some(a => String(a) === String(req.user._id));
    if (!isOwner) return res.status(403).json({ error: 'Нет прав на добавление' });

    const service = await ReligiousService.create(req.body);
    res.status(201).json({ service });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания услуги', details: err.message });
  }
});

// Обновить услугу
router.put('/:id', auth, validate(organizationServiceSchema), async (req, res) => {
  try {
    const service = await ReligiousService.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Услуга не найдена' });
    const org = await ReligiousOrganization.findById(service.organization);
    const isOwner = org && (String(org.owner) === String(req.user._id) || (org.admins || []).some(a => String(a) === String(req.user._id)));
    if (!isOwner) return res.status(403).json({ error: 'Нет прав на редактирование' });

    Object.assign(service, req.body);
    service.updatedAt = new Date();
    await service.save();
    res.json({ service });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка обновления услуги', details: err.message });
  }
});

// Удалить услугу
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await ReligiousService.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Услуга не найдена' });
    const org = await ReligiousOrganization.findById(service.organization);
    const isOwner = org && (String(org.owner) === String(req.user._id) || (org.admins || []).some(a => String(a) === String(req.user._id)));
    if (!isOwner) return res.status(403).json({ error: 'Нет прав на удаление' });

    await service.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка удаления услуги', details: err.message });
  }
});

module.exports = router;
