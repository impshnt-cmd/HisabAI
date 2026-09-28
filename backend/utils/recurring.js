import Expense from "../models/Expense.js";

/**
 * Monthly recurring expenses (rent, WiFi, electricity…).
 * A "template" is an expense saved with isRecurring=true. Once a new month
 * arrives and the template's day-of-month has been reached, a copy is created
 * for that month (linked back through parentExpense so it never duplicates).
 */
export async function generateRecurringExpenses() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const templates = await Expense.find({
    isRecurring: true,
    recurrenceInterval: "monthly",
    parentExpense: null,
    date: { $lt: monthStart },
  });

  let created = 0;
  for (const t of templates) {
    const already = await Expense.exists({
      parentExpense: t._id,
      date: { $gte: monthStart, $lt: nextMonthStart },
    });
    if (already) continue;

    const day = Math.min(t.date.getDate(), lastDay);
    if (day > now.getDate()) continue; // not due yet this month

    await Expense.create({
      room: t.room,
      paidBy: t.paidBy,
      amount: t.amount,
      category: t.category,
      description: t.description,
      date: new Date(now.getFullYear(), now.getMonth(), day),
      splitType: t.splitType,
      splitAmong: t.splitAmong.map((s) => ({ user: s.user, share: s.share })),
      isRecurring: false,
      recurrenceInterval: "none",
      parentExpense: t._id,
    });
    created++;
  }
  return created;
}

export function startRecurringJob() {
  const run = () =>
    generateRecurringExpenses()
      .then((n) => n && console.log(`Recurring job: created ${n} expense(s)`))
      .catch((e) => console.error("Recurring job failed:", e.message));
  run();
  setInterval(run, 12 * 60 * 60 * 1000);
}
