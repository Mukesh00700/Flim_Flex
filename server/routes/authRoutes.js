
import express from "express";
import { 
  registerCustomerController,
  registerAdminController,
  loginController,
  googleAuth,
  verifyEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword
} from "../controllers/authControllers.js";

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("Auth test route is working!");
});

// Registration routes
router.post("/register", registerCustomerController);
router.post("/register-admin", registerAdminController);

// Login routes
router.post("/login", loginController);
router.post("/google", googleAuth);

// Email verification routes
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// Password reset routes
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
