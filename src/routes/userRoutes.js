import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  deleteUser,
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Получение профиля текущего пользователя
router.get("/:id", getUserProfile);

// Обновление профиля текущего пользователя и загрузка аватара
router.patch(
  "/me/update",
  authMiddleware,
  upload.single("avatar"),

  updateUserProfile,
);

// Добавление пользователя
router.post("/add", createUserProfile);

// Удаление пользователя
router.delete("/me/delete", authMiddleware, deleteUser);

export default router;
