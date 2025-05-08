// routes/order.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { validateOrder } = require('../middleware/validate.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', validateOrder, controller.createOrder);
router.get('/user/:userId',verifyToken, controller.getOrdersByUser);
router.put('/:id/status',verifyToken, controller.updateOrderStatus);
router.delete('/:id',verifyToken, controller.deleteOrder);

module.exports = router;
