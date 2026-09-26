const { verifyAccessToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

/**
 * Authentication middleware.
 * Extracts the JWT from the Authorization header, verifies it,
 * and attaches the decoded payload to req.user.
 */
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing or malformed token'));
  }

  const token = header.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired'));
    }
    return next(ApiError.unauthorized('Invalid token'));
  }
}

module.exports = auth;
