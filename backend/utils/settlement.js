// Core settlement/splitting logic — plain deterministic math, NOT AI.

/**
 * Given a list of expenses and room members, compute each member's
 * net balance (positive = should receive money, negative = owes money).
 */
export function computeBalances(expenses, members) {
  const balances = {};
  members.forEach((m) => {
    balances[m._id.toString()] = 0;
  });

  expenses.forEach((exp) => {
    const paidById = exp.paidBy._id ? exp.paidBy._id.toString() : exp.paidBy.toString();
    // Payer gets credited the full amount they paid
    balances[paidById] = (balances[paidById] || 0) + exp.amount;

    // Each participant is debited their share
    exp.splitAmong.forEach((s) => {
      const uid = s.user._id ? s.user._id.toString() : s.user.toString();
      balances[uid] = (balances[uid] || 0) - s.share;
    });
  });

  // Round to 2 decimals to avoid floating point noise
  Object.keys(balances).forEach((k) => {
    balances[k] = Math.round(balances[k] * 100) / 100;
  });

  return balances;
}

/**
 * Greedy minimum-transaction settlement algorithm.
 * Matches the biggest debtor with the biggest creditor repeatedly.
 */
export function simplifySettlements(balances, memberMap) {
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([userId, amount]) => {
    if (amount > 0.01) creditors.push({ userId, amount });
    else if (amount < -0.01) debtors.push({ userId, amount: -amount });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settledAmount = Math.min(debtor.amount, creditor.amount);

    transactions.push({
      from: debtor.userId,
      fromName: memberMap[debtor.userId]?.name || "Unknown",
      to: creditor.userId,
      toName: memberMap[creditor.userId]?.name || "Unknown",
      amount: Math.round(settledAmount * 100) / 100,
    });

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return transactions;
}

/**
 * Build the splitAmong array for equal splitting.
 */
export function buildEqualSplit(amount, memberIds) {
  const n = memberIds.length;
  const base = Math.floor((amount / n) * 100) / 100;
  const remainder = Math.round((amount - base * n) * 100) / 100;

  return memberIds.map((id, idx) => ({
    user: id,
    share: idx === 0 ? Math.round((base + remainder) * 100) / 100 : base,
  }));
}
