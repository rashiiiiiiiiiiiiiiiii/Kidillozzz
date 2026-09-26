const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');

async function start() {
  // Verify database connection
  try {
    await db.query('SELECT NOW()');
    console.log('✓ PostgreSQL connected');
  } catch (err) {
    console.warn('\n⚠️  PostgreSQL is not connected: ' + err.message);
    console.warn('   Ensure PostgreSQL is running and update credentials in .env.\n');
  }

  app.listen(env.port, () => {
    console.log(`\n🚀 Smart Campus API running on http://localhost:${env.port}`);
    console.log(`   Environment: ${env.nodeEnv}\n`);
  });
}

start();
