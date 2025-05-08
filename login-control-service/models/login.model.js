// models/login.model.js
const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN', 'TAILOR'], default: 'USER' }
}, { timestamps: true });

module.exports = mongoose.model('Login', LoginSchema);
