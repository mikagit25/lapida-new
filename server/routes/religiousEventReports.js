const express = require('express');
const router = express.Router();
const ReligiousEventReport = require('../models/ReligiousEventReport');

// Get all reports (optionally by event)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.event ? { event: req.query.event } : {};
    const reports = await ReligiousEventReport.find(filter).sort({ createdAt: -1 }).populate('event');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await ReligiousEventReport.findById(req.params.id).populate('event');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create report
router.post('/', async (req, res) => {
  try {
    const report = new ReligiousEventReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update report
router.put('/:id', async (req, res) => {
  try {
    const report = await ReligiousEventReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    const report = await ReligiousEventReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
