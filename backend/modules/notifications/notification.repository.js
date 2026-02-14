const pool = require('../../config/db');

exports.findAll = async (userId, options) => {
  const { unread, page, limit } = options;

  const offset = (page - 1) * limit;

  let filters = [`user_id = $1`];
  let values = [userId];
  let index = 2;

  if (unread) {
    filters.push(`is_read = false`);
  }

  const whereClause = filters.join(' AND ');

  const dataQuery = `
    SELECT id, title, message, type, is_read, created_at
    FROM notifications
    WHERE ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${index++}
    OFFSET $${index}
  `;

  const dataResult = await pool.query(
    dataQuery,
    [...values, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM notifications WHERE ${whereClause}`,
    values
  );

  const total = Number(countResult.rows[0].count);

  return {
    data: dataResult.rows,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  };
};

exports.findById = async (userId, id) => {
  const result = await pool.query(
    `SELECT id, is_read
     FROM notifications
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  return result.rows[0];
};

exports.markAsRead = async (userId, id) => {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE id = $1 AND user_id = $2
     RETURNING id, is_read`,
    [id, userId]
  );

  return result.rows[0];
};

exports.markAllAsRead = async (userId) => {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE user_id = $1 AND is_read = false`,
    [userId]
  );

  return result.rowCount;
};

exports.delete = async (userId, id) => {
  await pool.query(
    `DELETE FROM notifications
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
};
