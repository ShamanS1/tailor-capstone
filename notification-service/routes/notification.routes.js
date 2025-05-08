// routes/notification.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');
const { validateNotification } = require('../middleware/validate.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, validateNotification, controller.createNotification);
router.get('/user/:userId', verifyToken, controller.getUserNotifications);
router.get('/user/:userId/unread', verifyToken, controller.getUnreadNotifications);
router.put('/:id/read', verifyToken, controller.markAsRead);
router.delete('/:id', verifyToken, controller.deleteNotification);

module.exports = router;
