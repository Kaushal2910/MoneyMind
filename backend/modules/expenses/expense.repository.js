const db = require("../../config/db");

exports.getCategoryById = async (categoryId, userId) => {
  const query = `
    SELECT id 
    FROM categories 
    WHERE id = $1 AND user_id = $2
  `;
  const { rows } = await db.query(query, [categoryId, userId]);
  return rows[0];
};

exports.createExpense = async (userId, data) => {
  const { category_id, amount, description, expense_date, payment_method } = data;

  const query = `
    INSERT INTO expenses 
      (user_id, category_id, amount, description, expense_date, payment_method, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;

  const values = [
    userId,
    category_id,
    amount,
    description || null,
    expense_date,
    payment_method || null,
  ];

  console.log("INSERT RUNNING");


  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.getExpenses = async (userId, filters) => {
  let query = `
    SELECT id, category_id, amount, description, expense_date, payment_method, created_at
    FROM expenses
    WHERE user_id = $1
  `;

  const values = [userId];
  let index = 2;

  if (filters.month) {
    query += ` AND DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', $${index}::date)`;
    values.push(`${filters.month}-01`);
    index++;
  }

  if (filters.category_id) {
    query += ` AND category_id = $${index}`;
    values.push(filters.category_id);
    index++;
  }

  query += ` ORDER BY expense_date DESC`;

  const { rows } = await db.query(query, values);
  return rows;
};

exports.getExpenseById = async (userId, id) => {
  const query = `
    SELECT id, category_id, amount, description, expense_date, payment_method, created_at
    FROM expenses
    WHERE id = $1 AND user_id = $2
  `;
  const { rows } = await db.query(query, [id, userId]);
  return rows[0];
};

exports.updateExpense = async (userId, id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    fields.push(`${key} = $${index}`);
    values.push(data[key]);
    index++;
  }

  values.push(id);
  values.push(userId);

  const query = `
    UPDATE expenses
    SET ${fields.join(", ")}
    WHERE id = $${index} AND user_id = $${index + 1}
    RETURNING *
  `;

  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.deleteExpense = async (userId, id) => {
  const query = `
    DELETE FROM expenses
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;
  const { rowCount } = await db.query(query, [id, userId]);
  return rowCount > 0;
};
