// routes/authRoutes.js
import express from "express";
import { registerCustomerController,registerAdminController,loginController,googleAuth } from "../controllers/authControllers.js";

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("Auth test route is working!");
});
// Customer registration
router.post("/register", registerCustomerController);

// Admin registration (requires adminKey)
router.post("/register-admin", registerAdminController);

// Login (works for all roles)
router.post("/login", loginController);
router.post("/google",googleAuth)

export default router;
