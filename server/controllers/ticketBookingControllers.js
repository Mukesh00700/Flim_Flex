import pool from '../config/db.js';
import { 
  generateTicketId, 
  generateTicketQRCode, 
  generateVerificationCode,
  generateTicketHTML 
} from '../utils/ticketGenerator.js';
import { sendTicketEmail } from '../config/nodemailer.js';


export const getAvailableSeats = async (req, res) => {
  const { showId } = req.params;

  try {
    // Fetch hall info from show
    const showQuery = await pool.query(
      `SELECT h.id as hall_id, h.name, t.name as theater_name, m.title as movie_title, s.show_time, l.language
       FROM shows s
       JOIN halls h ON s.hall_id = h.id
       JOIN theaters t ON h.theater_id = t.id
       JOIN movies m ON s.movie_id = m.id
       LEFT JOIN (SELECT DISTINCT language FROM shows WHERE id = $1) l ON true
       WHERE s.id = $1`,
      [showId]
    );

    if (showQuery.rowCount === 0) {
      return res.status(404).json({ msg: 'Show not found' });
    }

    const hallInfo = showQuery.rows[0];

    // Fetch all seats in hall with their booking status
    const seatsQuery = await pool.query(
      `SELECT 
        st.id, 
        st.row_label, 
        st.seat_number, 
        st.seat_type,
        CASE WHEN bs.id IS NOT NULL THEN true ELSE false END as is_booked,
        p.price
       FROM seats st
       LEFT JOIN booking_seats bs ON st.id = bs.seat_id AND bs.show_id = $1
       LEFT JOIN prices p ON p.show_id = $1 AND p.seat_type = st.seat_type
       WHERE st.hall_id = $2
       ORDER BY st.row_label, st.seat_number`,
      [showId, hallInfo.hall_id]
    );

    const seats = seatsQuery.rows.map(seat => ({
      id: seat.id,
      row: seat.row_label,
      number: seat.seat_number,
      type: seat.seat_type,
      isBooked: seat.is_booked,
      price: seat.price ? parseFloat(seat.price) : 0
    }));

    res.status(200).json({
      show: {
        id: showId,
        movieTitle: hallInfo.movie_title,
        theaterName: hallInfo.theater_name,
        hallName: hallInfo.name,
        showTime: hallInfo.show_time,
        language: hallInfo.language
      },
      seats
    });

  } catch (error) {
    console.error('Error fetching available seats:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// ✅ Validate seat availability and calculate total price
export const validateBooking = async (req, res) => {
  const { showId, seatIds } = req.body;

  if (!showId || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ msg: 'Invalid showId or seatIds' });
  }

  try {
    // Check if show exists
    const showQuery = await pool.query('SELECT id FROM shows WHERE id = $1', [showId]);
    if (showQuery.rowCount === 0) {
      return res.status(404).json({ msg: 'Show not found' });
    }

    // Get seat details and prices
    const seatsQuery = await pool.query(
      `SELECT 
        st.id, 
        st.row_label, 
        st.seat_number, 
        p.price,
        CASE WHEN bs.id IS NOT NULL THEN true ELSE false END as is_booked
       FROM seats st
       LEFT JOIN booking_seats bs ON st.id = bs.seat_id AND bs.show_id = $1
       LEFT JOIN prices p ON p.show_id = $1 AND p.seat_type = st.seat_type
       WHERE st.id = ANY($2)`,
      [showId, seatIds]
    );

    if (seatsQuery.rowCount !== seatIds.length) {
      return res.status(400).json({ msg: 'Some seats not found' });
    }

    // Check if any seat is already booked
    const bookedSeats = seatsQuery.rows.filter(seat => seat.is_booked);
    if (bookedSeats.length > 0) {
      return res.status(400).json({
        msg: 'Some seats are already booked',
        bookedSeats: bookedSeats.map(s => `${s.row_label}${s.seat_number}`)
      });
    }

    // Calculate total
    let totalAmount = 0;
    const seatDetails = [];
    seatsQuery.rows.forEach(seat => {
      totalAmount += parseFloat(seat.price) || 0;
      seatDetails.push({
        id: seat.id,
        seat: `${seat.row_label}${seat.seat_number}`,
        price: parseFloat(seat.price) || 0
      });
    });

    res.status(200).json({
      valid: true,
      seatDetails,
      totalAmount: parseFloat(totalAmount.toFixed(2))
    });

  } catch (error) {
    console.error('Error validating booking:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// ✅ Create a new booking
export const createBooking = async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { showId, seatIds, paymentDetails } = req.body;

  if (!showId || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ msg: 'Invalid showId or seatIds' });
  }

  // Limit booking to 7 seats per person
  if (seatIds.length > 7) {
    return res.status(400).json({ msg: 'Cannot book more than 7 seats per booking' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Lock and check if seats are available
    const seatsQuery = await client.query(
      `SELECT st.id, p.price
       FROM seats st
       LEFT JOIN booking_seats bs ON st.id = bs.seat_id AND bs.show_id = $1
       LEFT JOIN prices p ON p.show_id = $1 AND p.seat_type = st.seat_type
       WHERE st.id = ANY($2)
       FOR UPDATE OF booking_seats`,
      [showId, seatIds]
    );

    if (seatsQuery.rowCount !== seatIds.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ msg: 'Some seats not found' });
    }

    // Check if any seat is already booked
    const bookedCheck = await client.query(
      `SELECT bs.id FROM booking_seats bs
       WHERE bs.show_id = $1 AND bs.seat_id = ANY($2)`,
      [showId, seatIds]
    );

    if (bookedCheck.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ msg: 'Some seats are already booked' });
    }

    // Calculate total amount
    let totalAmount = 0;
    seatsQuery.rows.forEach(seat => {
      totalAmount += parseFloat(seat.price) || 0;
    });

    // Create booking
    const bookingQuery = await client.query(
      `INSERT INTO bookings (user_id, show_id, total_amount, payment_status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, show_id, total_amount, payment_status, booking_time`,
      [userId, showId, totalAmount, paymentDetails?.status || 'pending']
    );

    const bookingId = bookingQuery.rows[0].id;

    // Insert booking seats
    const bookingSeatValues = seatIds
      .map((seatId, idx) => {
        const price = seatsQuery.rows.find(s => s.id === seatId)?.price || 0;
        return `(${bookingId}, ${showId}, ${seatId}, ${price})`;
      })
      .join(', ');

    await client.query(
      `INSERT INTO booking_seats (booking_id, show_id, seat_id, price_paid)
       VALUES ${bookingSeatValues}`
    );

    // If payment details provided, update booking with payment reference
    let isPaid = false;
    if (paymentDetails?.transactionId) {
      await client.query(
        `UPDATE bookings SET payment_reference = $1, payment_status = $2 WHERE id = $3`,
        [paymentDetails.transactionId, 'paid', bookingId]
      );
      isPaid = true;
    }

    await client.query('COMMIT');

    // Fetch complete booking details
    const completeBooking = await pool.query(
      `SELECT 
        b.id, b.user_id, b.show_id, b.total_amount, b.payment_status, b.payment_reference, b.booking_time,
        u.name as user_name, u.email as user_email,
        m.title as movie_title,
        s.show_time,
        h.name as hall_name,
        t.name as theater_name,
        string_agg(st.row_label || st.seat_number, ', ' ORDER BY st.row_label, st.seat_number) as seats
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN shows s ON b.show_id = s.id
       JOIN movies m ON s.movie_id = m.id
       JOIN halls h ON s.hall_id = h.id
       JOIN theaters t ON h.theater_id = t.id
       JOIN booking_seats bs ON b.id = bs.booking_id
       JOIN seats st ON bs.seat_id = st.id
       WHERE b.id = $1
       GROUP BY b.id, b.user_id, b.show_id, b.total_amount, b.payment_status, b.payment_reference, b.booking_time, u.name, u.email, m.title, s.show_time, h.name, t.name`,
      [bookingId]
    );

    const bookingData = completeBooking.rows[0];

    // Generate and send ticket if payment is successful
    let ticketData = null;
    if (isPaid) {
      try {
        // Generate ticket information
        const ticketId = generateTicketId(bookingId);
        const verificationCode = generateVerificationCode();
        const seatsArray = bookingData.seats.split(', ');

        // Prepare QR code data
        const qrData = {
          ticketId,
          bookingId,
          userId: bookingData.user_id,
          showId: bookingData.show_id,
          seats: seatsArray,
          verificationCode
        };

        // Generate QR code
        const qrCodeDataURL = await generateTicketQRCode(qrData);

        // Store ticket in database
        await pool.query(
          `INSERT INTO tickets (ticket_id, booking_id, user_id, show_id, verification_code, qr_code_data)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [ticketId, bookingId, bookingData.user_id, bookingData.show_id, verificationCode, qrCodeDataURL]
        );

        // Prepare ticket data for email
        const ticketEmailData = {
          ticketId,
          bookingId,
          movieTitle: bookingData.movie_title,
          theaterName: bookingData.theater_name,
          hallName: bookingData.hall_name,
          showTime: bookingData.show_time,
          seats: seatsArray,
          totalAmount: parseFloat(bookingData.total_amount),
          verificationCode,
          qrCode: qrCodeDataURL,
          bookingTime: bookingData.booking_time
        };

        // Generate ticket HTML
        const ticketHTML = generateTicketHTML(ticketEmailData);

        // Send ticket email
        await sendTicketEmail(
          bookingData.user_email,
          bookingData.user_name,
          ticketHTML,
          ticketId
        );

        // Update booking to mark ticket as sent
        await pool.query(
          `UPDATE bookings SET ticket_sent = true, ticket_sent_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [bookingId]
        );

        ticketData = {
          ticketId,
          verificationCode,
          qrCode: qrCodeDataURL
        };

        console.log(`✅ Ticket generated and sent for booking #${bookingId}`);
      } catch (ticketError) {
        console.error('❌ Error generating/sending ticket:', ticketError);
        // Don't fail the booking if ticket generation fails
      }
    }

    res.status(201).json({
      msg: 'Booking created successfully',
      booking: {
        id: bookingData.id,
        movieTitle: bookingData.movie_title,
        theaterName: bookingData.theater_name,
        hallName: bookingData.hall_name,
        showTime: bookingData.show_time,
        seats: bookingData.seats.split(', '),
        totalAmount: parseFloat(bookingData.total_amount),
        paymentStatus: bookingData.payment_status,
        bookingTime: bookingData.booking_time,
        ticketSent: isPaid
      },
      ticket: ticketData
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating booking:', error);
    res.status(500).json({ msg: 'Server Error' });
  } finally {
    client.release();
  }
};

// ✅ Get user's booking history
export const getUserBookings = async (req, res) => {
  const userId = req.user.id;
  const { status = 'all', limit = 10, offset = 0 } = req.query;

  try {
    let query = `
      SELECT 
        b.id, b.total_amount, b.payment_status, b.booking_time, b.cancelled_at,
        m.title as movie_title, m.poster_url,
        s.show_time,
        h.name as hall_name,
        t.name as theater_name,
        string_agg(st.row_label || st.seat_number, ', ' ORDER BY st.row_label, st.seat_number) as seats
      FROM bookings b
      JOIN shows s ON b.show_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN halls h ON s.hall_id = h.id
      JOIN theaters t ON h.theater_id = t.id
      JOIN booking_seats bs ON b.id = bs.booking_id
      JOIN seats st ON bs.seat_id = st.id
      WHERE b.user_id = $1
    `;

    const values = [userId];

    if (status !== 'all') {
      query += ` AND b.payment_status = $2`;
      values.push(status);
    }

    query += ` GROUP BY b.id, b.total_amount, b.payment_status, b.booking_time, b.cancelled_at, m.title, m.poster_url, s.show_time, h.name, t.name
               ORDER BY b.booking_time DESC
               LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    values.push(limit, offset);

    const { rows } = await pool.query(query, values);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(DISTINCT b.id) as total FROM bookings b WHERE b.user_id = $1`;
    const countParams = [userId];

    if (status !== 'all') {
      countQuery += ` AND b.payment_status = $2`;
      countParams.push(status);
    }

    const { rows: countRows } = await pool.query(countQuery, countParams);

    res.status(200).json({
      bookings: rows.map(row => ({
        id: row.id,
        movieTitle: row.movie_title,
        posterUrl: row.poster_url,
        theaterName: row.theater_name,
        hallName: row.hall_name,
        showTime: row.show_time,
        seats: row.seats.split(', '),
        totalAmount: parseFloat(row.total_amount),
        paymentStatus: row.payment_status,
        bookingTime: row.booking_time,
        cancelledAt: row.cancelled_at
      })),
      pagination: {
        total: parseInt(countRows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(parseInt(countRows[0].total) / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// ✅ Get single booking details
export const getBookingDetails = async (req, res) => {
  const userId = req.user.id;
  const { bookingId } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT 
        b.id, b.total_amount, b.payment_status, b.payment_reference, b.booking_time, b.cancelled_at,
        m.title as movie_title, m.description as movie_description, m.poster_url,
        s.show_time, s.language,
        h.name as hall_name,
        t.name as theater_name, t.address, t.city,
        string_agg(st.row_label || st.seat_number, ', ' ORDER BY st.row_label, st.seat_number) as seats,
        json_agg(json_build_object('seat', st.row_label || st.seat_number, 'type', st.seat_type, 'price', bs.price_paid) ORDER BY st.row_label, st.seat_number) as seat_details
      FROM bookings b
      JOIN shows s ON b.show_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN halls h ON s.hall_id = h.id
      JOIN theaters t ON h.theater_id = t.id
      JOIN booking_seats bs ON b.id = bs.booking_id
      JOIN seats st ON bs.seat_id = st.id
      WHERE b.id = $1 AND b.user_id = $2
      GROUP BY b.id, b.total_amount, b.payment_status, b.payment_reference, b.booking_time, b.cancelled_at, m.title, m.description, m.poster_url, s.show_time, s.language, h.name, t.name, t.address, t.city`,
      [bookingId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    const booking = rows[0];

    res.status(200).json({
      booking: {
        id: booking.id,
        movieTitle: booking.movie_title,
        movieDescription: booking.movie_description,
        posterUrl: booking.poster_url,
        theaterName: booking.theater_name,
        theaterAddress: booking.address,
        theaterCity: booking.city,
        hallName: booking.hall_name,
        showTime: booking.show_time,
        language: booking.language,
        seats: booking.seats.split(', '),
        seatDetails: booking.seat_details,
        totalAmount: parseFloat(booking.total_amount),
        paymentStatus: booking.payment_status,
        paymentReference: booking.payment_reference,
        bookingTime: booking.booking_time,
        cancelledAt: booking.cancelled_at
      }
    });

  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// ✅ Cancel booking
export const cancelBooking = async (req, res) => {
  const userId = req.user.id;
  const { bookingId } = req.params;
  const { reason } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verify booking belongs to user and is not already cancelled
    const bookingQuery = await client.query(
      `SELECT id, payment_status FROM bookings WHERE id = $1 AND user_id = $2`,
      [bookingId, userId]
    );

    if (bookingQuery.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (bookingQuery.rows[0].payment_status === 'cancelled') {
      await client.query('ROLLBACK');
      return res.status(400).json({ msg: 'Booking is already cancelled' });
    }

    // Update booking status to cancelled
    const updateQuery = await client.query(
      `UPDATE bookings SET payment_status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    await client.query('COMMIT');

    res.status(200).json({
      msg: 'Booking cancelled successfully',
      booking: {
        id: updateQuery.rows[0].id,
        paymentStatus: updateQuery.rows[0].payment_status,
        cancelledAt: updateQuery.rows[0].cancelled_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling booking:', error);
    res.status(500).json({ msg: 'Server Error' });
  } finally {
    client.release();
  }
};

// ✅ Get shows for a specific movie and date
export const getShowsForMovie = async (req, res) => {
  const { movieId, date } = req.query;

  if (!movieId || !date) {
    return res.status(400).json({ msg: 'movieId and date are required' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        s.id, s.show_time, s.language,
        h.id as hall_id, h.name as hall_name,
        t.id as theater_id, t.name as theater_name, t.city,
        COUNT(CASE WHEN bs.id IS NULL THEN 1 END) as available_seats,
        COUNT(bs.id) as booked_seats
       FROM shows s
       JOIN halls h ON s.hall_id = h.id
       JOIN theaters t ON h.theater_id = t.id
       LEFT JOIN booking_seats bs ON s.id = bs.show_id
       LEFT JOIN seats st ON st.id = bs.seat_id
       WHERE s.movie_id = $1 AND DATE(s.show_time) = $2
       GROUP BY s.id, s.show_time, s.language, h.id, h.name, t.id, t.name, t.city
       ORDER BY s.show_time`,
      [movieId, date]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'No shows available for this movie on the given date' });
    }

    res.status(200).json({
      shows: rows.map(row => ({
        showId: row.id,
        showTime: row.show_time,
        language: row.language,
        hallName: row.hall_name,
        theaterName: row.theater_name,
        city: row.city,
        availableSeats: parseInt(row.available_seats),
        bookedSeats: parseInt(row.booked_seats)
      }))
    });

  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get all shows for a given date (across movies) - used for home filters
export const getAllShowsByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) return res.status(400).json({ msg: 'date is required (YYYY-MM-DD)' });

  try {
    const { rows } = await pool.query(
      `SELECT 
        s.id as show_id, s.show_time, s.language,
        h.id as hall_id, h.name as hall_name,
        t.id as theater_id, t.name as theater_name, t.city,
        m.id as movie_id, m.title as movie_title
       FROM shows s
       JOIN halls h ON s.hall_id = h.id
       JOIN theaters t ON h.theater_id = t.id
       JOIN movies m ON s.movie_id = m.id
       WHERE DATE(s.show_time) = $1
       ORDER BY s.show_time`,
      [date]
    );

    res.status(200).json({ shows: rows.map(r => ({
      showId: r.show_id,
      showTime: r.show_time,
      language: r.language,
      hallId: r.hall_id,
      hallName: r.hall_name,
      theaterId: r.theater_id,
      theaterName: r.theater_name,
      city: r.city,
      movieId: r.movie_id,
      movieTitle: r.movie_title
    }))});
  } catch (err) {
    console.error('Error fetching all shows by date:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ Create a new show
export const createShow = async (req, res) => {
  try {
    const { movieId, hallId, showTime, language } = req.body;

    if (!movieId || !hallId || !showTime) {
      return res.status(400).json({ msg: 'movieId, hallId, and showTime are required' });
    }

    // Verify authorization - admin can only create shows for their theaters
    if (req.user.role === "admin") {
      const hallCheck = await pool.query(
        `SELECT h.id FROM halls h
         JOIN theaters t ON h.theater_id = t.id
         WHERE h.id = $1 AND t.admin_id = $2`,
        [hallId, req.user.id]
      );
      if (hallCheck.rowCount === 0) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
    }

    const result = await pool.query(
      `INSERT INTO shows (movie_id, hall_id, show_time, language)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [movieId, hallId, showTime, language]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ Update a show
export const updateShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const { showTime, language } = req.body;

    // Verify authorization
    if (req.user.role === "admin") {
      const showCheck = await pool.query(
        `SELECT s.id FROM shows s
         JOIN halls h ON s.hall_id = h.id
         JOIN theaters t ON h.theater_id = t.id
         WHERE s.id = $1 AND t.admin_id = $2`,
        [showId, req.user.id]
      );
      if (showCheck.rowCount === 0) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
    }

    const result = await pool.query(
      `UPDATE shows SET show_time = $1, language = $2 WHERE id = $3 RETURNING *`,
      [showTime || null, language || null, showId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ Delete a show
export const deleteShow = async (req, res) => {
  try {
    const { showId } = req.params;

    // Verify authorization
    if (req.user.role === "admin") {
      const showCheck = await pool.query(
        `SELECT s.id FROM shows s
         JOIN halls h ON s.hall_id = h.id
         JOIN theaters t ON h.theater_id = t.id
         WHERE s.id = $1 AND t.admin_id = $2`,
        [showId, req.user.id]
      );
      if (showCheck.rowCount === 0) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
    }

    // Check if there are any bookings
    const bookingCheck = await pool.query(
      `SELECT COUNT(*) as count FROM bookings WHERE show_id = $1`,
      [showId]
    );

    if (bookingCheck.rows[0].count > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete show with existing bookings. Please cancel bookings first.'
      });
    }

    await pool.query("DELETE FROM shows WHERE id = $1", [showId]);
    res.json({ msg: "Show deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ Get all shows for a hall
export const getShowsByHall = async (req, res) => {
  try {
    const { hallId } = req.params;

    const result = await pool.query(
      `SELECT s.id, s.movie_id, m.title as movie_title, s.show_time, s.language,
              COUNT(bs.id) as booked_seats
       FROM shows s
       JOIN movies m ON s.movie_id = m.id
       LEFT JOIN booking_seats bs ON s.id = bs.show_id
       WHERE s.hall_id = $1
       GROUP BY s.id, s.movie_id, m.title, s.show_time, s.language
       ORDER BY s.show_time DESC`,
      [hallId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ============================================
// TICKET MANAGEMENT ENDPOINTS
// ============================================

/**
 * Get ticket by booking ID
 */
export const getTicketByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const ticketQuery = await pool.query(
      `SELECT 
        t.ticket_id, t.verification_code, t.qr_code_data, t.is_used, t.used_at, t.created_at,
        b.id as booking_id, b.total_amount, b.payment_status, b.booking_time,
        m.title as movie_title, m.poster_url,
        s.show_time,
        h.name as hall_name,
        th.name as theater_name, th.address as theater_address,
        string_agg(st.row_label || st.seat_number, ', ' ORDER BY st.row_label, st.seat_number) as seats
       FROM tickets t
       JOIN bookings b ON t.booking_id = b.id
       JOIN shows s ON t.show_id = s.id
       JOIN movies m ON s.movie_id = m.id
       JOIN halls h ON s.hall_id = h.id
       JOIN theaters th ON h.theater_id = th.id
       JOIN booking_seats bs ON b.id = bs.booking_id
       JOIN seats st ON bs.seat_id = st.id
       WHERE t.booking_id = $1 AND b.user_id = $2
       GROUP BY t.ticket_id, t.verification_code, t.qr_code_data, t.is_used, t.used_at, t.created_at,
                b.id, b.total_amount, b.payment_status, b.booking_time,
                m.title, m.poster_url, s.show_time, h.name, th.name, th.address`,
      [bookingId, userId]
    );

    if (ticketQuery.rowCount === 0) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    const ticket = ticketQuery.rows[0];

    res.json({
      ticketId: ticket.ticket_id,
      verificationCode: ticket.verification_code,
      qrCode: ticket.qr_code_data,
      isUsed: ticket.is_used,
      usedAt: ticket.used_at,
      booking: {
        id: ticket.booking_id,
        totalAmount: parseFloat(ticket.total_amount),
        paymentStatus: ticket.payment_status,
        bookingTime: ticket.booking_time
      },
      show: {
        movieTitle: ticket.movie_title,
        posterUrl: ticket.poster_url,
        showTime: ticket.show_time,
        hallName: ticket.hall_name,
        theaterName: ticket.theater_name,
        theaterAddress: ticket.theater_address,
        seats: ticket.seats.split(', ')
      },
      createdAt: ticket.created_at
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Resend ticket email
 */
export const resendTicket = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Fetch booking and ticket details
    const result = await pool.query(
      `SELECT 
        t.ticket_id, t.verification_code, t.qr_code_data,
        b.id as booking_id, b.total_amount, b.booking_time,
        u.name as user_name, u.email as user_email,
        m.title as movie_title,
        s.show_time,
        h.name as hall_name,
        th.name as theater_name,
        string_agg(st.row_label || st.seat_number, ', ' ORDER BY st.row_label, st.seat_number) as seats
       FROM tickets t
       JOIN bookings b ON t.booking_id = b.id
       JOIN users u ON b.user_id = u.id
       JOIN shows s ON t.show_id = s.id
       JOIN movies m ON s.movie_id = m.id
       JOIN halls h ON s.hall_id = h.id
       JOIN theaters th ON h.theater_id = th.id
       JOIN booking_seats bs ON b.id = bs.booking_id
       JOIN seats st ON bs.seat_id = st.id
       WHERE t.booking_id = $1 AND b.user_id = $2
       GROUP BY t.ticket_id, t.verification_code, t.qr_code_data,
                b.id, b.total_amount, b.booking_time,
                u.name, u.email, m.title, s.show_time, h.name, th.name`,
      [bookingId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    const data = result.rows[0];

    // Prepare ticket data for email
    const ticketEmailData = {
      ticketId: data.ticket_id,
      bookingId: data.booking_id,
      movieTitle: data.movie_title,
      theaterName: data.theater_name,
      hallName: data.hall_name,
      showTime: data.show_time,
      seats: data.seats.split(', '),
      totalAmount: parseFloat(data.total_amount),
      verificationCode: data.verification_code,
      qrCode: data.qr_code_data,
      bookingTime: data.booking_time
    };

    // Generate ticket HTML
    const ticketHTML = generateTicketHTML(ticketEmailData);

    // Send ticket email
    await sendTicketEmail(
      data.user_email,
      data.user_name,
      ticketHTML,
      data.ticket_id
    );

    res.json({ 
      msg: 'Ticket email sent successfully',
      success: true 
    });
  } catch (error) {
    console.error('Error resending ticket:', error);
    res.status(500).json({ msg: 'Failed to send ticket email' });
  }
};

/**
 * Verify ticket (for theater staff)
 * Check if ticket is valid and mark as used
 */
export const verifyTicket = async (req, res) => {
  try {
    const { ticketId, verificationCode } = req.body;

    if (!ticketId || !verificationCode) {
      return res.status(400).json({ msg: 'Ticket ID and verification code are required' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Find ticket
      const ticketQuery = await client.query(
        `SELECT 
          t.id, t.ticket_id, t.verification_code, t.is_used, t.used_at,
          b.payment_status,
          s.show_time,
          m.title as movie_title,
          h.name as hall_name,
          th.name as theater_name,
          string_agg(st.row_label || st.seat_number, ', ' ORDER BY st.row_label, st.seat_number) as seats
         FROM tickets t
         JOIN bookings b ON t.booking_id = b.id
         JOIN shows s ON t.show_id = s.id
         JOIN movies m ON s.movie_id = m.id
         JOIN halls h ON s.hall_id = h.id
         JOIN theaters th ON h.theater_id = th.id
         JOIN booking_seats bs ON b.id = bs.booking_id
         JOIN seats st ON bs.seat_id = st.id
         WHERE t.ticket_id = $1
         GROUP BY t.id, t.ticket_id, t.verification_code, t.is_used, t.used_at,
                  b.payment_status, s.show_time, m.title, h.name, th.name
         FOR UPDATE OF t`,
        [ticketId]
      );

      if (ticketQuery.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ msg: 'Invalid ticket' });
      }

      const ticket = ticketQuery.rows[0];

      // Verify code
      if (ticket.verification_code !== verificationCode) {
        await client.query('ROLLBACK');
        return res.status(400).json({ msg: 'Invalid verification code' });
      }

      // Check if already used
      if (ticket.is_used) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          msg: 'Ticket already used',
          usedAt: ticket.used_at
        });
      }

      // Check payment status
      if (ticket.payment_status !== 'paid') {
        await client.query('ROLLBACK');
        return res.status(400).json({ msg: 'Payment not confirmed for this ticket' });
      }

      // Check if show time has passed (optional - you may want to allow some buffer)
      const showTime = new Date(ticket.show_time);
      const now = new Date();
      if (now < showTime - 30 * 60 * 1000) { // 30 minutes before show
        await client.query('ROLLBACK');
        return res.status(400).json({ msg: 'Too early. Please arrive closer to show time.' });
      }

      // Mark ticket as used
      await client.query(
        `UPDATE tickets SET is_used = true, used_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [ticket.id]
      );

      await client.query('COMMIT');

      res.json({
        msg: 'Ticket verified successfully',
        success: true,
        ticket: {
          ticketId: ticket.ticket_id,
          movieTitle: ticket.movie_title,
          theaterName: ticket.theater_name,
          hallName: ticket.hall_name,
          showTime: ticket.show_time,
          seats: ticket.seats.split(', ')
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error verifying ticket:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
