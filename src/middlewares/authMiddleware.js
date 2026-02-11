import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import User from "../models/User.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Проверяем наличие токена
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Сохраняем в памяти
export const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fieldSize: 5 * 1024 * 1024 }, // ограничение 5МВ
});
