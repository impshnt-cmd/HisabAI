import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Layout from "../components/Layout.jsx";
import ExpenseRow from "../components/ExpenseRow.jsx";

const categories = ["All", "Groceries", "Rent", "Electricity", "Water", "Internet", "Food", "Cleaning", "Other"];

export default function ExpenseHistory() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/expenses").then((res) => setExpenses(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    await api.delete(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  };

  const filtered = filter === "All" ? expenses : expenses.filter((e) => e.category === filter);

  // Group by month for a ledger-style, dated view
  const groups = filtered.reduce((acc, exp) => {
    const key = new Date(exp.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    acc[key] = acc[key] || [];
    acc[key].push(exp);
    return acc;
  }, {});

  return (
    <Layout title="Expense History" subtitle="Every entry in your room's ledger.">
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
              filter === c ? "bg-ink text-paper border-ink" : "border-ledger text-inkSoft hover:border-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-inkSoft text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-inkSoft border-y border-ledger py-6">No expenses match this filter.</p>
      ) : (
        Object.entries(groups).map(([month, items]) => (
          <div key={month} className="mb-8">
            <p className="text-xs uppercase tracking-wider text-inkSoft/70 mb-2">{month}</p>
            <div>
              {items.map((exp) => (
                <ExpenseRow key={exp._id} expense={exp} onDelete={handleDelete} currentUserId={user?.id} />
              ))}
            </div>
          </div>
        ))
      )}
    </Layout>
  );
}
