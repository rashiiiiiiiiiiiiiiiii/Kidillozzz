const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigration() {
  console.log('🔄 Running initial schema migration...');
  const sqlPath = path.join(__dirname, 'migrations', '001_init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    await db.query(sql);
    console.log('✅ Migration completed successfully!');
    console.log('   - users table created');
    console.log('   - notifications table created');
    console.log('   - refresh_tokens table created');
    console.log('   - Default admin user seeded: admin@smartcampus.dev (password: admin123)');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await db.end();
  }
}

runMigration();
