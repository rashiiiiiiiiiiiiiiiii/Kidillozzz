const { Router } = require('express');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');
const ctrl = require('./users.controller');

const router = Router();

// All user-management routes require admin role
router.get('/', auth, authorize('admin'), ctrl.getAll);
router.get('/:id', auth, authorize('admin'), ctrl.getOne);
router.delete('/:id', auth, authorize('admin'), ctrl.remove);

module.exports = router;
