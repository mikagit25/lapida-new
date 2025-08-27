const express = require('express');
const router = express.Router();

// DEMO: in-memory donations
let donations = [
  { date: '2024-05-01', amount: 500, status: 'success' },
  { date: '2024-06-10', amount: 1000, status: 'success' }
];

router.post('/donate', (req, res) => {
  const { amount } = req.body;
  donations.push({ date: new Date().toISOString().slice(0,10), amount, status: 'success' });
  res.json({ success: true });
});

router.get('/donations', (req, res) => {
  res.json({ donations });
});

// TODO: интеграция с реальными платежными системами

module.exports = router;
