import express from "express";
const router = express.Router();
import {
  createCategory,
  deleteCategory,
  updateCategory,
  listCategories,
} from "../controllers/category.controller.js";
import { auth, authorize } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  listCategorySchema,
} from "../validation/category.validation.js";

router.post(
  "/",
  auth,
  authorize("admin"),
  validate(createCategorySchema),
  createCategory
);

router.get("/", auth, validate(listCategorySchema), listCategories);

router.put(
  "/:id",
  auth,
  authorize("admin"),
  validate(updateCategorySchema),
  updateCategory
);

router.delete(
  "/:id",
  auth,
  authorize("admin"),
  validate(updateCategorySchema),
  deleteCategory
);

export default router;
