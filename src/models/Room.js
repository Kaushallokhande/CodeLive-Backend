import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPrivate: { type: Boolean, default: false },
  password: { type: String, select: false }, // Store encrypted password
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastActive: { type: Date, default: Date.now },
});

// Hash password before saving
RoomSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Validate password method
RoomSchema.methods.validatePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Room", RoomSchema);
