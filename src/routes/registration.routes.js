const express = require('express');
const router = express.Router();
const Registration = require('../models/registration.model');
const Event = require('../models/event.model');
const auth = require('../middleware/auth');
  // Register for an event
router.post('/', auth, async (req, res) => {
  try {
    const { eventId } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const existingRegistration = await Registration.findOne({
      event: eventId,
      user: req.user.userId
    }); 
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered' });
    }
    const registration = new Registration({
      event: eventId,
      user: req.user.userId
    });
    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Get user's registrations
router.get('/my-registrations', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.userId })
      .populate('event');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Cancel registration
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const registration = await Registration.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { status: 'cancelled' },
      { new: true }
    ); 
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    } 
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;

