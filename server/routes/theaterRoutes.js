import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { createTheater, getTheaters, updateTheater, deleteTheater } from "../controllers/theaterController.js";

const router = express.Router();

// Create theater (admin, super_admin)
router.post("/createTheater", authenticate, authorize("admin", "super_admin"), createTheater);

// Get theaters (all users, different logic inside controller)
router.get("/getTheaters", authenticate, getTheaters);

// Update theater
router.put("/updateTheater/:id", authenticate, authorize("admin", "super_admin"), updateTheater);

// Delete theater
router.delete("/deleteTheater/:id", authenticate, authorize("admin", "super_admin"), deleteTheater);

export default router;
