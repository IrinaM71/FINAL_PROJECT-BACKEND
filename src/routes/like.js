import express from "express";
import { getPostLikes, toggleLike } from "../controllers/likeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:postId", authMiddleware, toggleLike);
router.get("/:postId", getPostLikes);

export default router;
