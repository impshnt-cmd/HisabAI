import express from "express";
import { getMyRoom, updateBudget, regenerateInviteCode, removeMember } from "../controllers/roomController.js";
import { protect, requireRoom } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, requireRoom);

router.get("/me", getMyRoom);
router.put("/budget", updateBudget);
router.post("/regenerate-code", regenerateInviteCode);
router.delete("/members/:id", removeMember);

export default router;
