import express from "express";
import aiController from "../controllers/aiController.js";

const router = express.Router();

// Public route — user bina login ke bhi use kar sake
router.post("/symptoms", aiController.getSuggestedSpeciality);

export default router;