import express from "express";
import router from "./search";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMessage, sendMessage } from "../controllers/messageController";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessage);

export default router;
