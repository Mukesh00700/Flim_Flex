import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';


import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/',protect,admin,getAllUsers);


router.route('/:id',admin,protect)
  .get(getUserById) // Get a single user's details and booking history
  .put(updateUserRole) // Update a user's role
  .delete(deleteUser); // Delete a user

export default router;