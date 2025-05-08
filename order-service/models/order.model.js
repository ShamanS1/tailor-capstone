// models/order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tailor' },
  fabricType: String,
  deliveryDate: Date,
  status: { type: String, default: 'Pending' },
  totalPrice: Number,
  measurementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
