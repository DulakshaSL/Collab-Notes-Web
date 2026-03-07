import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../middlewares/validate.middleware.js";
import protect from "../middlewares/auth.middleware.js";
import {
  getMe,
  updateMe,
  changePassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/change-password", protect, changePassword);



router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;