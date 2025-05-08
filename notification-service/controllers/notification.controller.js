// controllers/notification.controller.js
const Notification = require('../models/notification.model');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification({
      tailorId: req.body.tailorId,
      userId: req.body.userId,
      orderId: req.body.orderId,
      message: req.body.message,
      status: req.body.status || 'UNREAD'
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: 'Creation failed', error: err.message });
  }
};

// Get notifications by userId
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: 'READ' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Notification not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

// Get unread notifications by userId
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId, status: 'UNREAD' });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Deletion failed', error: err.message });
  }
};
