import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  getPricesForShow,
  upsertPrice,
  setPricesForShow,
  deletePrice,
  getShowsForPricing
} from "../controllers/priceController.js";

const router = express.Router();

// Get all prices for a show
router.get("/show/:showId", getPricesForShow);

// Get all shows that need pricing
router.get("/shows/list", authenticate, authorize("admin", "super_admin"), getShowsForPricing);

// Create or update price for a show and seat type
router.post("/upsert", authenticate, authorize("admin", "super_admin"), upsertPrice);

// Set multiple prices for a show at once
router.post("/show/:showId/set", authenticate, authorize("admin", "super_admin"), setPricesForShow);

// Delete a price
router.delete("/:priceId", authenticate, authorize("admin", "super_admin"), deletePrice);

export default router;
