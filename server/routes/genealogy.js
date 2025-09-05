const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const Genealogy = require('../models/Genealogy');
// Получить первое дерево (или пустой)
router.get('/', async (req, res) => {
  try {
    const tree = await Genealogy.findOne();
    res.json(tree || { members: [] });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка получения дерева' });
  }
});
// Получить дерево по id
router.get('/:id', async (req, res) => {
  try {
    const tree = await Genealogy.findById(req.params.id);
    res.json(tree || { members: [] });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка получения дерева' });
  }
});
// Создать новое дерево
router.post('/', authMiddleware, async (req, res) => {
  try {
    const tree = new Genealogy({ members: req.body.members });
    await tree.save();
    res.json(tree);
  } catch (e) {
    res.status(500).json({ error: 'Ошибка создания дерева' });
  }
});
// Обновить дерево
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const tree = await Genealogy.findByIdAndUpdate(req.params.id, { members: req.body.members }, { new: true });
    res.json(tree);
  } catch (e) {
    res.status(500).json({ error: 'Ошибка обновления дерева' });
  }
});

// DEMO: in-memory family tree
let demoTree = {
  name: 'Иван Иванов',
  relation: 'основатель',
  children: [
    { name: 'Мария Иванова', relation: 'дочь', children: [] },
    { name: 'Петр Иванов', relation: 'сын', children: [
      { name: 'Ольга Петрова', relation: 'внучка', children: [] }
    ] }
  ]
};

router.get('/', (req, res) => {
  res.json({ tree: demoTree });
});

// TODO: POST/PUT/DELETE for editing tree

module.exports = router;
