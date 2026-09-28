import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Room from "../models/Room.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, roomAction, roomName, inviteCode, monthlyBudget } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    let joinRoom = null;
    if (roomAction === "join") {
      joinRoom = inviteCode ? await Room.findOne({ inviteCode: inviteCode.toUpperCase() }) : null;
      if (!joinRoom) {
        return res.status(404).json({ message: "Invalid invite code" });
      }
    }

    const user = await User.create({ name, email, password });

    let room;
    if (roomAction === "create") {
      const code = crypto.randomBytes(3).toString("hex").toUpperCase();
      room = await Room.create({
        name: roomName || `${name}'s Room`,
        inviteCode: code,
        monthlyBudget: monthlyBudget || 0,
        members: [user._id],
        createdBy: user._id,
      });
    } else if (joinRoom) {
      room = joinRoom;
      room.members.push(user._id);
      await room.save();
    }

    if (room) {
      user.room = room._id;
      await user.save();
    }

    res.status(201).json({
      user: user.toSafeObject(),
      room,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
};
