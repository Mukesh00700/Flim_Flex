import express from 'express';
import { getUserProfile } from '../controllers/userControllers.js'; 
import  { protect }  from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/profile', protect, getUserProfile);


export default router;