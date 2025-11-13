
import express from "express";
import { registerCustomerController,registerAdminController,loginController,googleAuth } from "../controllers/authControllers.js";

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("Auth test route is working!");
});

router.post("/register", registerCustomerController);


router.post("/register-admin", registerAdminController);


router.post("/login", loginController);
router.post("/google",googleAuth)

export default router;
