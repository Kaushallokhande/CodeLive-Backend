import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";  // Connect to MongoDB
import socketHandler from "./src/config/socket.js";
import cleanupRooms from "./src/utils/cleanupRooms.js";

// Import Routes
import authRoutes from "./src/routes/authRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/chat", chatRoutes);

// Initialize WebSockets
socketHandler(server);

// Run cleanup every 5 minutes
setInterval(cleanupRooms, 5 * 60 * 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
