
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

exports.register = async (req, res) => {
  const { name, email, password, role, membershipType, interests } = req.body;
  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // If registering as admin, check maximum admin count.
    if (role === 'admin') {
      const adminCount = await User.getAdminCount();
      if (adminCount >= 3) {
        return res.status(400).json({ message: 'Maximum number of admins has been reached. Cannot register as admin.' });
      }
    }
    const newUser = await User.createUser(
      name,
      email,
      password,
      role,
      role === 'member' ? membershipType : null,
      role === 'member' ? interests : {}
    );
    res.status(201).json({
      message: 'User registered successfully. Awaiting admin approval (if member).',
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    // For members, check approval; admins auto-approved.
    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json({ message: 'Account not approved by admin yet' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
