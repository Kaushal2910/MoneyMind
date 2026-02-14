const db = require("../../config/db");

// Normalize month to first day
const normalizeMonth = (month) => {
  return `${month}-01`;
};

// Check category ownership
exports.validateCategoryOwnership = async (userId, categoryId) => {
  const query = `
    SELECT id
    FROM categories
    WHERE id = $1 AND user_id = $2
  `;
  const { rows } = await db.query(query, [categoryId, userId]);
  return rows[0];
};

// Create or update (UPSERT)
exports.upsertBudget = async (userId, categoryId, month, amount) => {
  const normalizedMonth = `${month}-01`;

  const query = `
    INSERT INTO budgets (user_id, category_id, month, budget_amount)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, category_id, month)
    DO UPDATE SET budget_amount = EXCLUDED.budget_amount
    RETURNING id, category_id, month, budget_amount
  `;

  const { rows } = await db.query(query, [
    userId,
    categoryId,
    normalizedMonth,
    amount,
  ]);

  return rows[0];
};



// Get budgets (optional month filter)
exports.getBudgets = async (userId, month) => {
  let query = `
    SELECT b.id, b.category_id, c.name AS category_name,
           b.month, b.budget_amount
    FROM budgets b
    JOIN categories c ON c.id = b.category_id
    WHERE b.user_id = $1
  `;

  const values = [userId];

  if (month) {
    query += ` AND b.month = $2`;
    values.push(`${month}-01`);
  }

  query += ` ORDER BY b.month DESC`;

  const { rows } = await db.query(query, values);
  return rows;
};

// Update budget
exports.updateBudget = async (userId, id, amount) => {
  const query = `
    UPDATE budgets
    SET budget_amount = $1
    WHERE id = $2 AND user_id = $3
    RETURNING id, category_id, month, budget_amount
  `;
  const { rows } = await db.query(query, [amount, id, userId]);
  return rows[0];
};

// Delete budget
exports.deleteBudget = async (userId, id) => {
  const query = `
    DELETE FROM budgets
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;
  const { rowCount } = await db.query(query, [id, userId]);
  return rowCount > 0;
};

// Budget vs Actual
exports.getBudgetStatus = async (userId, month) => {
  const normalizedMonth = `${month}-01`;

  const query = `
    SELECT 
      b.category_id,
      c.name AS category_name,
      c.type AS category_type,
      b.budget_amount,
      COALESCE(SUM(e.amount), 0) AS actual_spent
    FROM budgets b
    JOIN categories c ON c.id = b.category_id
    LEFT JOIN expenses e
      ON e.category_id = b.category_id
      AND e.user_id = b.user_id
      AND DATE_TRUNC('month', e.expense_date) = DATE_TRUNC('month', $2::date)
    WHERE b.user_id = $1
      AND b.month = $2
    GROUP BY b.category_id, c.name, c.type, b.budget_amount
  `;

  const { rows } = await db.query(query, [userId, normalizedMonth]);
  return rows;
};
