import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { signup, signin, getProfile, updateProfile } from "../controllers/authController.js";
import { googleAuth } from "../controllers/googleController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/google", googleAuth);
router.post("/signup", signup);
router.post("/signin", signin);

export default router;
