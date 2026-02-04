import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Генерация токена
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Регистрация пользователя
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Проверка обязательных полей
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Проверка существующего email или username
    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingUser || existingUsername) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Создание пользователя (пароль хэшируется в pre-save)
    const user = await User.create({
      username,
      fullName,
      email,
      password,
    });

    res.status(201).json({
      message: "Registration was successful",
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

// Логин пользователя
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    // Проверка пароля
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({
      message: "Successful login",
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

export const getMe = async (req, res) => {
  res.json(req.user);
};
