// controllers/measurement.controller.js
const Measurement = require('../models/measurement.model');

// Save measurement (entity)
exports.saveMeasurement = async (req, res, next) => {
  try {
    const measurement = new Measurement(req.body);
    await measurement.save();
    res.status(201).json(measurement);
  } catch (err) {
    next(err);
  }
};

// Save measurement (DTO)
exports.saveMeasurementFromDto = async (req, res, next) => {
  try {
    const dto = req.body;
    // Convert DTO to entity
    const measurement = new Measurement({
      userId: dto.userId,
      tailorId: dto.tailorId,
      gender: dto.gender,
      category: dto.category,
      design: dto.design,
      measurements: dto.measurements,
      price: dto.price
    });
    await measurement.save();
    res.status(201).json(measurement);
  } catch (err) {
    next(err);
  }
};

// Get measurement by ID
exports.getMeasurementById = async (req, res, next) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) return res.status(404).json({ message: 'Measurement not found' });
    res.json(measurement);
  } catch (err) {
    next(err);
  }
};

// Get measurement by user ID (returns all for user)
exports.getMeasurementByUserId = async (req, res, next) => {
  try {
    const data = await Measurement.find({ userId: req.params.id });
    res.json({ measurements: data });
  } catch (err) {
    next(err);
  }
};

// Delete measurement
exports.deleteMeasurement = async (req, res, next) => {
  try {
    await Measurement.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
