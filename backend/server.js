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

/* ---------- Socket.IO ---------- */
export const userSocketMap = {};

export const io = new Server(server, {
  cors: {
    origin: "*", // later replace with frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

/* ---------- Middlewares ---------- */
app.use(express.json({ limit: "4mb" }));
app.use(cors());

/* ---------- Routes ---------- */
app.use("/api/auth", userroute);
app.use("/api/messages", msgroute);

app.get("/api/status", (req, res) => {
  res.send("Server running successfully 🚀");
});

/* ---------- Start Server (IMPORTANT) ---------- */
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT; // 🔴 IMPORTANT
    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server running on port", PORT);
    });
  } catch (error) {
    console.error("Server start error:", error);
  }
};

startServer();

export default server;
