
const Module = require('../models/Module');
const Booking = require('../models/Booking');
const User = require('../models/User'); 

exports.viewModules = async (req, res) => {
  try {
    const modules = await Module.getAllModules();
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch modules', error: err.message });
  }
};

exports.bookModule = async (req, res) => {
  const userId = req.user.id;
  const { moduleId } = req.body;
  try {
    const booking = await Booking.bookModule(userId, moduleId);
    res.status(201).json({ message: 'Module booked successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};

exports.dashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    const bookings = await Booking.getBookingsByUserId(userId);
    res.json({ message: 'Member dashboard', bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};

// NEW: Get profile details.
exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const profile = await User.getUserById(userId);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile', error: err.message });
  }
};

// Update user profile details.
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, membershipType, interests } = req.body;
  try {
    const success = await User.updateUserProfile(userId, name, membershipType, interests);
    if (success) {
      const updatedProfile = await User.getUserById(userId);
      res.json({ message: 'Profile updated successfully', profile: updatedProfile });
    } else {
      res.status(400).json({ message: 'Profile update failed' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile! Try Again', error: err.message });
  }
};
