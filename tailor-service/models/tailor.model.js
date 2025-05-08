// models/tailor.model.js
const mongoose = require('mongoose');

const tailorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shopName: String,
  location: String,
  phone: String,
  specialization: String,
  rating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Tailor', tailorSchema);
