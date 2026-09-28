import Expense from "../models/Expense.js";
import Room from "../models/Room.js";
import { computeBalances, simplifySettlements, buildEqualSplit } from "../utils/settlement.js";

// @route POST /api/expenses
export const addExpense = async (req, res) => {
  try {
    const { amount, category, description, date, splitType, splitAmong, isRecurring } = req.body;
    const room = await Room.findById(req.user.room);

    let finalSplit;
    if (splitType === "custom" && Array.isArray(splitAmong) && splitAmong.length > 0) {
      finalSplit = splitAmong;
    } else {
      finalSplit = buildEqualSplit(amount, room.members.map((m) => m.toString()));
    }

    const expense = await Expense.create({
      room: room._id,
      paidBy: req.user._id,
      amount,
      category,
      description,
      date: date || Date.now(),
      splitType: splitType || "equal",
      splitAmong: finalSplit,
      isRecurring: !!isRecurring,
      recurrenceInterval: isRecurring ? "monthly" : "none",
    });

    const populated = await expense.populate("paidBy", "name avatarColor");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/expenses
export const getExpenses = async (req, res) => {
  const { month, year } = req.query;
  const filter = { room: req.user.room };

  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);
    filter.date = { $gte: start, $lt: end };
  }

  const expenses = await Expense.find(filter)
    .populate("paidBy", "name avatarColor")
    .populate("splitAmong.user", "name avatarColor")
    .sort({ date: -1 });

  res.json(expenses);
};

// @route DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  await Expense.findOneAndDelete({ _id: req.params.id, room: req.user.room });
  res.json({ message: "Expense deleted" });
};

// @route GET /api/expenses/settlement
export const getSettlement = async (req, res) => {
  const room = await Room.findById(req.user.room).populate("members", "name email avatarColor");
  const expenses = await Expense.find({ room: room._id })
    .populate("paidBy", "name")
    .populate("splitAmong.user", "name");

  const balances = computeBalances(expenses, room.members);

  const memberMap = {};
  room.members.forEach((m) => (memberMap[m._id.toString()] = { name: m.name }));

  const transactions = simplifySettlements({ ...balances }, memberMap);

  const balanceList = room.members.map((m) => ({
    userId: m._id,
    name: m.name,
    avatarColor: m.avatarColor,
    balance: balances[m._id.toString()] || 0,
  }));

  res.json({ balances: balanceList, transactions });
};

// @route GET /api/expenses/summary
export const getMonthlySummary = async (req, res) => {
  const { month, year } = req.query;
  const now = new Date();
  const targetMonth = month ? Number(month) - 1 : now.getMonth();
  const targetYear = year ? Number(year) : now.getFullYear();

  const start = new Date(targetYear, targetMonth, 1);
  const end = new Date(targetYear, targetMonth + 1, 1);
  const prevStart = new Date(targetYear, targetMonth - 1, 1);
  const prevEnd = start;

  const [current, previous] = await Promise.all([
    Expense.find({ room: req.user.room, date: { $gte: start, $lt: end } }),
    Expense.find({ room: req.user.room, date: { $gte: prevStart, $lt: prevEnd } }),
  ]);

  const sumBy = (list) => {
    const total = list.reduce((s, e) => s + e.amount, 0);
    const byCategory = {};
    list.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    return { total, byCategory };
  };

  const currentSummary = sumBy(current);
  const previousSummary = sumBy(previous);

  const percentChange =
    previousSummary.total > 0
      ? Math.round(((currentSummary.total - previousSummary.total) / previousSummary.total) * 100)
      : null;

  res.json({
    total: currentSummary.total,
    byCategory: currentSummary.byCategory,
    previousTotal: previousSummary.total,
    percentChange,
  });
};
