//Маршруты для всех этих операций реализуются в postRoutes.js, где каждая функция
//контроллера подключается к соответствующему маршруту API.

import express from "express";
import {
  getUserPosts,
  createPost,
  deletePost,
  getPostById,
  updatePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Получение всех постов пользователя
router.get("/", protect, getUserPosts);

// Создание поста
router.post("/", protect, createPost);

// Удаление поста
router.delete("/:id", protect, deletePost);

// Получение конкретного поста по ID
router.get("/:id", protect, getPostById);

// Обновление поста
router.put("/:id", protect, updatePost);

export default router;
export const updatePost = async (req, res) => {
  const { image, description } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    post.image = image || post.image;
    post.description = description || post.description;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
