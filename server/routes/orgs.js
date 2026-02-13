const express = require('express');
const router = express.Router();
const ReligiousOrganization = require('../models/ReligiousOrganization');
const ReligiousService = require('../models/ReligiousService');
const { auth } = require('../middleware/auth');
const { validate, validateQuery, organizationSchema, organizationQuerySchema } = require('../middleware/validation');

// Простой транслит/slugify для кириллицы и пробелов
const slugify = (value = '') => {
  const ru = ['а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я'];
  const en = ['a','b','v','g','d','e','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','sch','','y','','e','yu','ya'];
  const transliterated = value
    .toString()
    .trim()
    .split('')
    .map(ch => {
      const lower = ch.toLowerCase();
      const idx = ru.indexOf(lower);
      if (idx >= 0) return en[idx];
      if (/^[a-z0-9]$/i.test(ch)) return lower;
      if (/\s|_|-/u.test(ch)) return '-';
      return '';
    })
    .join('')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return transliterated || 'org';
};

const ensureUniqueSlug = async (base, excludeId) => {
  let slug = base || 'org';
  let counter = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await ReligiousOrganization.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    if (!exists) return slug;
    slug = `${base || 'org'}-${counter}`;
    counter += 1;
  }
};

// Список организаций с фильтрами и пагинацией
router.get('/', validateQuery(organizationQuerySchema), async (req, res) => {
  try {
    const { city, confession, service, emergency, q, sort = 'rating', page = 1, limit = 20 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = { isPublic: true };
    if (confession) filter.confession = confession;
    if (city) filter['contacts.address.city'] = { $regex: city, $options: 'i' };
    if (emergency !== undefined) filter.hasEmergency = emergency === true || emergency === 'true';
    if (q) filter.$text = { $search: q };

    // Фильтр по услуге: ищем orgIds, где есть услуга по названию/категории
    if (service) {
      const serviceRegex = new RegExp(service, 'i');
      const serviceOrgs = await ReligiousService.find({
        $or: [{ name: serviceRegex }, { category: serviceRegex }, { tags: serviceRegex }],
        available: true
      }).distinct('organization');
      filter._id = { $in: serviceOrgs };
    }

    const sortMap = {
      rating: { 'rating.avg': -1, 'rating.count': -1, createdAt: -1 },
      response: { responseTimeMinutes: 1, createdAt: -1 },
      new: { createdAt: -1 }
    };
    let sortOption = sortMap[sort] || sortMap.rating;
    const projection = {};
    if (q) {
      projection.score = { $meta: 'textScore' };
      sortOption = { score: { $meta: 'textScore' }, ...sortOption };
    }

    const [total, items] = await Promise.all([
      ReligiousOrganization.countDocuments(filter),
      ReligiousOrganization.find(filter, projection)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    res.json({
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        hasMore: skip + items.length < total
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения организаций', details: err.message });
  }
});

// Получить организацию по slug
router.get('/:slug', async (req, res) => {
  try {
    const org = await ReligiousOrganization.findOne({ slug: req.params.slug, isPublic: true }).lean();
    if (!org) return res.status(404).json({ error: 'Организация не найдена' });
    const stats = await ReligiousService.aggregate([
      { $match: { organization: org._id } },
      { $group: {
        _id: '$organization',
        minPrice: { $min: '$priceMin' },
        maxPrice: { $max: '$priceMax' },
        servicesCount: { $sum: 1 },
        hasEmergencyService: { $max: { $cond: ['$isEmergency', 1, 0] } }
      } }
    ]);
    const serviceStats = stats[0] ? {
      minPrice: stats[0].minPrice,
      maxPrice: stats[0].maxPrice,
      servicesCount: stats[0].servicesCount,
      hasEmergencyService: !!stats[0].hasEmergencyService
    } : { minPrice: null, maxPrice: null, servicesCount: 0, hasEmergencyService: false };

    res.json({ organization: org, serviceStats });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения организации', details: err.message });
  }
});

// Создать организацию
router.post('/', auth, validate(organizationSchema), async (req, res) => {
  try {
    const payload = { ...req.body, owner: req.user._id };
    const baseSlug = slugify(req.body.slug || req.body.name);
    payload.slug = await ensureUniqueSlug(baseSlug);
    const org = await ReligiousOrganization.create(payload);
    res.status(201).json({ organization: org });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания организации', details: err.message });
  }
});

// Обновить организацию
router.put('/:id', auth, validate(organizationSchema), async (req, res) => {
  try {
    const org = await ReligiousOrganization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Организация не найдена' });
    const isOwner = String(org.owner) === String(req.user._id) || (org.admins || []).some(a => String(a) === String(req.user._id));
    if (!isOwner) return res.status(403).json({ error: 'Нет прав на редактирование' });

    const updates = { ...req.body };
    const incomingSlug = req.body.slug || req.body.name;
    if (incomingSlug) {
      const baseSlug = slugify(incomingSlug || org.slug);
      updates.slug = await ensureUniqueSlug(baseSlug, org._id);
    }

    Object.assign(org, updates);
    org.updatedAt = new Date();
    await org.save();
    res.json({ organization: org });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка обновления организации', details: err.message });
  }
});

// Удалить организацию
router.delete('/:id', auth, async (req, res) => {
  try {
    const org = await ReligiousOrganization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Организация не найдена' });
    const isOwner = String(org.owner) === String(req.user._id);
    if (!isOwner) return res.status(403).json({ error: 'Нет прав на удаление' });
    await org.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка удаления организации', details: err.message });
  }
});

module.exports = router;
