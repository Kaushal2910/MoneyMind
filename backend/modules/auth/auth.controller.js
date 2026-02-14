const service = require('./auth.service');

const register = async (req, res, next) => {
  try {
    const user = await service.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await service.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        mode: user.mode,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  me,
};
