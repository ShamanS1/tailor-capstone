// controllers/tailor.controller.js
const Tailor = require('../models/tailor.model');

exports.createTailor = async (req, res) => {
  try {
    const tailor = new Tailor(req.body);
    await tailor.save();
    res.status(201).json(tailor);
  } catch (err) {
    res.status(400).json({ message: 'Tailor creation failed', error: err.message });
  }
};

exports.getAllTailors = async (req, res) => {
  try {
    const tailors = await Tailor.find();
    res.json(tailors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve tailors', error: err.message });
  }
};

exports.getTailorById = async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id);
    if (!tailor) return res.status(404).json({ message: 'Tailor not found' });
    res.json(tailor);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching tailor', error: err.message });
  }
};

exports.updateTailor = async (req, res) => {
  try {
    const updated = await Tailor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Tailor not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteTailor = async (req, res) => {
  try {
    await Tailor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tailor deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Deletion failed', error: err.message });
  }
};
