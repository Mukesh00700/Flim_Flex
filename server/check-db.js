import pool from './config/db.js';

async function checkTables() {
  try {
    const result = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    console.log('Tables in database:', result.rows.map(t => t.table_name));
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}

checkTables();
