// routes/authRoutes.js
import express from "express";
import { registerCustomer,registerAdmin,login } from "../controllers/authController.js";

const router = express.Router();


// Customer registration
router.post("/register", registerCustomer);

// Admin registration (requires adminKey)
router.post("/register-admin", registerAdmin);

// Login (works for all roles)
router.post("/login", login);

export default router;
