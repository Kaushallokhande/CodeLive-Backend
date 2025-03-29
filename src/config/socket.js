import { Server } from "socket.io";
import Room from "../models/Room.js";
import Message from "../models/Message.js";

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    socket.on("join-room", async ({ roomId, userId, username }) => {
      socket.join(roomId);
      console.log(`👤 ${username} joined room ${roomId}`);
      socket.to(roomId).emit("user-joined", { id: userId, username });

      await Room.findByIdAndUpdate(roomId, {
        $addToSet: { participants: userId },
        lastActive: new Date(),
      });

      socket.on("code-change", ({ roomId, userId, code }) => {
        socket.to(roomId).emit("code-update", { id: userId, code });
      });

      socket.on("cursor-move", (cursorData) => {
        socket.to(roomId).emit("cursor-move", { id: userId, ...cursorData });
      });

      socket.on("leave-room", async () => {
        socket.leave(roomId);
        console.log(`🚪 ${username} left room ${roomId}`);
        socket.to(roomId).emit("user-left", { id: userId });

        await Room.findByIdAndUpdate(roomId, { $pull: { participants: userId } });
      });

      socket.on("disconnect", async () => {
        console.log(`❌ ${username} disconnected from room ${roomId}`);
        socket.to(roomId).emit("user-left", { id: userId });
      });

      // Handle real-time chat messages
      socket.on("send-message", async ({ message }) => {
        const timestamp = new Date();

        // Save message to database
        const newMessage = new Message({ roomId, sender: userId, message });
        await newMessage.save();

        // Broadcast to room
        io.to(roomId).emit("receive-message", {
          userId,
          username,
          message,
          timestamp: newMessage.timestamp,
        });
      });
    });
  });
};

export default socketHandler;
