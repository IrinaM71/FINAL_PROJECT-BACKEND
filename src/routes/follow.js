import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../controllers/followController.js";

const router = express.Router();

router.post("/follow/:userId", authMiddleware, followUser);
router.delete("/unfollow/:userId", authMiddleware, unfollowUser);
router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);

export default router;
