import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect.forUser, createOrder);
router.post("/verify-payment", protect.forUser, verifyPayment);

export default router;
