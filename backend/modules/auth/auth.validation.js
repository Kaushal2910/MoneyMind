const validator = require('validator');

const validateRegister = (req, res, next) => {
  const { email, password, fullName, mode } = req.body || {};


  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email' });
  }

  if (!password || !validator.isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password not strong enough',
    });
  }

  if (!fullName || fullName.length < 2) {
    return res.status(400).json({ success: false, message: 'Invalid name' });
  }

  if (!['student', 'salaried', 'couple'].includes(mode)) {
    return res.status(400).json({ success: false, message: 'Invalid mode' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};


  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email' });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password required' });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
