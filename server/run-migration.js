import pool from './config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🔄 Running email verification migration...\n');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'migrations', 'add_email_verification.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL
    await pool.query(sql);

    console.log('✅ Migration completed successfully!');
    console.log('\nAdded columns:');
    console.log('  - is_verified (BOOLEAN)');
    console.log('  - verification_token (VARCHAR)');
    console.log('  - verification_token_expires (TIMESTAMPTZ)');
    console.log('  - password_reset_token (VARCHAR)');
    console.log('  - password_reset_token_expires (TIMESTAMPTZ)');
    console.log('\nCreated indexes:');
    console.log('  - idx_users_verification_token');
    console.log('  - idx_users_password_reset_token');
    console.log('  - idx_users_email');
    console.log('\n✨ Email verification system is now ready to use!\n');

    // Test query to verify
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('is_verified', 'verification_token', 'verification_token_expires', 
                          'password_reset_token', 'password_reset_token_expires')
      ORDER BY column_name;
    `);

    if (result.rows.length > 0) {
      console.log('📋 Verification - New columns in users table:');
      console.table(result.rows);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
