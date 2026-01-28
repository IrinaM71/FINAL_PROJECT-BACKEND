import express from "express";
import {
  getUserPosts,
  createPost,
  deletePost,
  getPostById,
  updatePost,
  getAllPosts,
} from "../controllers/postController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Получение всех постов
router.get("/", getAllPosts);
// Получение всех постов пользователя
router.get("/user/:userId", getUserPosts);

// Создание поста
router.post("/create", authMiddleware, upload.single("image"), createPost);

// Удаление поста
router.delete("/:id", authMiddleware, deletePost);

// Получение конкретного поста по ID
router.get("/:id", getPostById);

// Обновление поста
router.patch("/:id", authMiddleware, upload.single("image"), updatePost);

export default router;
