const express = require('express');
const router = express.Router();

// DEMO: статистика
router.get('/stats', (req, res) => {
  // TODO: Replace with real DB queries
  res.json({ users: 10, companies: 3, memorials: 15, complaints: 2 });
});

module.exports = router;
