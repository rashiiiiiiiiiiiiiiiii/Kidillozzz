const db = require('../../config/db');
const redis = require('../../config/redis');
const ApiError = require('../../utils/ApiError');

/**
 * Get notifications for a user with optional filters.
 */
async function getUserNotifications(userId, { unreadOnly = false, page = 1, limit = 20 }) {
  let query = 'SELECT * FROM notifications WHERE user_id = $1';
  const params = [userId];

  if (unreadOnly) {
    query += ' AND read_status = FALSE';
  }

  query += ' ORDER BY created_at DESC';

  const offset = (page - 1) * limit;
  params.push(limit, offset);
  query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const result = await db.query(query, params);
  return result.rows;
}

/**
 * Get unread count for a user (with Redis caching fallback).
 */
async function getUnreadCount(userId) {
  const cacheKey = `notifications:unread:${userId}`;

  // Try cache first
  try {
    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return parseInt(cached, 10);
    }
  } catch (err) {
    console.warn('Redis cache lookup failed, falling back to DB:', err.message);
  }

  const result = await db.query(
    'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read_status = FALSE',
    [userId]
  );

  const count = parseInt(result.rows[0].count, 10);

  // Cache for 60 seconds (best-effort)
  try {
    await redis.setex(cacheKey, 60, count);
  } catch (err) {
    // Silent fallback
  }

  return count;
}

/**
 * Mark a notification as read.
 */
async function markAsRead(notificationId, userId) {
  const result = await db.query(
    'UPDATE notifications SET read_status = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
    [notificationId, userId]
  );

  if (result.rows.length === 0) {
    throw ApiError.notFound('Notification not found');
  }

  // Invalidate cache (best-effort)
  try {
    await redis.del(`notifications:unread:${userId}`);
  } catch (err) {
    // Silent fallback
  }

  return result.rows[0];
}

/**
 * Mark all notifications as read for a user.
 */
async function markAllAsRead(userId) {
  await db.query(
    'UPDATE notifications SET read_status = TRUE WHERE user_id = $1 AND read_status = FALSE',
    [userId]
  );

  try {
    await redis.del(`notifications:unread:${userId}`);
  } catch (err) {
    // Silent fallback
  }

  return { success: true };
}

/**
 * Create a notification (used by other modules internally).
 */
async function createNotification({ userId, title, message, sourceModule }) {
  const result = await db.query(
    `INSERT INTO notifications (user_id, title, message, source_module)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, title, message, sourceModule]
  );

  // Invalidate cache and publish (best-effort)
  try {
    await redis.del(`notifications:unread:${userId}`);
    await redis.publish(`notifications:${userId}`, JSON.stringify(result.rows[0]));
  } catch (err) {
    // Silent fallback
  }

  return result.rows[0];
}

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
};
