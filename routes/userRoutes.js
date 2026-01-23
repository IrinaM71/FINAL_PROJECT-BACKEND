import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Получение профиля текущего пользователя
router.get("/profile", protect, getUserProfile);

// Обновление профиля текущего пользователя
router.put("/profile", protect, updateUserProfile);

export default router;
