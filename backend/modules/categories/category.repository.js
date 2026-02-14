const db = require("../../config/db");

// Create category
exports.createCategory = async (userId, { name, type }) => {
  const query = `
    INSERT INTO categories (user_id, name, type, is_default, created_at)
    VALUES ($1, $2, $3, false, NOW())
    RETURNING id, name, type, is_default, created_at
  `;
  const { rows } = await db.query(query, [userId, name, type]);
  return rows[0];
};

// Check duplicate name (case insensitive)
exports.findByName = async (userId, name) => {
  const query = `
    SELECT id
    FROM categories
    WHERE user_id = $1
      AND LOWER(name) = LOWER($2)
  `;
  const { rows } = await db.query(query, [userId, name]);
  return rows[0];
};

// Get all categories (default + user)
exports.getAll = async (userId) => {
  const query = `
    SELECT id, name, type, is_default, created_at
    FROM categories
    WHERE user_id = $1 OR is_default = true
    ORDER BY type, name
  `;
  const { rows } = await db.query(query, [userId]);
  return rows;
};

// Get single category (ownership check)
exports.getById = async (userId, id) => {
  const query = `
    SELECT id, name, type, is_default
    FROM categories
    WHERE id = $1 AND (user_id = $2 OR is_default = true)
  `;
  const { rows } = await db.query(query, [id, userId]);
  return rows[0];
};

// Update category name
exports.updateName = async (userId, id, name) => {
  const query = `
    UPDATE categories
    SET name = $1
    WHERE id = $2 AND user_id = $3 AND is_default = false
    RETURNING id, name, type, is_default
  `;
  const { rows } = await db.query(query, [name, id, userId]);
  return rows[0];
};

// Delete category
exports.deleteCategory = async (userId, id) => {
  const query = `
    DELETE FROM categories
    WHERE id = $1 AND user_id = $2 AND is_default = false
    RETURNING id
  `;
  const { rowCount } = await db.query(query, [id, userId]);
  return rowCount > 0;
};
