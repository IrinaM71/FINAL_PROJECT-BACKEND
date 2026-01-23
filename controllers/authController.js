//Контроллеры: Для регистрации проверим, существует ли пользователь с
//таким email или username, хэшируем пароль и сохраняем пользователя. Для
//логина проверим email и введенный пароль и сгенерируем токен.

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Регистрация пользователя
export const registerUser = async (req, res) => {
  const { username, email, password, fullName } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ username, email, password, fullName });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Логин пользователя
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.find;
    One({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
