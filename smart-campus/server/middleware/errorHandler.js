const env = require('../config/env');

/**
 * Global error-handling middleware.
 * Catches ApiError instances and unexpected errors, returning
 * a consistent JSON response shape.
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (env.nodeEnv === 'development') {
    console.error(`[${statusCode}] ${err.message}`);
    if (!err.isOperational) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message,
    },
  });
}

module.exports = errorHandler;
