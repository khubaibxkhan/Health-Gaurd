const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { remindersLimiter } = require('../middleware/rateLimiter');
const Medicine = require('../models/Medicine');

const router = express.Router();

// GET /api/reminders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await Medicine.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// POST /api/reminders
router.post('/', authMiddleware, remindersLimiter, async (req, res) => {
  try {
    const { medicineName, dosage, time, frequency, days, notes } = req.body;

    if (!medicineName || !dosage || !time || !frequency) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!['daily', 'weekly', 'custom'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency' });
    }

    if (frequency === 'custom' && (!days || days.length === 0)) {
      return res.status(400).json({ error: 'Days must be specified for custom frequency' });
    }

    const reminder = new Medicine({
      userId: req.user._id,
      medicineName,
      dosage,
      time,
      frequency,
      days: frequency === 'custom' ? days : [],
      notes: notes || '',
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// PUT /api/reminders/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { medicineName, dosage, time, frequency, days, notes } = req.body;

    const reminder = await Medicine.findById(id);

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    if (reminder.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (medicineName) reminder.medicineName = medicineName;
    if (dosage) reminder.dosage = dosage;
    if (time) reminder.time = time;
    if (frequency) {
      if (!['daily', 'weekly', 'custom'].includes(frequency)) {
        return res.status(400).json({ error: 'Invalid frequency' });
      }
      reminder.frequency = frequency;
    }
    if (days && frequency === 'custom') reminder.days = days;
    if (notes !== undefined) reminder.notes = notes;

    await reminder.save();
    res.json(reminder);
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

// DELETE /api/reminders/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await Medicine.findById(id);

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    if (reminder.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Medicine.deleteOne({ _id: id });
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

module.exports = router;
