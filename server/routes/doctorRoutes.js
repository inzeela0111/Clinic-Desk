import express from "express"
import doctorController from "../controllers/doctorController.js"
import protect from "../middleware/authMiddleware.js"


const router = express.Router()

router.get("/", doctorController.getDoctors)
router.get("/:id", doctorController.getDoctor)
router.post('/', protect.forAdmin, doctorController.createDoctor);
router.put('/:id', protect.forAdmin, doctorController.updateDoctor);
router.delete('/:id', protect.forAdmin, doctorController.deleteDoctor);


export default router