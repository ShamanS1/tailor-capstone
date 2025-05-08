// models/measurement.model.js
const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Login' },
  tailorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Login' },
  gender: { type: String, enum: ['MALE', 'FEMALE'], required: true },
  category: { type: String, required: true },
  design: { type: String, required: true },
  measurements: { type: String, required: true }, // JSON string or plain string
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Measurement', measurementSchema);
