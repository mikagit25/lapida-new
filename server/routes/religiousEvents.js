const express = require('express');
const router = express.Router();
const ReligiousEvent = require('../models/ReligiousEvent');

// Get all events (optionally by organization)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.organization ? { organization: req.query.organization } : {};
    const events = await ReligiousEvent.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await ReligiousEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const event = new ReligiousEvent(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await ReligiousEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await ReligiousEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register for event
router.post('/:id/register', async (req, res) => {
  try {
    const event = await ReligiousEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (!event.registrationEnabled) return res.status(400).json({ error: 'Registration is not enabled for this event' });
    if (event.registrationLimit && event.registrationList.length >= event.registrationLimit) {
      return res.status(400).json({ error: 'Registration limit reached' });
    }
    event.registrationList.push({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });
    event.registrationCount = event.registrationList.length;
    await event.save();
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
