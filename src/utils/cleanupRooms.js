import Room from "../models/Room.js";

const cleanupRooms = async () => {
  try {
    const emptyRooms = await Room.find({ users: { $size: 0 } });

    if (emptyRooms.length > 0) {
      await Room.deleteMany({ users: { $size: 0 } });
      console.log(`🗑️ Removed ${emptyRooms.length} inactive rooms.`);
    }
  } catch (error) {
    console.error("❌ Room Cleanup Error:", error);
  }
};

export default cleanupRooms;
