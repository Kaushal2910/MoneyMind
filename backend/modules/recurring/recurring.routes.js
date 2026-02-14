const express = require('express');
const controller = require('./recurring.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', controller.createRecurring);
router.get('/', controller.getAllRecurring);
router.get('/:id', controller.getRecurringById);
router.put('/:id', controller.updateRecurring);
router.delete('/:id', controller.deleteRecurring);
router.patch('/:id/toggle', controller.toggleRecurring);

module.exports = router;
