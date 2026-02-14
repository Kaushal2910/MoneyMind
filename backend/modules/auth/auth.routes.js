const express = require('express');
const controller = require('./auth.controller');
const { validateRegister, validateLogin } = require('./auth.validation');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', validateRegister, controller.register);
router.post('/login', validateLogin, controller.login);
router.get('/me', authMiddleware, controller.me);

module.exports = router;
