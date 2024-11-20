const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback.model');
const auth = require('../middleware/auth');

// Submit feedback
router.post('/', auth, async (req, res) => {
  try {
    const feedback = new Feedback({
      ...req.body,
      user: req.user.id
    });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event feedback
router.get('/event/:eventId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'name');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;