const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  mobileNumber: String,
  address: String,
  photo: String, // Added photo field to store image URL or path
  role: { type: String, enum: ['USER'], default: 'USER' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
