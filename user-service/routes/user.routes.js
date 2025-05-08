const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user.controller');
const { validateUser } = require('../middleware/validate.middleware');

router.post('/', validateUser, ctrl.register);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
