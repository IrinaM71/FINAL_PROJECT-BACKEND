import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/userRoutes.js";
import postRoutes from "./src/routes/post.js";
import likeRoutes from "./src/routes/like.js";
import commentRoutes from "./src/routes/comment.js";
import searchRoutes from "./src/routes/search.js";
import messageRoutes from "./src/routes/message.js";
import followRoutes from "./src/routes/follow.js";
import notificationRoutes from "./src/routes/notification.js";

dotenv.config();

const app = express();
connectDB();

// CORS — единая политика для API и Socket.IO

app.use(
  cors({
    origin: true, // автоматически подставляет Origin клиента
    credentials: true,
  }),
);

// JSON body parser — обязательно ДО роутов

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// HTTP + Socket.IO

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// Socket.IO events

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (data) => {
    if (!data || !data.roomId) {
      console.log("⚠️ joinRoom received invalid data:", data);
      return;
    }

    const { roomId } = data;

    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("message", (data) => {
    if (!data || !data.roomId || !data.message) {
      console.log("⚠️ message received invalid data:", data);
      return;
    }

    const { roomId, message } = data;

    io.to(roomId).emit("message", {
      sender: socket.id,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// API Routes

app.get("/", (_req, res) => {
  res.send("API is connected");
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);
app.use("/search", searchRoutes);
app.use("/messages", messageRoutes);
app.use("/follow", followRoutes);
app.use("/notifications", notificationRoutes);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
