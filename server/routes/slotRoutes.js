import express from "express";
import slotController from "../controllers/slotController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ⚠️ IMPORTANT: /admin/:doctorId and /bulk must come BEFORE /:doctorId and /:id
// Otherwise Express matches "admin" and "bulk" as the doctorId/id param

router.post("/bulk", protect.forAdmin, slotController.createBulkSlots);
router.post("/", protect.forAdmin, slotController.createSlot);
router.get("/admin/:doctorId", protect.forAdmin, slotController.getAllDoctorSlots);
router.get("/:doctorId", slotController.getDoctorSlots);
router.delete("/:id", protect.forAdmin, slotController.deleteSlot);

export default router;