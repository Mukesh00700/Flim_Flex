import Razorpay from 'razorpay';
import crypto from 'crypto';
import pool from '../config/db.js';

// Initialize Razorpay instance only if keys are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

export const createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        msg: 'Payment service not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env'
      });
    }

    const { seats, totalAmount, showId } = req.body;
    const userId = req.user.id;

    if (!seats || seats.length === 0 || !totalAmount || !showId) {
      return res.status(400).json({
        success: false,
        msg: 'Missing required fields: seats, totalAmount, showId'
      });
    }

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `booking_${showId}_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // Create pending booking in database
    const bookingResult = await pool.query(
      `INSERT INTO bookings (user_id, show_id, total_amount, payment_status, razorpay_order_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [userId, showId, totalAmount, 'pending', order.id]
    );

    const bookingId = bookingResult.rows[0].id;

    // Create booking seats records
    for (const seatId of seats) {
      await pool.query(
        `INSERT INTO booking_seats (booking_id, show_id, seat_id)
         VALUES ($1, $2, $3)`,
        [bookingId, showId, seatId]
      );
    }

    res.json({
      success: true,
      orderId: order.id,
      bookingId: bookingId,
      amount: totalAmount,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to create payment order',
      error: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      signature,
      bookingId,
      seats,
      totalAmount,
      showId
    } = req.body;

    // Verify Razorpay signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      // Payment verification failed - update booking status
      await pool.query(
        `UPDATE bookings SET payment_status = $1 WHERE id = $2`,
        ['failed', bookingId]
      );

      return res.status(400).json({
        success: false,
        msg: 'Payment verification failed. Signature mismatch.'
      });
    }

    // Signature is valid - update booking to paid
    const updateResult = await pool.query(
      `UPDATE bookings 
       SET payment_status = $1, razorpay_payment_id = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, show_id, total_amount`,
      ['paid', paymentId, bookingId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Booking not found'
      });
    }

    // Update booking_seats with payment status
    await pool.query(
      `UPDATE booking_seats SET payment_status = $1 WHERE booking_id = $2`,
      ['paid', bookingId]
    );

    // Mark seats as booked in main seats table
    for (const seatId of seats) {
      await pool.query(
        `UPDATE seats SET is_booked = true WHERE id = $1 AND show_id = $2`,
        [seatId, showId]
      );
    }

    res.json({
      success: true,
      msg: 'Payment verified successfully',
      bookingId: bookingId
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to verify payment',
      error: error.message
    });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT b.*, 
              s.show_time, s.movie_id, s.hall_id,
              m.title as movie_title,
              h.hall_name,
              t.name as theater_name
       FROM bookings b
       JOIN shows s ON b.show_id = s.id
       JOIN movies m ON s.movie_id = m.id
       JOIN halls h ON s.hall_id = h.id
       JOIN theaters t ON h.theater_id = t.id
       WHERE b.id = $1 AND b.user_id = $2`,
      [bookingId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Booking not found'
      });
    }

    const booking = result.rows[0];

    // Get booked seats
    const seatsResult = await pool.query(
      `SELECT seat_id FROM booking_seats WHERE booking_id = $1`,
      [bookingId]
    );

    const seats = seatsResult.rows.map(row => row.seat_id);

    res.json({
      success: true,
      booking: {
        ...booking,
        seats: seats
      }
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch booking details',
      error: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Check if booking exists and belongs to user
    const bookingResult = await pool.query(
      `SELECT * FROM bookings WHERE id = $1 AND user_id = $2`,
      [bookingId, userId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Booking not found'
      });
    }

    const booking = bookingResult.rows[0];

    // Check if show time has passed
    const showResult = await pool.query(
      `SELECT show_time FROM shows WHERE id = $1`,
      [booking.show_id]
    );

    if (new Date(showResult.rows[0].show_time) < new Date()) {
      return res.status(400).json({
        success: false,
        msg: 'Cannot cancel booking after show time'
      });
    }

    // Get all seats in this booking to mark them as unbooked
    const seatsResult = await pool.query(
      `SELECT seat_id FROM booking_seats WHERE booking_id = $1`,
      [bookingId]
    );

    const seatIds = seatsResult.rows.map(row => row.seat_id);

    // Update seats to unbooked
    if (seatIds.length > 0) {
      await pool.query(
        `UPDATE seats SET is_booked = false WHERE id = ANY($1)`,
        [seatIds]
      );
    }

    // Update booking status to cancelled
    await pool.query(
      `UPDATE bookings SET payment_status = $1, updated_at = NOW() WHERE id = $2`,
      ['cancelled', bookingId]
    );

    // Process refund if payment was successful
    if (booking.payment_status === 'paid' && booking.razorpay_payment_id) {
      // In production, call Razorpay refund API
      // For now, just mark as refunded in DB
      await pool.query(
        `UPDATE bookings SET refund_status = $1 WHERE id = $2`,
        ['processed', bookingId]
      );
    }

    res.json({
      success: true,
      msg: 'Booking cancelled successfully',
      refundAmount: booking.total_amount
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to cancel booking',
      error: error.message
    });
  }
};
