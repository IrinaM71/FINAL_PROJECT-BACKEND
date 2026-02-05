import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Генерация токена
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//  РЕГИСТРАЦИЯ

export const registerUser = async (req, res) => {
  try {
    console.log("REGISTER BODY RAW:", req.body);
    console.log("username:", req.body.username);
    console.log("fullName:", req.body.fullName);
    console.log("email:", req.body.email);
    console.log("password:", req.body.password);

    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Проверка существующего email или username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Создание пользователя
    const user = await User.create({
      username,
      fullName,
      email,
      password,
    });

    res.status(201).json({
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
    res.status(500).json({ message: "Server error" });
  }
};

//  ЛОГИН (email ИЛИ username)

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

    res.json({
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
    res.status(500).json({ message: "Server error" });
  }
};

//ПОЛУЧЕНИЕ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ

export const getMe = async (req, res) => {
  res.json(req.user);
};
