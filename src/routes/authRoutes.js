import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Generate JWT Token
const generateToken = (user) => {

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ username, email, password });
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user)
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Server Error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user)
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
