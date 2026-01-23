import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

const app = express();
dotenv.config();

// Connect to MongoDB
connectDB();

app.use(express.json()); //для работы с JSON

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
