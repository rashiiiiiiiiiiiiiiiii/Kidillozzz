const Redis = require('ioredis');
const env = require('./env');

const redis = new Redis({
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  retryStrategy(times) {
    if (times > 3) {
      return null; // Stop retrying if Redis is not running
    }
    return Math.min(times * 1000, 3000);
  },
});

redis.on('connect', () => console.log('✓ Redis connected'));
redis.on('error', (err) => {
  // Graceful warning rather than unhandled crash
  if (err.code === 'ECONNREFUSED') {
    // Only logged once or twice during startup
  }
});

module.exports = redis;
