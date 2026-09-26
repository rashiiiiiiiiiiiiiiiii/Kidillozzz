const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const ApiError = require('../../utils/ApiError');

const SALT_ROUNDS = 10;

/**
 * Register a new user.
 */
async function register({ name, email, password, role, department, batch, designation }) {
  // Check for existing user
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw ApiError.conflict('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role, department, batch, designation)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, role, department, batch, designation, created_at`,
    [name, email, passwordHash, role, department || null, batch || null, designation || null]
  );

  return result.rows[0];
}

/**
 * Login and return access + refresh tokens.
 */
async function login({ email, password }) {
  const result = await db.query(
    'SELECT id, name, email, password_hash, role, department FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  // Store refresh token in DB
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await db.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, refreshToken, expiresAt]
  );

  const { password_hash, ...safeUser } = user;
  return { accessToken, refreshToken, user: safeUser };
}

/**
 * Refresh the access token using a valid refresh token.
 */
async function refresh(token) {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  // Check if token exists in DB (not revoked)
  const stored = await db.query(
    'SELECT id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [token]
  );

  if (stored.rows.length === 0) {
    throw ApiError.unauthorized('Refresh token revoked or expired');
  }

  const accessToken = signAccessToken({
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  });

  return { accessToken };
}

/**
 * Logout — revoke the refresh token.
 */
async function logout(userId) {
  await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
}

module.exports = { register, login, refresh, logout };
