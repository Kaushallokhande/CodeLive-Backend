import express from "express";
import { getUsersInRoom, joinRoom, createRoom, leaveRoom, joinRoomByQuery } from "../controllers/roomController.js";
import protect from "../middleware/authMiddleware.js";
import Room from "../models/Room.js";

const router = express.Router();

router.post("/", protect, createRoom);

router.post("/join", protect, joinRoom);

router.get("/joinroom", protect, joinRoomByQuery);

router.post("/leave", protect, leaveRoom);

router.get("/:id/users", protect, getUsersInRoom);

router.get("/:roomId", async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Room.findById(roomId);
  
      if (!room) return res.status(404).json({ message: "Room not found" });
  
      res.json({ code: room.code || "" });
    } catch (error) {
      console.error("Error fetching room code:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

export default router;
