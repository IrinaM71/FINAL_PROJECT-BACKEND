import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// Генерация JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.abort.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Регистрация пользователя
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingUser || existingUsername) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Создаём пользователя
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
    res.status(500).json({ message: "Server error", error });
  }
};

// Логин пользователя
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    //Проверяем пароль
    const isMatch = await user.comparePassword(password);
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
    res.status(500).json({ message: "Server error", error });
  }
};
