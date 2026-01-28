import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMessage, sendMessage } from "../controllers/messageController";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessage);

export default router;
