import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/post.js";
import likeRoutes from "./routes/like.js";
import commentRoutes from "./routes/comment.js";
import searchRoutes from "./routes/search.js";
import messageRoutes from "./routes/message.js";
import followRoutes from "./routes/follow.js";
import notificationRoutes from "./routes/notification.js";
import http from "http";
import { Server } from "socket.io";

const app = express();
dotenv.config();

// Connect to MongoDB
connectDB();

app.use(express.json()); //для работы с JSON
const server = http.createServer(app); // создали HTTP сервер

// Настраиваем Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// События Socket.io
io.on("connection", (socket) => {
  console.log("The user has connected:", socket.id);

  // Подключение к комнате
  socket.on("joinRoom", ({ roomId }) => {
    socket.json(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  //Отправка сообщения
  socket.on("message", ({ roomId, message }) => {
    io.to(roomId).emit("message", {
      sender: socket.id,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (_req, res) => {
  res.send("API is connected");
});
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/post", postRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);
app.use("/serch", searchRoutes);
app.use("/messages", messageRoutes);
app.use("/follow", followRoutes);
app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
