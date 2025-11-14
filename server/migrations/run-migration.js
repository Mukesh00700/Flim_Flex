import pkg from 'pg';
const { Pool } = pkg;
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'FLIM_FLEX',
  password: 'mUKESH@07',
  port: 5432,
});

async function runMigration() {
  try {
    console.log('Running pending_users table migration...');
    
    const migrationSQL = readFileSync(
      join(__dirname, 'create_pending_users.sql'),
      'utf-8'
    );
    
    await pool.query(migrationSQL);
    
    console.log('✓ Migration completed successfully!');
    console.log('✓ pending_users table created');
    console.log('✓ Email index added');
    console.log('✓ Cleanup function created');
    
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
