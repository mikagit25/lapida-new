const express = require('express');
const router = express.Router();

// DEMO: email integration
router.post('/email', (req, res) => {
  const { email, message } = req.body;
  // TODO: интеграция с реальным email-сервисом
  res.json({ success: true });
});

// DEMO: sms integration
router.post('/sms', (req, res) => {
  const { phone, message } = req.body;
  // TODO: интеграция с реальным SMS-сервисом
  res.json({ success: true });
});

module.exports = router;
