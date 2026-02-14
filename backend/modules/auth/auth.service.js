const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const repository = require('./auth.repository');

const registerUser = async (data) => {
  const existingUser = await repository.findUserByEmail(data.email);
  if (existingUser) {
    const error = new Error('Email already registered');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const newUser = await repository.createUser({
    email: data.email,
    passwordHash,
    fullName: data.fullName,
    mode: data.mode,
  });

  await repository.createUserProfile({
    userId: newUser.id,
    monthlyIncome: data.monthlyIncome || null,
    savingsGoal: data.savingsGoal || null,
    riskAppetite: data.riskAppetite || null,
  });

  return newUser;
};

const loginUser = async ({ email, password }) => {
  const user = await repository.findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, mode: user.mode },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
