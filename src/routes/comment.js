import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  addComment,
  deleteComment,
  getPostComments,
} from "../controllers/commentController";

const router = express.Router();

router.post("/:postId", authMiddleware, addComment);
router.get("/:postId", getPostComments);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
