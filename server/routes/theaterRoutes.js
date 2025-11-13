import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { 
  createTheater, 
  getTheaters, 
  updateTheater, 
  deleteTheater, 
  addSeatsToHall, 
  getCities,
  createHall,
  getHallsByTheater,
  updateHall,
  deleteHall
} from "../controllers/theaterController.js";

const router = express.Router();


router.post("/createTheater", authenticate, authorize("admin", "super_admin"), createTheater);


router.get("/getTheaters", authenticate, getTheaters);


router.put("/updateTheater/:id", authenticate, authorize("admin", "super_admin"), updateTheater);


router.delete("/deleteTheater/:id", authenticate, authorize("admin", "super_admin"), deleteTheater);

// Add seats to a hall (admin/super_admin only)
router.post("/halls/:hallId/seats", authenticate, authorize("admin", "super_admin"), addSeatsToHall);
router.get('/cities', getCities);

// Hall management routes
router.post("/:theaterId/halls", authenticate, authorize("admin", "super_admin"), createHall);
router.get("/:theaterId/halls", authenticate, getHallsByTheater);
router.put("/halls/:hallId", authenticate, authorize("admin", "super_admin"), updateHall);
router.delete("/halls/:hallId", authenticate, authorize("admin", "super_admin"), deleteHall);

export default router;
