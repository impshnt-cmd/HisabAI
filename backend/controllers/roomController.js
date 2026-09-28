import Room from "../models/Room.js";
import User from "../models/User.js";
import crypto from "crypto";

// @route GET /api/rooms/me
export const getMyRoom = async (req, res) => {
  const room = await Room.findById(req.user.room).populate("members", "name email avatarColor");
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
};

// @route PUT /api/rooms/budget
export const updateBudget = async (req, res) => {
  const { monthlyBudget } = req.body;
  const room = await Room.findByIdAndUpdate(
    req.user.room,
    { monthlyBudget },
    { new: true }
  ).populate("members", "name email avatarColor");
  res.json(room);
};

// @route POST /api/rooms/regenerate-code
export const regenerateInviteCode = async (req, res) => {
  const code = crypto.randomBytes(3).toString("hex").toUpperCase();
  const room = await Room.findByIdAndUpdate(
    req.user.room,
    { inviteCode: code },
    { new: true }
  );
  res.json({ inviteCode: room.inviteCode });
};

// @route DELETE /api/rooms/members/:id
export const removeMember = async (req, res) => {
  const room = await Room.findById(req.user.room);
  room.members = room.members.filter((m) => m.toString() !== req.params.id);
  await room.save();
  await User.findByIdAndUpdate(req.params.id, { room: null });
  const updated = await Room.findById(room._id).populate("members", "name email avatarColor");
  res.json(updated);
};
