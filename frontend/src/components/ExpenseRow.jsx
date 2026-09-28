import Avatar from "./Avatar.jsx";

const categoryTint = {
  Groceries: "bg-creditSoft text-credit",
  Rent: "bg-goldSoft text-gold",
  Electricity: "bg-debitSoft text-debit",
  Water: "bg-creditSoft text-credit",
  Internet: "bg-goldSoft text-gold",
  Food: "bg-debitSoft text-debit",
  Cleaning: "bg-creditSoft text-credit",
  Other: "bg-paperDark text-inkSoft",
};

export default function ExpenseRow({ expense, onDelete, currentUserId }) {
  const date = new Date(expense.date);
  const canDelete = expense.paidBy?._id === currentUserId;

  return (
    <div className="ledger-row py-4 flex items-center gap-4">
      <Avatar name={expense.paidBy?.name} color={expense.paidBy?.avatarColor} size={38} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm truncate">{expense.description || expense.category}</p>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${categoryTint[expense.category] || categoryTint.Other}`}>
            {expense.category}
          </span>
        </div>
        <p className="text-xs text-inkSoft mt-0.5">
          Paid by {expense.paidBy?.name} · {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </p>
      </div>

      <p className="font-display text-lg tabular shrink-0">₹{expense.amount.toLocaleString("en-IN")}</p>

      {onDelete && canDelete && (
        <button
          onClick={() => onDelete(expense._id)}
          className="text-inkSoft hover:text-debit text-xs shrink-0 transition-colors"
          aria-label="Delete expense"
        >
          Remove
        </button>
      )}
    </div>
  );
}
