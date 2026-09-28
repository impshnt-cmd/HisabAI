import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Groceries", "Rent", "Electricity", "Water", "Internet", "Food", "Cleaning", "Other"],
      default: "Other",
    },
    description: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
    splitType: { type: String, enum: ["equal", "custom"], default: "equal" },
    // splitAmong: array of { user, share } — share is the amount that member owes for this expense
    splitAmong: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        share: { type: Number },
      },
    ],
    isRecurring: { type: Boolean, default: false },
    recurrenceInterval: { type: String, enum: ["monthly", "none"], default: "none" },
    parentExpense: { type: mongoose.Schema.Types.ObjectId, ref: "Expense", default: null },
    createdByAI: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
