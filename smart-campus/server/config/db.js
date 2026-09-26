const { Pool } = require('pg');
const env = require('./env');

const poolConfig = env.db.connectionString
  ? {
      connectionString: env.db.connectionString,
      ssl: env.db.ssl ? { rejectUnauthorized: false } : undefined,
    }
  : {
      host: env.db.host,
      port: env.db.port,
      database: env.db.database,
      user: env.db.user,
      password: env.db.password,
      ssl: env.db.ssl ? { rejectUnauthorized: false } : undefined,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
});

module.exports = pool;
