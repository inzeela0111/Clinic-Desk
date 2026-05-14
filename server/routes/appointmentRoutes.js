import express from "express";
import appointmentController from "../controllers/appointmentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ⚠️ /mine pehle likhna zaroori hai /:id se pehle
// Warna Express "mine" ko ek id samajh lega

// User routes
router.post("/",            protect.forUser,  appointmentController.bookAppointment);
router.get("/mine",         protect.forUser,  appointmentController.getMyAppointments);
router.get("/:id",          protect.forUser,  appointmentController.getAppointment);
router.patch("/:id/cancel", protect.forUser,  appointmentController.cancelMyAppointment);
router.patch("/:id/feedback", protect.forUser, appointmentController.submitFeedback);

// Admin routes
router.get("/",             protect.forAdmin, appointmentController.getAllAppointments);
router.patch("/:id/status", protect.forAdmin, appointmentController.updateAppointmentStatus);

export default router;