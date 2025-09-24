const express = require('express');
const router = express.Router();
const ReligiousDocument = require('../models/ReligiousDocument');

// Get all documents (optionally by organization)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.organization ? { organization: req.query.organization } : {};
    const docs = await ReligiousDocument.find(filter).sort({ publishedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await ReligiousDocument.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create document
router.post('/', async (req, res) => {
  try {
    const doc = new ReligiousDocument(req.body);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update document
router.put('/:id', async (req, res) => {
  try {
    const doc = await ReligiousDocument.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const doc = await ReligiousDocument.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
