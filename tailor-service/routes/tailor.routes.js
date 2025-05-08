// routes/tailor.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/tailor.controller');
const {verifyToken} = require('../middleware/auth.middleware');
const { validateTailor } = require('../middleware/validate.middleware');

router.post('/', validateTailor, controller.createTailor);
router.put('/:id', verifyToken, validateTailor, controller.updateTailor);
router.get('/',verifyToken, controller.getAllTailors);
router.get('/:id',verifyToken, controller.getTailorById);
router.put('/:id',verifyToken, controller.updateTailor);
router.delete('/:id', verifyToken, controller.deleteTailor);

module.exports = router;
