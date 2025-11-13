import express from 'express';
import {getAllUsers,getUserById,updateUserRole,deleteUser,} from '../controllers/customerController.js';


import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/',protect,admin,getAllUsers);


router.route('/:id',admin,protect)
  .get(getUserById) // Get a single user's details and booking history
  .put(updateUserRole) // Update a user's role
  .delete(deleteUser); // Delete a user

export default router;