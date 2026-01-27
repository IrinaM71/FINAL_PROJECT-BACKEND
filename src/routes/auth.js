//Маршруты для регистрации и авторизации: Мы создадим два основных
//маршрута — для регистрации и логина. Они будут обрабатывать входящие
//запросы, проверять данные и возвращать JWT, если все успешно.

import express, { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import router from "./userRoutes";

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
