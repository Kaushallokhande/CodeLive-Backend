import Room from "../models/Room.js";
import User from "../models/User.js";

export const createRoom = async (req, res) => {
  try {
    console.log("Entered createRoom");

    const { name, isPrivate, password } = req.body;
    const createdBy = req.user._id;
    console.log("Authenticated user:", req.user);

    // Build room data; add creator as a participant
    const roomData = { name, createdBy, isPrivate, participants: [createdBy] };

    // If the room is private, ensure a password is provided
    if (isPrivate) {
      if (!password) {
        return res.status(400).json({ error: "Password is required for private rooms" });
      }
      roomData.password = password;
    }

    const room = new Room(roomData);
    console.log("Room instance created:", room);

    await room.save();
    console.log("Room saved successfully");

    return res.status(201).json({
      message: "Room created successfully",
      room: {
        id: room._id,
        name: room.name,
        isPrivate: room.isPrivate,
        participants: room.participants,
        createdBy: room.createdBy,
      },
    });
  } catch (error) {
    console.error("Error in createRoom:", error);
    return res.status(500).json({ error: "Failed to create room", details: error.message });
  }
};


export const joinRoom = async (req, res) => {
  try {
    const { roomId, password } = req.body;
    const userId = req.user._id;

    const room = await Room.findById(roomId).select("+password"); // Fetch password
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (room.isPrivate) {
      const isValid = await room.validatePassword(password);
      if (!isValid) return res.status(401).json({ error: "Invalid password" });
    }

    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
      await room.save();
    }

    return res.status(200).json({ message: "Joined room successfully", room });
  } catch (error) {
    res.status(500).json({ error: "Failed to join room" });
  }
};


// Leave Room
export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    room.participants = room.participants.filter((id) => id.toString() !== userId.toString());
    await room.save();

    return res.status(200).json({ message: "Left room successfully", room });
  } catch (error) {
    res.status(500).json({ error: "Failed to leave room" });
  }
};
export const getUsersInRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate("participants", "username email");

    if (!room) return res.status(404).json({ error: "Room not found" });

    return res.status(200).json({ users: room.participants });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};
