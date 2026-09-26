const db = require('../../config/db');
const ApiError = require('../../utils/ApiError');

/**
 * Get all users (admin only).
 */
async function getAllUsers({ role, department, page = 1, limit = 20 }) {
  let query = 'SELECT id, name, email, role, department, batch, designation, created_at FROM users';
  const conditions = [];
  const params = [];

  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }
  if (department) {
    params.push(department);
    conditions.push(`department = $${params.length}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  const offset = (page - 1) * limit;
  params.push(limit, offset);
  query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const result = await db.query(query, params);
  return result.rows;
}

/**
 * Get a single user by ID.
 */
async function getUserById(id) {
  const result = await db.query(
    'SELECT id, name, email, role, department, batch, designation, created_at FROM users WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw ApiError.notFound('User not found');
  }

  return result.rows[0];
}

/**
 * Delete a user by ID (admin only).
 */
async function deleteUser(id) {
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    throw ApiError.notFound('User not found');
  }

  return { deleted: true };
}

module.exports = { getAllUsers, getUserById, deleteUser };
