import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getNotification, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware,getNotification);
router.patch("/read", authMiddleware, markAsRead);

export default router;
