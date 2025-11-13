import fs from 'fs';
import path from 'path';
import pool from './config/db.js';

async function setupDatabase() {
  try {
    const schemaPath = path.join(process.cwd(), 'models', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('Executing database schema...');
    await pool.query(schema);
    console.log('✅ Database schema created successfully!');
    
    // Check tables again
    const result = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    console.log('Tables in database:', result.rows.map(t => t.table_name));
    
  } catch (err) {
    console.error('❌ Error setting up database:', err.message);
  }
  process.exit(0);
}

setupDatabase();
