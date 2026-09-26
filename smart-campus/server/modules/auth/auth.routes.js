const { Router } = require('express');
const auth = require('../../middleware/auth');
const ctrl = require('./auth.controller');

const router = Router();

// Public routes
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);

// Protected routes
router.post('/logout', auth, ctrl.logout);
router.get('/me', auth, ctrl.me);

module.exports = router;
