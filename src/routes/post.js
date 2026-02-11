import express from "express";
import {
  getUserPosts,
  createPost,
  deletePost,
  getPostById,
  updatePost,
  getAllPosts,
  getFeed,
} from "../controllers/postController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { toggleLike } from "../controllers/likeController.js";

const router = express.Router();

// Лента
router.get("/feed", getFeed);

// Все посты
router.get("/", getAllPosts);

// Посты пользователя
router.get("/user/:userId", getUserPosts);

// Лайки
router.post("/:id/like", toggleLike);

// router.post("/:id/comment", addComment);

// Создание поста
router.post("/create", authMiddleware, upload.single("image"), createPost);

// Удаление
router.delete("/:id", authMiddleware, deletePost);

// Получение по ID
router.get("/:id", getPostById);

// Обновление
router.patch("/:id", authMiddleware, upload.single("image"), updatePost);

export default router;
