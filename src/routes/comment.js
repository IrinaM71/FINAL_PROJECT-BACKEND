import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createComment,
  deleteComment,
  getPostComments,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/:postId", authMiddleware, createComment);
router.get("/:postId", getPostComments);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
