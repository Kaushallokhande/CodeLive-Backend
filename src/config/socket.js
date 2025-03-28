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

      // Notify others in the room
      socket.to(roomId).emit("user-joined", { id: userId, username });

      // Add user to participants list
      await Room.findByIdAndUpdate(roomId, {
        $addToSet: { participants: userId },
        lastActive: new Date(),
      });

      // Handle real-time code updates
      socket.on("code-change", (code) => {
        socket.to(roomId).emit("code-update", { id: userId, code });
      });

      // Handle cursor tracking
      socket.on("cursor-move", (cursorData) => {
        socket.to(roomId).emit("cursor-move", { id: userId, ...cursorData });
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

      // Handle room leaving
      socket.on("leave-room", async () => {
        socket.leave(roomId);
        console.log(`🚪 ${username} left room ${roomId}`);

        socket.to(roomId).emit("user-left", { id: userId });

        await Room.findByIdAndUpdate(roomId, {
          $pull: { participants: userId },
        });

        // Check if room is empty before deleting
        const room = await Room.findById(roomId);
        if (room && room.participants.length === 0) {
          await Room.deleteOne({ _id: roomId });
          console.log(`🗑️ Room ${roomId} deleted.`);
        }
      });

      // Handle user disconnection
      socket.on("disconnect", async () => {
        console.log(`❌ ${username} disconnected from room ${roomId}`);
        socket.to(roomId).emit("user-left", { id: userId });

        await Room.findByIdAndUpdate(roomId, {
          $pull: { participants: userId },
        });

        // Check if room is empty before deleting
        const room = await Room.findById(roomId);
        if (room && room.participants.length === 0) {
          await Room.deleteOne({ _id: roomId });
          console.log(`🗑️ Room ${roomId} deleted.`);
        }
      });
    });
  });
};

export default socketHandler;
