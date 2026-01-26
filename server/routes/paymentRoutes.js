import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  createOrder,
  verifyPayment,
  getBookingDetails,
  cancelBooking
} from '../controllers/paymentController.js';

const router = express.Router();

// Create payment order
router.post('/create-order', authenticate, createOrder);

// Verify payment and create booking
router.post('/verify-payment', authenticate, verifyPayment);

// Get booking details
router.get('/booking/:bookingId', authenticate, getBookingDetails);

// Cancel booking
router.delete('/booking/:bookingId', authenticate, cancelBooking);

export default router;
