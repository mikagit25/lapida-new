const express = require('express');
const router = express.Router();
const LeadRequest = require('../models/LeadRequest');
const ReligiousOrganization = require('../models/ReligiousOrganization');
const rateLimit = require('express-rate-limit');
const { auth } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');
const { leadSchema, leadStatusSchema, leadListQuerySchema } = require('../middleware/validation');

// Ограничение на создание лидов (по IP)
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Слишком много заявок, попробуйте позже'
});

// Создать лид (публично)
router.post('/', leadLimiter, validate(leadSchema), async (req, res) => {
  try {
    const org = await ReligiousOrganization.findById(req.body.organization);
    if (!org || !org.isPublic) return res.status(404).json({ error: 'Организация не найдена' });
    const lead = await LeadRequest.create(req.body);
    res.status(201).json({ lead });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания заявки', details: err.message });
  }
});

// Получить лиды организации (для владельца/админа)
router.get('/org/:orgId', auth, validateQuery(leadListQuerySchema), async (req, res) => {
  try {
    const org = await ReligiousOrganization.findById(req.params.orgId);
    if (!org) return res.status(404).json({ error: 'Организация не найдена' });
    const isOwner = String(org.owner) === String(req.user._id) || (org.admins || []).some(a => String(a) === String(req.user._id));
    if (!isOwner) return res.status(403).json({ error: 'Нет прав на просмотр' });

    const { status, channel, from, to, limit = 50, skip = 0, sort } = req.query;
    const filter = { organization: req.params.orgId };
    if (status) filter.status = status;
    if (channel) filter.channel = channel;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const limitNum = Math.min(Number(limit), 200);
    const skipNum = Number(skip);

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      status: { status: 1, createdAt: -1 }
    };
    const sortOption = sortMap[sort] || sortMap.newest;

    const [total, leads] = await Promise.all([
      LeadRequest.countDocuments(filter),
      LeadRequest.find(filter)
        .sort(sortOption)
        .skip(skipNum)
        .limit(limitNum)
        .lean()
    ]);
    res.json({
      leads,
      pagination: {
        total,
        limit: limitNum,
        skip: skipNum,
        hasMore: skipNum + leads.length < total
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения заявок', details: err.message });
  }
});

// Обновить статус лида
router.patch('/:id', auth, validate(leadStatusSchema), async (req, res) => {
  try {
    const lead = await LeadRequest.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Лид не найден' });
    const org = await ReligiousOrganization.findById(lead.organization);
    const isOwner = org && (String(org.owner) === String(req.user._id) || (org.admins || []).some(a => String(a) === String(req.user._id)));
    if (!isOwner) return res.status(403).json({ error: 'Нет прав на обновление' });

    if (req.body.status) lead.status = req.body.status;
    if (req.body.message) lead.message = req.body.message;
    lead.updatedAt = new Date();
    await lead.save();
    res.json({ lead });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка обновления заявки', details: err.message });
  }
});

// Получить лид по id (для владельца/админа)
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await LeadRequest.findById(req.params.id).lean();
    if (!lead) return res.status(404).json({ error: 'Лид не найден' });
    const org = await ReligiousOrganization.findById(lead.organization);
    const isOwner = org && (String(org.owner) === String(req.user._id) || (org.admins || []).some(a => String(a) === String(req.user._id)));
    if (!isOwner) return res.status(403).json({ error: 'Нет прав на просмотр' });
    res.json({ lead });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения заявки', details: err.message });
  }
});

module.exports = router;
