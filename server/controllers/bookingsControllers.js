import pool from '../db.js';


export const getBookingsForAdmin = async (req, res) => {
  const adminId = req.user.id;
  const { status = 'all', search = '' } = req.query;

  try {
    const values = [adminId];
    let paramIndex = 2;
    

    let query = `
      SELECT
        b.id AS booking_id, b.total_amount, b.payment_status, b.booking_time,
        u.name AS customer_name,
        m.title AS movie_title,
        s.show_time,
        h.name AS hall_name,
        (SELECT string_agg(st.row_label || st.seat_number, ', ')
         FROM booking_seats bs
         JOIN seats st ON bs.seat_id = st.id
         WHERE bs.booking_id = b.id) AS seats
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN shows s ON b.show_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN halls h ON s.hall_id = h.id
      JOIN theaters t ON h.theater_id = t.id
      WHERE t.admin_id = $1
    `;

    if (status !== 'all') {
      query += ` AND b.payment_status = $${paramIndex++}`;
      values.push(status);
    }
    if (search) {
      query += ` AND (u.name ILIKE $${paramIndex} OR m.title ILIKE $${paramIndex} OR b.id::text ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
    }
    
    query += ' ORDER BY b.booking_time DESC';

    const { rows } = await pool.query(query, values);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};


export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['cancelled', 'refunded'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status update' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE bookings SET payment_status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
};