const pool = require('../../config/db');

const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

const createUser = async ({ email, passwordHash, fullName, mode }) => {
  const query = `
    INSERT INTO users (email, password_hash, full_name, mode)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, full_name, mode, created_at
  `;
  const { rows } = await pool.query(query, [
    email,
    passwordHash,
    fullName,
    mode,
  ]);
  return rows[0];
};

const createUserProfile = async ({ userId, monthlyIncome, savingsGoal, riskAppetite }) => {
  const query = `
    INSERT INTO user_profiles (user_id, monthly_income, savings_goal, risk_appetite)
    VALUES ($1, $2, $3, $4)
  `;
  await pool.query(query, [userId, monthlyIncome, savingsGoal, riskAppetite]);
};

module.exports = {
  findUserByEmail,
  createUser,
  createUserProfile,
};
