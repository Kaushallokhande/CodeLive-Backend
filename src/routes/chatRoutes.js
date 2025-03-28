import express from "express";
import Message from "../models/Message.js";
import protect from "../middleware/authMiddleware.js";
import io from "../config/socket.js";


const router = express.Router();

/**
 * @route POST /api/chat/send
 * @desc Send a message to a room
 */
router.post("/send", protect, async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const userId = req.user._id; // Extract user from token

    if (!roomId || !message) {
      return res.status(400).json({ success: false, message: "Room ID and message are required" });
    }

    // Save message in DB
    const newMessage = await Message.create({
      roomId,
      sender: userId,
      message,
    });

    // Populate sender details
    await newMessage.populate("sender", "username");

    // Emit message via WebSocket
    io.to(roomId).emit("receive-message", {
      roomId,
      sender: newMessage.sender.username,
      message: newMessage.message,
      timestamp: newMessage.timestamp,
    });

    return res.status(201).json({ success: true, message: "Message sent", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ success: false, message: "Failed to send message" });
  }
});


/**
 * @route GET /api/chat/:roomId
 * @desc Fetch chat history for a room
 */
router.get("/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .populate("sender", "username")
      .sort({ timestamp: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages", error });
  }
});


export default router;

