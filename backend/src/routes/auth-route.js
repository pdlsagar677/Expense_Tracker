// src/routes/auth-route.js
import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  checkAuth,
  getProfileById,
  updateProfileById,
  changePassword,
  deleteAccount,
  refresh,
} from "../controllers/auth-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js"; 

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.get("/profile",authMiddleware, getProfileById);
router.put("/profile",authMiddleware, updateProfileById);
router.delete("/delete-account", authMiddleware, deleteAccount);

router.post("/refresh", refresh);

router.put("/change-password",authMiddleware, changePassword);

router.get("/check-auth", authMiddleware, checkAuth);

router.post("/logout", logout);

export default router;
