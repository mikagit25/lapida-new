// CRUD роуты для религиозных организаций

const express = require('express');
const router = express.Router();
const ReligiousOrganization = require('../models/ReligiousOrganization');
const { auth } = require('../middleware/auth');

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
    const data = req.body;
    data.owner = req.user._id;
    const org = await ReligiousOrganization.create(data);
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
    Object.assign(org, req.body);
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
