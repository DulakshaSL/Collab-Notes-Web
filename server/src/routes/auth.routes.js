import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;