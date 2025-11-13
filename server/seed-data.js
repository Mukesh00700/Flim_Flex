import pool from './config/db.js';
import bcrypt from 'bcrypt';

async function seedData() {
  try {
    console.log('🌱 Seeding test data...\n');
    
    // Create a theater with admin (using user id 1 or create one)
    let adminUserId = 1;
    const userCheck = await pool.query('SELECT id FROM users LIMIT 1');
    if (userCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin@123', 10); // Seed password: admin@123
      const newUser = await pool.query(
        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id`,
        ['Admin User', 'admin@test.com', hashedPassword, 'admin']
      );
      adminUserId = newUser.rows[0].id;
      console.log('✓ Created admin user:', adminUserId, '(email: admin@test.com, password: admin@123)');
    } else {
      adminUserId = userCheck.rows[0].id;
      console.log('✓ Using existing admin user:', adminUserId);
    }
    
    // Create a theater
    const theaterResult = await pool.query(
      `INSERT INTO theaters (name, city, address, admin_id) VALUES ($1, $2, $3, $4) RETURNING id`,
      ['PVR Cinemas', 'Delhi', '123 Main St', adminUserId]
    );
    const theaterId = theaterResult.rows[0].id;
    console.log('✓ Created theater:', theaterId);
    
    // Create a hall
    const hallResult = await pool.query(
      `INSERT INTO halls (theater_id, name, capacity) VALUES ($1, $2, $3) RETURNING id`,
      [theaterId, 'Screen 1', 100]
    );
    const hallId = hallResult.rows[0].id;
    console.log('✓ Created hall:', hallId);
    
    // Create a show (tomorrow at 6 PM)
    const tomorrowAt6PM = new Date();
    tomorrowAt6PM.setDate(tomorrowAt6PM.getDate() + 1);
    tomorrowAt6PM.setHours(18, 0, 0, 0);
    
    const movieCheck = await pool.query('SELECT id FROM movies LIMIT 1');
    if (movieCheck.rows.length === 0) {
      console.log('❌ No movies found. Add a movie first!');
      process.exit(1);
    }
    const movieId = movieCheck.rows[0].id;
    
    const showResult = await pool.query(
      `INSERT INTO shows (movie_id, hall_id, show_time, language) VALUES ($1, $2, $3, $4) RETURNING id`,
      [movieId, hallId, tomorrowAt6PM.toISOString(), 'Hindi']
    );
    const showId = showResult.rows[0].id;
    console.log('✓ Created show:', showId, 'at', tomorrowAt6PM.toISOString());
    
    // Create some seats (rows A-C, seats 1-10)
    const seatInserts = [];
    for (let row = 0; row < 3; row++) {
      const rowLabel = String.fromCharCode(65 + row); // A, B, C
      for (let seat = 1; seat <= 10; seat++) {
        seatInserts.push([hallId, rowLabel, seat, 'basic']);
      }
    }
    
    for (const [hid, row, num, type] of seatInserts) {
      await pool.query(
        `INSERT INTO seats (hall_id, row_label, seat_number, seat_type) VALUES ($1, $2, $3, $4)`,
        [hid, row, num, type]
      );
    }
    console.log('✓ Created 30 seats (3 rows × 10 seats)');
    
    // Create prices for the show
    await pool.query(
      `INSERT INTO prices (show_id, seat_type, price) VALUES ($1, $2, $3)`,
      [showId, 'basic', 250]
    );
    console.log('✓ Created price for show');
    
    console.log('\n✅ Seed data created successfully!');
    console.log('\nYou can now test the /movies/getRunningMovies endpoint');
    
  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
  }
  process.exit(0);
}

seedData();
