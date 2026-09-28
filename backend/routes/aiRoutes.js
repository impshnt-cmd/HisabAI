import express from "express";
import { parseExpense, monthlyAnalysis, chatWithRoomData } from "../controllers/aiController.js";
import { protect, requireRoom } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, requireRoom);

router.post("/parse-expense", parseExpense);
router.get("/analysis", monthlyAnalysis);
router.post("/chat", chatWithRoomData);

export default router;
