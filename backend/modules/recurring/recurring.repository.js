const pool = require('../../config/db');

exports.verifyCategoryOwnership = async (userId, categoryId) => {
  const result = await pool.query(
    `SELECT 1 FROM categories WHERE id = $1 AND user_id = $2`,
    [categoryId, userId]
  );

  if (result.rowCount === 0)
    throw new Error('Invalid category for this user');
};

exports.create = async (userId, data) => {
  const result = await pool.query(
    `INSERT INTO recurring_payments
     (user_id, category_id, name, amount, frequency,
      start_date, end_date, next_due_date, is_active, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true,NOW())
     RETURNING *`,
    [
      userId,
      data.category_id,
      data.name,
      data.amount,
      data.frequency,
      data.start_date,
      data.end_date || null,
      data.next_due_date
    ]
  );

  return result.rows[0];
};

exports.findAll = async (userId, query) => {
  const { is_active, frequency, page = 1, limit = 10 } = query;

  const offset = (page - 1) * limit;
  let filters = [`user_id = $1`];
  let values = [userId];
  let index = 2;

  if (is_active !== undefined) {
    filters.push(`is_active = $${index++}`);
    values.push(is_active === 'true');
  }

  if (frequency) {
    filters.push(`frequency = $${index++}`);
    values.push(frequency);
  }

  const whereClause = filters.join(' AND ');

  const data = await pool.query(
    `SELECT * FROM recurring_payments
     WHERE ${whereClause}
     ORDER BY next_due_date ASC
     LIMIT $${index++} OFFSET $${index}`,
    [...values, limit, offset]
  );

  const count = await pool.query(
    `SELECT COUNT(*) FROM recurring_payments WHERE ${whereClause}`,
    values
  );

  return {
    data: data.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: Number(count.rows[0].count)
    }
  };
};

exports.findById = async (userId, id) => {
  const result = await pool.query(
    `SELECT * FROM recurring_payments
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  return result.rows[0];
};

exports.update = async (userId, id, data) => {
  const fields = Object.keys(data);
  const values = [];
  const updates = [];

  fields.forEach((field, i) => {
    updates.push(`${field} = $${i + 1}`);
    values.push(data[field]);
  });

  values.push(id, userId);

  const result = await pool.query(
    `UPDATE recurring_payments
     SET ${updates.join(', ')}
     WHERE id = $${fields.length + 1}
     AND user_id = $${fields.length + 2}
     RETURNING *`,
    values
  );

  return result.rows[0];
};

exports.remove = async (userId, id) => {
  await pool.query(
    `DELETE FROM recurring_payments
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
};

exports.toggle = async (userId, id) => {
  const result = await pool.query(
    `UPDATE recurring_payments
     SET is_active = NOT is_active
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId]
  );

  return result.rows[0];
};
