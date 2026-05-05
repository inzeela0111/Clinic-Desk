// import express from "express"
// import authController from "../controllers/authController.js"
// import protect from "../middleware/authMiddleware.js"

// const router = express.Router()


// router.post("/register" , authController.registerUser)
// router.post("/login" , authController.loginUser)
// router.post("/private",protect.forUser , authController.privateController)


// export default router







import express from "express";
import authController from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/register", authController.registerUser);
router.post("/login",    authController.loginUser);

// Protected
router.get ("/profile",  protect.forUser,  authController.getProfile);
router.put ("/profile",  protect.forUser,  authController.updateProfile);
router.put ("/change-password", protect.forUser, authController.changePassword);

// Admin
router.get ("/users",            protect.forAdmin, authController.getAllUsers);
// router.patch("/users/:id/toggle", protect.forAdmin, authController.toggleUserStatus);

export default router;