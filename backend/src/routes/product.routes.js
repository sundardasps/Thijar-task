import express from "express";
const router = express.Router();
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByBarcode,
  getProductsInfinite,
} from "../controllers/product.controller.js";
import { auth, authorize } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  listProductSchema,
  barcodeParamSchema,
  getProductByIdSchema,
  listProductInfiniteSchema,
} from "../validation/product.validation.js";


router.post(
  "/",
  auth,
  authorize("admin"),
  validate(createProductSchema),
  createProduct
);


router.get("/", auth, validate(listProductSchema), getProducts);

router.get(
  "/infinite",
  auth,
  validate(listProductInfiniteSchema),
  getProductsInfinite
);


router.get("/:id", auth, validate(getProductByIdSchema), getProductById);


router.put(
  "/:id",
  auth,
  authorize("admin"),
  validate(updateProductSchema),
  updateProduct
);


router.delete(
  "/:id",
  auth,
  authorize("admin"),
  validate(updateProductSchema),
  deleteProduct
);


router.get(
  "/barcode/:barcode",
  auth,
  validate(barcodeParamSchema),
  getProductByBarcode
);

export default router;
