// src/routes/auth-route.js
import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  getProfileById,
  updateProfileById,
} from "../controllers/auth-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js"; // Use the new middleware

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.get("/profile",authMiddleware, getProfileById);
router.put("/profile",authMiddleware, updateProfileById);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/check-auth", authMiddleware, checkAuth);

router.post("/logout", logout);

export default router;
