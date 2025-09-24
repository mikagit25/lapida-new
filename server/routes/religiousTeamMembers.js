const express = require('express');
const router = express.Router();
const ReligiousTeamMember = require('../models/ReligiousTeamMember');

// Get all team members (optionally by organization)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.organization ? { organization: req.query.organization } : {};
    const members = await ReligiousTeamMember.find(filter).sort({ name: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await ReligiousTeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create member
router.post('/', async (req, res) => {
  try {
    const member = new ReligiousTeamMember(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update member
router.put('/:id', async (req, res) => {
  try {
    const member = await ReligiousTeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const member = await ReligiousTeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    res.json({ message: 'Team member deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
