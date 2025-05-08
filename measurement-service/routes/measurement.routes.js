// routes/measurement.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/measurement.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Save measurement (entity)
router.post('/', controller.saveMeasurement);
// Save measurement (DTO)
router.post('/saveMeasurement', controller.saveMeasurementFromDto);
// Get measurement by ID
router.get('/measurementById/:id', controller.getMeasurementById);
// Get measurement by user ID
router.get('/measurementByUserId/:id', controller.getMeasurementByUserId);
// Delete measurement
router.delete('/:id', controller.deleteMeasurement);

module.exports = router;
