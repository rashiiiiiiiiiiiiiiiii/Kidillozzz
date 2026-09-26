const { Router } = require('express');
const auth = require('../../middleware/auth');
const ctrl = require('./notifications.controller');

const router = Router();

// All notification routes require authentication (any role)
router.get('/', auth, ctrl.getAll);
router.get('/unread-count', auth, ctrl.getUnreadCount);
router.patch('/:id/read', auth, ctrl.markAsRead);
router.patch('/read-all', auth, ctrl.markAllAsRead);

module.exports = router;
