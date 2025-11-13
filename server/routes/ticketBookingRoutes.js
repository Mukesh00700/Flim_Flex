import express from 'express';
import {
  getAvailableSeats,
  validateBooking,
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  getShowsForMovie,
  getAllShowsByDate,
  createShow,
  updateShow,
  deleteShow,
  getShowsByHall
} from '../controllers/ticketBookingControllers.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/shows', getShowsForMovie);
router.get('/shows/all', getAllShowsByDate);
router.get('/seats/:showId', getAvailableSeats);
router.get('/hall/:hallId/shows', getShowsByHall);

router.post('/validate', protect, validateBooking);
router.post('/create', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/:bookingId', protect, getBookingDetails);
router.put('/:bookingId/cancel', protect, cancelBooking);

// Admin show management routes
router.post('/schedule/create', authenticate, authorize('admin', 'super_admin'), createShow);
router.put('/schedule/:showId', authenticate, authorize('admin', 'super_admin'), updateShow);
router.delete('/schedule/:showId', authenticate, authorize('admin', 'super_admin'), deleteShow);

export default router;
