import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { createTheater, getTheaters, updateTheater, deleteTheater } from "../controllers/theaterController.js";

const router = express.Router();

// Create theater (admin, super_admin)
router.post("/", authenticate, authorize("admin", "super_admin"), createTheater);

// Get theaters (all users, different logic inside controller)
router.get("/", authenticate, getTheaters);

// Update theater
router.put("/:id", authenticate, authorize("admin", "super_admin"), updateTheater);

// Delete theater
router.delete("/:id", authenticate, authorize("admin", "super_admin"), deleteTheater);

export default router;
