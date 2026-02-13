// CRUD роуты для религиозных организаций

const express = require('express');
const router = express.Router();
const ReligiousOrganization = require('../models/ReligiousOrganization');
const { auth } = require('../middleware/auth');

// Простой транслит/slugify для кириллицы
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

// Получить список организаций (фильтры: тип, конфессия, регион и др.)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.confession) filter.confession = req.query.confession;
    if (req.query.region) filter['contacts.address'] = { $regex: req.query.region, $options: 'i' };
    const orgs = await ReligiousOrganization.find(filter).sort({ createdAt: -1 });
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения списка организаций' });
  }
});

// Получить одну организацию по id
router.get('/:id', async (req, res) => {
  try {
    const org = await ReligiousOrganization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Организация не найдена' });
    res.json(org);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения организации' });
  }
});

// Создать организацию (только авторизованный пользователь)
router.post('/', auth, async (req, res) => {
  try {
    const payload = { ...req.body, owner: req.user._id };
    // Нормализуем контакты: превращаем одиночные поля в ожидаемую схему
    const contacts = payload.contacts || {};
    payload.contacts = {
      phones: Array.isArray(contacts.phones)
        ? contacts.phones
        : contacts.phone
          ? [{ label: 'Основной', value: contacts.phone }]
          : [],
      email: contacts.email || undefined,
      website: contacts.website || undefined,
      messengers: contacts.messengers || undefined,
      address: contacts.address
        ? typeof contacts.address === 'string'
          ? { street: contacts.address }
          : contacts.address
        : undefined,
    };
    const baseSlug = slugify(req.body.slug || req.body.name);
    payload.slug = await ensureUniqueSlug(baseSlug);
    const org = await ReligiousOrganization.create(payload);
    res.status(201).json(org);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка создания организации', details: err.message });
  }
});

// Обновить организацию (только владелец или админ)
router.put('/:id', auth, async (req, res) => {
  try {
    const org = await ReligiousOrganization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Организация не найдена' });
    if (String(org.owner) !== String(req.user._id) && !org.admins.includes(req.user._id)) {
      return res.status(403).json({ error: 'Нет прав на редактирование' });
    }
    const updates = { ...req.body };
    if (updates.contacts) {
      const contacts = updates.contacts;
      updates.contacts = {
        phones: Array.isArray(contacts.phones)
          ? contacts.phones
          : contacts.phone
            ? [{ label: 'Основной', value: contacts.phone }]
            : [],
        email: contacts.email || undefined,
        website: contacts.website || undefined,
        messengers: contacts.messengers || undefined,
        address: contacts.address
          ? typeof contacts.address === 'string'
            ? { street: contacts.address }
            : contacts.address
          : undefined,
      };
    }
    const incomingSlug = req.body.slug || req.body.name;
    if (incomingSlug) {
      const baseSlug = slugify(incomingSlug || org.slug);
      updates.slug = await ensureUniqueSlug(baseSlug, org._id);
    }

    Object.assign(org, updates);
    org.updatedAt = new Date();
    await org.save();
    res.json(org);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка обновления организации', details: err.message });
  }
});

// Удалить организацию (только владелец)
router.delete('/:id', auth, async (req, res) => {
  try {
    const org = await ReligiousOrganization.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Организация не найдена' });
    if (String(org.owner) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Нет прав на удаление' });
    }
    await org.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка удаления организации', details: err.message });
  }
});

module.exports = router;
