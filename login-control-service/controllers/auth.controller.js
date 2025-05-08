// controllers/auth.controller.js
const Login = require('../models/login.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Save login details (register)
exports.saveLoginDetails = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Login({ email, password: hashedPassword, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
};

// Authenticate and get token
exports.authenticateAndGetToken = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Login.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid user request!' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid user request!' });

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Authentication failed', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await Login.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};
