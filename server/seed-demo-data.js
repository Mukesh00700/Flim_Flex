import pool from './config/db.js';
import bcrypt from 'bcrypt';

/**
 * Demo Data Script
 * Populates database with sample data for testing
 */

async function seedDemoData() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting demo data seeding...\n');

    await client.query('BEGIN');

    // ============================================
    // 1. CREATE USERS
    // ============================================
    console.log('👥 Creating users...');

    // Hash password for all demo users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Customer users (verified)
    const customers = await client.query(`
      INSERT INTO users (name, email, password, role, is_verified) VALUES
      ('John Doe', 'john@example.com', $1, 'customer', true),
      ('Jane Smith', 'jane@example.com', $1, 'customer', true),
      ('Mike Johnson', 'mike@example.com', $1, 'customer', true),
      ('Sarah Williams', 'sarah@example.com', $1, 'customer', true),
      ('David Brown', 'david@example.com', $1, 'customer', true)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email
    `, [hashedPassword]);

    // Admin users (verified)
    const admins = await client.query(`
      INSERT INTO users (name, email, password, role, is_verified) VALUES
      ('Admin User', 'admin@filmflex.com', $1, 'admin', true),
      ('Theater Manager', 'manager@filmflex.com', $1, 'admin', true),
      ('Super Admin', 'superadmin@filmflex.com', $1, 'super_admin', true)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email, role
    `, [hashedPassword]);

    console.log(`✅ Created ${customers.rowCount} customers and ${admins.rowCount} admins`);

    // ============================================
    // 2. CREATE MOVIES
    // ============================================
    console.log('\n🎬 Creating movies...');

    const movies = await client.query(`
      INSERT INTO movies (title, description, languages, genre, release_date, poster_url) VALUES
      ('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', 
       ARRAY['English', 'Hindi'], 'Sci-Fi', '2010-07-16', 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg'),
      
      ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests.', 
       ARRAY['English', 'Hindi', 'Tamil'], 'Action', '2008-07-18', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
      
      ('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', 
       ARRAY['English', 'Hindi'], 'Sci-Fi', '2014-11-07', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
      
      ('Avengers: Endgame', 'After the devastating events, the Avengers assemble once more to reverse Thanos actions and restore balance.', 
       ARRAY['English', 'Hindi', 'Tamil', 'Telugu'], 'Action', '2019-04-26', 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg'),
      
      ('Jawan', 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify wrongs in society.', 
       ARRAY['Hindi', 'Tamil', 'Telugu'], 'Action', '2023-09-07', 'https://image.tmdb.org/t/p/w500/63xYQj1BwRFielxsBDXvHw60PCZ.jpg'),
      
      ('Pathaan', 'An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.', 
       ARRAY['Hindi', 'Tamil', 'Telugu'], 'Action', '2023-01-25', 'https://image.tmdb.org/t/p/w500/kIALEPYaYwDEppz4R0VEbjWVJQ4.jpg'),
      
      ('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 
       ARRAY['English'], 'Drama', '1994-09-23', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'),
      
      ('Oppenheimer', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', 
       ARRAY['English', 'Hindi'], 'Biography', '2023-07-21', 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg')
      
      ON CONFLICT DO NOTHING
      RETURNING id, title
    `);

    console.log(`✅ Created ${movies.rowCount} movies`);

    // ============================================
    // 3. CREATE THEATERS & HALLS
    // ============================================
    console.log('\n🏢 Creating theaters and halls...');

    const adminId = admins.rows[0]?.id || 1;

    const theaters = await client.query(`
      INSERT INTO theaters (name, city, address, admin_id) VALUES
      ('PVR Cinemas', 'Mumbai', 'Phoenix Marketcity, Kurla West, Mumbai, Maharashtra', $1),
      ('INOX Megaplex', 'Delhi', 'Connaught Place, New Delhi, Delhi', $1),
      ('Cinepolis', 'Bangalore', 'Royal Meenakshi Mall, Bannerghatta Road, Bangalore', $1),
      ('Carnival Cinemas', 'Pune', 'Seasons Mall, Magarpatta, Pune, Maharashtra', $1)
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `, [adminId]);

    console.log(`✅ Created ${theaters.rowCount} theaters`);

    // Create halls for each theater
    let hallCount = 0;
    for (const theater of theaters.rows) {
      const halls = await client.query(`
        INSERT INTO halls (theater_id, name, capacity) VALUES
        ($1, 'Screen 1', 150),
        ($1, 'Screen 2', 120),
        ($1, 'Screen 3', 180),
        ($1, 'IMAX', 200)
        ON CONFLICT DO NOTHING
        RETURNING id, name
      `, [theater.id]);
      hallCount += halls.rowCount;
    }

    console.log(`✅ Created ${hallCount} halls`);

    // ============================================
    // 4. CREATE SEATS
    // ============================================
    console.log('\n💺 Creating seats...');

    const hallsResult = await client.query('SELECT id FROM halls');
    let seatCount = 0;

    for (const hall of hallsResult.rows) {
      // Create seats: Rows A-J, Seats 1-15
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      
      for (const row of rows) {
        for (let seatNum = 1; seatNum <= 15; seatNum++) {
          let seatType = 'basic';
          
          // VIP seats (front rows A-C)
          if (['A', 'B', 'C'].includes(row)) {
            seatType = 'vip';
          }
          // Recliner seats (back rows I-J)
          else if (['I', 'J'].includes(row)) {
            seatType = 'recliner';
          }

          await client.query(`
            INSERT INTO seats (hall_id, row_label, seat_number, seat_type)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
          `, [hall.id, row, seatNum, seatType]);
          
          seatCount++;
        }
      }
    }

    console.log(`✅ Created ${seatCount} seats`);

    // ============================================
    // 5. CREATE SHOWS
    // ============================================
    console.log('\n🎭 Creating shows...');

    const moviesResult = await client.query('SELECT id, title, languages FROM movies');
    const hallsForShows = await client.query(`
      SELECT h.id, h.name, t.name as theater_name 
      FROM halls h 
      JOIN theaters t ON h.theater_id = t.id
    `);

    let showCount = 0;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    // Create shows for the next 3 days
    for (const movie of moviesResult.rows) {
      for (const hall of hallsForShows.rows.slice(0, 2)) { // 2 halls per movie
        const language = movie.languages[0]; // Use first language
        
        // Create shows at different times
        const showtimes = [
          { hour: 10, minute: 30 },  // Morning
          { hour: 14, minute: 0 },   // Afternoon
          { hour: 18, minute: 30 },  // Evening
          { hour: 21, minute: 45 }   // Night
        ];

        for (const time of showtimes) {
          // Today's shows
          const todayShow = new Date(today);
          todayShow.setHours(time.hour, time.minute, 0, 0);

          // Tomorrow's shows
          const tomorrowShow = new Date(tomorrow);
          tomorrowShow.setHours(time.hour, time.minute, 0, 0);

          await client.query(`
            INSERT INTO shows (movie_id, hall_id, show_time, language)
            VALUES 
            ($1, $2, $3, $4),
            ($1, $2, $5, $4)
            ON CONFLICT DO NOTHING
          `, [movie.id, hall.id, todayShow, language, tomorrowShow]);
          
          showCount += 2;
        }
      }
    }

    console.log(`✅ Created ${showCount} shows`);

    // ============================================
    // 6. CREATE PRICING
    // ============================================
    console.log('\n💰 Creating pricing rules...');

    const showsResult = await client.query('SELECT id FROM shows');
    let priceCount = 0;

    for (const show of showsResult.rows) {
      await client.query(`
        INSERT INTO prices (show_id, seat_type, price) VALUES
        ($1, 'basic', 150.00),
        ($1, 'vip', 250.00),
        ($1, 'recliner', 350.00)
        ON CONFLICT DO NOTHING
      `, [show.id]);
      priceCount += 3;
    }

    console.log(`✅ Created ${priceCount} pricing rules`);

    // ============================================
    // 7. CREATE SAMPLE BOOKINGS
    // ============================================
    console.log('\n🎫 Creating sample bookings...');

    const customersResult = await client.query('SELECT id FROM users WHERE role = $1 LIMIT 3', ['customer']);
    const showsForBooking = await client.query('SELECT id FROM shows LIMIT 5');
    const seatsForBooking = await client.query('SELECT id FROM seats WHERE hall_id = 1 LIMIT 10');

    let bookingCount = 0;

    // Create 3 sample bookings
    for (let i = 0; i < 3; i++) {
      const customerId = customersResult.rows[i]?.id;
      const showId = showsForBooking.rows[i]?.id;
      const seatIds = [seatsForBooking.rows[i * 2]?.id, seatsForBooking.rows[i * 2 + 1]?.id];

      if (customerId && showId && seatIds[0]) {
        const booking = await client.query(`
          INSERT INTO bookings (user_id, show_id, total_amount, payment_status, payment_reference)
          VALUES ($1, $2, 300.00, 'paid', 'DEMO_TXN_${i + 1}')
          RETURNING id
        `, [customerId, showId]);

        // Insert booking seats
        for (const seatId of seatIds) {
          if (seatId) {
            await client.query(`
              INSERT INTO booking_seats (booking_id, show_id, seat_id, price_paid)
              VALUES ($1, $2, $3, 150.00)
              ON CONFLICT DO NOTHING
            `, [booking.rows[0].id, showId, seatId]);
          }
        }

        bookingCount++;
      }
    }

    console.log(`✅ Created ${bookingCount} sample bookings`);

    await client.query('COMMIT');

    // ============================================
    // DISPLAY SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('✨ DEMO DATA SEEDING COMPLETE! ✨');
    console.log('='.repeat(60));

    console.log('\n📊 Summary:');
    console.log(`   Users: ${customers.rowCount + admins.rowCount}`);
    console.log(`   Movies: ${movies.rowCount}`);
    console.log(`   Theaters: ${theaters.rowCount}`);
    console.log(`   Halls: ${hallCount}`);
    console.log(`   Seats: ${seatCount}`);
    console.log(`   Shows: ${showCount}`);
    console.log(`   Prices: ${priceCount}`);
    console.log(`   Bookings: ${bookingCount}`);

    console.log('\n👤 Demo Login Credentials:');
    console.log('   Customer:');
    console.log('     Email: john@example.com');
    console.log('     Password: password123');
    console.log('\n   Admin:');
    console.log('     Email: admin@filmflex.com');
    console.log('     Password: password123');
    console.log('\n   Super Admin:');
    console.log('     Email: superadmin@filmflex.com');
    console.log('     Password: password123');

    console.log('\n🎬 Sample Movies:');
    for (const movie of movies.rows) {
      console.log(`   - ${movie.title}`);
    }

    console.log('\n🏢 Sample Theaters:');
    for (const theater of theaters.rows) {
      console.log(`   - ${theater.name}`);
    }

    console.log('\n🚀 You can now:');
    console.log('   1. Login with demo credentials');
    console.log('   2. Browse movies and theaters');
    console.log('   3. View available shows');
    console.log('   4. Make bookings');
    console.log('   5. Test payment and ticket generation');

    console.log('\n💡 API Testing Tips:');
    console.log('   - GET /movies/all - View all movies');
    console.log('   - GET /api/bookings/shows/all?date=2025-11-13 - View shows');
    console.log('   - GET /theater/getTheaters - View all theaters');
    console.log('   - POST /auth/login - Login with demo credentials');

    console.log('\n✅ Ready to test! 🎉\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding demo data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the seeding
seedDemoData()
  .then(() => {
    console.log('🎊 Demo data seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Demo data seeding failed:', error);
    process.exit(1);
  });
