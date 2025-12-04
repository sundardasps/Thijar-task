import express from "express";

import { multerErrorHandler, upload } from "../middleware/multer.js";
import { validateUploadFile } from "../middleware/validateUploadFile.js";
import validate from "../middleware/validate.middleware.js";
import {
  deleteImage,
  uploadImage,
} from "../controllers/cloudinary.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import {
  deleteImageSchema,
  uploadImageSchema,
} from "../validation/cloudinary.validation.js";

const router = express.Router();

router.post(
  "/upload",
  auth,
  upload,
  multerErrorHandler,
  validateUploadFile,
  validate(uploadImageSchema),
  uploadImage
);

router.post("/delete", auth, validate(deleteImageSchema), deleteImage);

export default router;
