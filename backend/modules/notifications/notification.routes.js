const express = require('express');
const controller = require('./notification.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', controller.getNotifications);
router.patch('/:id/read', controller.markAsRead);
router.patch('/read-all', controller.markAllAsRead);
router.delete('/:id', controller.deleteNotification);

module.exports = router;
