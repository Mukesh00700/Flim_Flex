// routes/authRoutes.js
import express from "express";
import { registerCustomer,registerAdmin,login } from "../controllers/authController.js";

const router = express.Router();


// Customer registration
router.post("/register", registerCustomerController);

// Admin registration (requires adminKey)
router.post("/register-admin", registerAdminController);

// Login (works for all roles)
router.post("/login", loginController);

export default router;
