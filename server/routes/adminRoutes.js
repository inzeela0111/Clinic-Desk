import express from "express";
import adminController from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats",   protect.forUser, adminController.getDashboardStats);
router.get("/today",   protect.forUser, adminController.getTodaySchedule);
router.get("/revenue", protect.forUser, adminController.getRevenueStats);

export default router;