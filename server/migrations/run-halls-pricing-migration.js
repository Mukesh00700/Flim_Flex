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
    console.log('🔄 Running default prices migration for halls table...');
    
    const migrationSQL = readFileSync(
      join(__dirname, 'add_default_prices_to_halls.sql'),
      'utf-8'
    );
    
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('✅ Added default_basic_price column');
    console.log('✅ Added default_recliner_price column');
    console.log('✅ Added default_vip_price column');
    console.log('✅ Updated existing halls with default values');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
