import express from "express";
const router = express.Router();

import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import cloudinaryRoutes from "./cloudinary.routes.js";

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cloudinary", cloudinaryRoutes);

export default router;
