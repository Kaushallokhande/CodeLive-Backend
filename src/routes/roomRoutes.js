import express from "express";
import { getUsersInRoom, joinRoom, createRoom, leaveRoom, joinRoomByQuery } from "../controllers/roomController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a room
router.post("/", protect, createRoom);

// Join a room
router.post("/join", protect, joinRoom);

router.get("/joinroom", protect, joinRoomByQuery);


// Leave a room
router.post("/leave", protect, leaveRoom);

// Get users in a room (✅ Only One Occurrence Now)
router.get("/:id/users", protect, getUsersInRoom);

export default router;
