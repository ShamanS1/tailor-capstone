// models/notification.model.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tailor' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  message: { type: String, required: true },
  status: { type: String, enum: ['UNREAD', 'READ'], default: 'UNREAD' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
