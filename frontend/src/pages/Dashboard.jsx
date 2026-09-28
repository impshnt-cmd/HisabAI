import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Layout from "../components/Layout.jsx";
import StatBlock from "../components/StatBlock.jsx";
import ExpenseRow from "../components/ExpenseRow.jsx";
import Button from "../components/Button.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get("/rooms/me"),
      api.get("/expenses"),
      api.get("/expenses/settlement"),
      api.get("/expenses/summary"),
    ])
      .then(([roomRes, expRes, settleRes, summaryRes]) => {
        if (!mounted) return;
        setRoom(roomRes.data);
        setExpenses(expRes.data);
        setSettlement(settleRes.data);
        setSummary(summaryRes.data);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const myBalance = settlement?.balances?.find((b) => b.userId === user?.id)?.balance ?? 0;
  const budgetUsed = room?.monthlyBudget ? Math.min(100, Math.round(((summary?.total || 0) / room.monthlyBudget) * 100)) : null;

  return (
    <Layout title={room ? room.name : "Dashboard"} subtitle="Your shared expense ledger, up to date.">
      {loading ? (
        <p className="text-inkSoft text-sm">Tallying the books…</p>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 border-y border-ledger py-6">
            <StatBlock label="This month's total" value={`₹${(summary?.total || 0).toLocaleString("en-IN")}`} />
            <StatBlock
              label="Your balance"
              value={`${myBalance >= 0 ? "+" : "−"}₹${Math.abs(myBalance).toLocaleString("en-IN")}`}
              tone={myBalance >= 0 ? "credit" : "debit"}
            />
            <StatBlock label="Room members" value={room?.members?.length ?? 0} />
            <StatBlock
              label="Budget used"
              value={budgetUsed !== null ? `${budgetUsed}` : "—"}
              suffix={budgetUsed !== null ? "%" : ""}
              tone={budgetUsed !== null && budgetUsed > 90 ? "debit" : "gold"}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl">Recent expenses</h2>
                <Link to="/add-expense">
                  <Button variant="outline" className="!py-2 !px-4 text-xs">
                    + Add expense
                  </Button>
                </Link>
              </div>

              {expenses.length === 0 ? (
                <p className="text-sm text-inkSoft border-y border-ledger py-6">
                  No expenses yet. The first entry starts your room's ledger.
                </p>
              ) : (
                <div>
                  {expenses.slice(0, 6).map((exp) => (
                    <ExpenseRow key={exp._id} expense={exp} currentUserId={user?.id} />
                  ))}
                </div>
              )}

              <Link to="/history" className="inline-block text-sm text-ink underline underline-offset-2 mt-4">
                View full history →
              </Link>
            </div>

            <div>
              <h2 className="font-display text-xl mb-4">Roommates' balances</h2>
              <div>
                {settlement?.balances?.map((b) => (
                  <div key={b.userId} className="ledger-row py-3 flex items-center gap-3">
                    <Avatar name={b.name} color={b.avatarColor} size={30} />
                    <p className="text-sm flex-1 truncate">{b.name}</p>
                    <p className={`text-sm font-medium tabular ${b.balance >= 0 ? "text-credit" : "text-debit"}`}>
                      {b.balance >= 0 ? "+" : "−"}₹{Math.abs(b.balance).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
              <Link to="/settlement" className="inline-block text-sm text-ink underline underline-offset-2 mt-4">
                See who owes whom →
              </Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
