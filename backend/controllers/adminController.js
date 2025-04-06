
const User = require('../models/User');
const Module = require('../models/Module');

exports.approveUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const success = await User.approveUser(userId);
    if (success) {
      res.json({ message: 'User approved successfully' });
    } else {
      res.status(404).json({ message: 'User not found or already approved' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve user', error: err.message });
  }
};

exports.unapproveUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const success = await User.unapproveUser(userId);
    if (success) {
      res.json({ message: 'User unapproved successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to unapprove user', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const success = await User.deleteUser(userId);
    if (success) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  try {
    const success = await User.updateUserRole(userId, role);
    if (success) {
      res.json({ message: 'User role updated successfully', role });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user role', error: err.message });
  }
};

exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.getPendingUsers();
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending users', error: err.message });
  }
};

// For simplicity, using db directly to get all users. Alternatively, add a helper in the User model.
const db = require('../db/database');
exports.getAllUsers = async (req, res) => {
  db.all(`SELECT * FROM users`, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to get users', error: err.message });
    res.json(rows);
  });
};

exports.createModule = async (req, res) => {
  const { title, description } = req.body;
  const createdBy = req.user.id;
  try {
    const newModule = await Module.createModule(title, description, createdBy);
    res.status(201).json({ message: 'Module created successfully', module: newModule });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create module', error: err.message });
  }
};

exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.getAllModules();
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get modules', error: err.message });
  }
};


// Get module enrollment summary.
exports.getModuleEnrollments = async (req, res) => {
  const db = require('../db/database');
  db.all(
    `SELECT m.id, m.title, m.description, COUNT(b.id) AS bookingCount, 
       GROUP_CONCAT(u.name, ', ') AS bookedBy
     FROM modules m
     LEFT JOIN bookings b ON m.id = b.moduleId
     LEFT JOIN users u ON b.userId = u.id
     GROUP BY m.id`,
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch module enrollments', error: err.message });
      res.json(rows);
    }
  );
};
