const express = require('express');
const router = express.Router();

// DEMO: in-memory search
const demoData = [
  { type: 'memorial', title: 'Иван Иванов', status: 'active', date: '2024-01-01' },
  { type: 'user', name: 'Петр Петров', status: 'active', date: '2024-02-01' },
  { type: 'company', name: 'ООО "Память"', status: 'archived', date: '2023-12-01' }
];

router.get('/', (req, res) => {
  const { query = '', type = '', date = '', status = '' } = req.query;
  let results = demoData.filter(item => {
    let match = true;
    if (type && item.type !== type) match = false;
    if (date && item.date !== date) match = false;
    if (status && item.status !== status) match = false;
    if (query && !(item.name?.toLowerCase().includes(query.toLowerCase()) || item.title?.toLowerCase().includes(query.toLowerCase()))) match = false;
    return match;
  });
  res.json({ results });
});

module.exports = router;
