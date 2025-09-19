import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'FLIM_FLEX',
  password: 'mUKESH@07',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection test failed:', err);
  } else {
    console.log('Connection successful! Time:', res.rows[0].now);
  }
});

export default pool;