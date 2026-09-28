import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";

const COLORS = ["#1B1F3B", "#C89B3C", "#2F7A5D", "#9A3B2E", "#3A3F63", "#D8D2C2", "#8A7A4E", "#5C6180"];

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/expenses/summary").then((res) => setSummary(res.data)).finally(() => setLoading(false));
  }, []);

  const pieData = summary ? Object.entries(summary.byCategory).map(([name, value]) => ({ name, value })) : [];
  const barData = summary
    ? [
        { name: "Last month", amount: summary.previousTotal },
        { name: "This month", amount: summary.total },
      ]
    : [];

  const handlePrint = () => window.print();

  return (
    <Layout title="Reports" subtitle="This month's spending, visualized.">
      {loading ? (
        <p className="text-sm text-inkSoft">Building the charts…</p>
      ) : (
        <div className="space-y-12">
          <div className="flex justify-end print:hidden">
            <Button variant="outline" onClick={handlePrint}>
              Download / Print report (PDF)
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-xl mb-4">Spend by category</h2>
              {pieData.length === 0 ? (
                <p className="text-sm text-inkSoft border-y border-ledger py-6">No expenses logged this month yet.</p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-inkSoft flex-1 truncate">{d.name}</span>
                    <span className="tabular">₹{d.value.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl mb-4">Month over month</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid stroke="#D8D2C2" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#3A3F63" }} axisLine={{ stroke: "#D8D2C2" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#3A3F63" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
                    <Bar dataKey="amount" fill="#1B1F3B" radius={[3, 3, 0, 0]} maxBarSize={64} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {summary?.percentChange !== null && summary?.percentChange !== undefined && (
                <p className="text-sm text-inkSoft mt-4">
                  Spending is{" "}
                  <span className={summary.percentChange >= 0 ? "text-debit font-medium" : "text-credit font-medium"}>
                    {summary.percentChange >= 0 ? "up" : "down"} {Math.abs(summary.percentChange)}%
                  </span>{" "}
                  compared to last month.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
