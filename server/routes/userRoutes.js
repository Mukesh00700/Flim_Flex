import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';

// You would add middleware here to protect these routes, ensuring only admins can access them.
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users with search and filter capabilities
router.get('/',protect,admin,getAllUsers);

// Routes for a specific user by their ID
router.route('/:id',admin,protect)
  .get(getUserById) // Get a single user's details and booking history
  .put(updateUserRole) // Update a user's role
  .delete(deleteUser); // Delete a user

export default router;