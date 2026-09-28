import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  getSettlement,
  getMonthlySummary,
} from "../controllers/expenseController.js";
import { protect, requireRoom } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, requireRoom);

router.route("/").post(addExpense).get(getExpenses);
router.get("/settlement", getSettlement);
router.get("/summary", getMonthlySummary);
router.delete("/:id", deleteExpense);

export default router;
