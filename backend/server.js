
import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./lib/Db.js";
import userroute from "./routes/userRoutes.js";
import msgroute from "./routes/messageroutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// ---------- Frontend URL ----------
const FRONTEND_URL =
  "https://chat-app-client-silk-ten.vercel.app";

// ---------- CORS Configuration ----------
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ---------- Socket.IO ----------
export const userSocketMap = {};

export const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ---------- Socket Connections ----------
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);

    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ---------- Middlewares ----------
app.use(cors(corsOptions));
app.use(express.json({ limit: "4mb" }));

// ---------- Routes ----------
app.use("/api/auth", userroute);
app.use("/api/messages", msgroute);

// ---------- Status Route ----------
app.get("/api/status", (req, res) => {
  res.status(200).send("Server running successfully 🚀");
});

// ---------- Start Server ----------
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Allowed frontend: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("Server start error:", error);
    process.exit(1);
  }
};

startServer();

export default server;