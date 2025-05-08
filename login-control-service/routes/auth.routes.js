// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/saveLoginDetails', authController.saveLoginDetails);
router.post('/authenticate', authController.authenticateAndGetToken);

module.exports = router;
