import { GoogleGenerativeAI } from "@google/generative-ai";
import Expense from "../models/Expense.js";
import Room from "../models/Room.js";

let _genAI = null;
const getGenAI = () => {
  if (!_genAI && process.env.GEMINI_API_KEY) {
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _genAI;
};

// Model is configurable so you can switch without code changes (set GEMINI_MODEL in .env)
const getModel = () =>
  getGenAI().getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });

// @route POST /api/ai/parse-expense
// Turns a natural language sentence into structured expense fields.
// NOTE: AI only extracts fields — splitting/settlement math is handled by utils/settlement.js
export const parseExpense = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "text is required" });

    if (!getGenAI()) {
      return res.status(503).json({ message: "AI is not configured. Add GEMINI_API_KEY to your .env" });
    }

    const model = getModel();
    const prompt = `Extract expense details from this sentence and respond ONLY with raw JSON, no markdown, no backticks:
{"amount": number, "category": one of ["Groceries","Rent","Electricity","Water","Internet","Food","Cleaning","Other"], "description": string, "date": "YYYY-MM-DD or null"}

Sentence: "${text}"
Today's date: ${new Date().toISOString().split("T")[0]}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ message: "Could not parse expense", error: err.message });
  }
};

// @route GET /api/ai/analysis
export const monthlyAnalysis = async (req, res) => {
  try {
    if (!getGenAI()) {
      return res.status(503).json({ message: "AI is not configured. Add GEMINI_API_KEY to your .env" });
    }

    const room = await Room.findById(req.user.room).populate("members", "name");
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [current, previous] = await Promise.all([
      Expense.find({ room: room._id, date: { $gte: start } }).populate("paidBy", "name"),
      Expense.find({ room: room._id, date: { $gte: prevStart, $lt: start } }),
    ]);

    const currentTotal = current.reduce((s, e) => s + e.amount, 0);
    const previousTotal = previous.reduce((s, e) => s + e.amount, 0);

    const byCategory = {};
    current.forEach((e) => (byCategory[e.category] = (byCategory[e.category] || 0) + e.amount));

    const model = getModel();
    const prompt = `You are a helpful budgeting assistant for a shared living room called "${room.name}".
Monthly budget: ₹${room.monthlyBudget}.
This month's total spend: ₹${currentTotal}.
Last month's total spend: ₹${previousTotal}.
Spend by category this month: ${JSON.stringify(byCategory)}.
Room members: ${room.members.map((m) => m.name).join(", ")}.

Write a short, friendly 3-4 sentence analysis in plain English covering: overall trend vs last month, the top spending category, and one concrete money-saving suggestion. Do not use markdown formatting.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      insight: text,
      currentTotal,
      previousTotal,
      byCategory,
      budget: room.monthlyBudget,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not generate analysis", error: err.message });
  }
};

// @route POST /api/ai/chat
// Simple Q&A chatbot grounded in this room's actual expense data.
export const chatWithRoomData = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "question is required" });

    if (!getGenAI()) {
      return res.status(503).json({ message: "AI is not configured. Add GEMINI_API_KEY to your .env" });
    }

    const room = await Room.findById(req.user.room).populate("members", "name");
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1); // last ~3 months of context

    const expenses = await Expense.find({ room: room._id, date: { $gte: start } })
      .populate("paidBy", "name")
      .sort({ date: -1 })
      .limit(200);

    const dataSummary = expenses.map(
      (e) => `${e.date.toISOString().split("T")[0]} | ${e.category} | ₹${e.amount} | paid by ${e.paidBy?.name} | ${e.description || ""}`
    ).join("\n");

    const model = getModel();
    const prompt = `You are an expense assistant for a shared room. Answer the user's question using ONLY the expense data below. Be concise (2-3 sentences), use ₹ for currency, and if the data doesn't answer the question, say so honestly.

Expense data (recent months):
${dataSummary || "No expenses recorded yet."}

Question: "${question}"`;

    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text() });
  } catch (err) {
    res.status(500).json({ message: "Could not answer question", error: err.message });
  }
};
