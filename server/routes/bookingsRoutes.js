import express from 'express';
import { getBookingsForAdmin, updateBookingStatus } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();


router.get('/my-theater', protect, admin, getBookingsForAdmin);

router.put('/:id/status', protect, admin, updateBookingStatus);

export default router;