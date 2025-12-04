import express from "express";
const router = express.Router();
import { login, register, user } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";
import { auth } from "../middleware/auth.middleware.js";

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/user",auth, user);

export default router;
