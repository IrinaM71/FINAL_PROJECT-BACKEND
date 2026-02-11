import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Генерация токена
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// =========================
//      РЕГИСТРАЦИЯ
// =========================

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    console.log("REGISTER BODY:", req.body);

    // Проверка обязательных полей
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!password || typeof password !== "string") {
      console.log("INVALID PASSWORD VALUE:", password);
      return res.status(400).json({ message: "Password is required" });
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Создание пользователя (важно: через new User)
    const user = new User({
      username,
      fullName,
      email,
      password: String(password), // гарантируем строку
    });

    await user.save(); // запускает pre-save hook (bcrypt)

    return res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    // Ошибка уникальности email/username
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Ошибка валидации Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// =========================
//          ЛОГИН
// =========================

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ищем по email ИЛИ username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid username/email" });
    }

    // Проверка пароля
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    return res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =========================
//     ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
// =========================

export const getMe = async (req, res) => {
  return res.json(req.user);
};
