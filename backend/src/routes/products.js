import express from "express";
import { createProduct, getProducts } from "../controllers/productsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", authMiddleware, upload.single("image"), createProduct);
router.post("/test-upload", upload.single("image"), (req, res) => {
  console.log("File uploaded:", req.file);
  res.json({ url: req.file?.path });
});

export default router;
