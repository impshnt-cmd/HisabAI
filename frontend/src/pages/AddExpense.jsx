import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import Field, { inputClass } from "../components/Field.jsx";

const categories = ["Groceries", "Rent", "Electricity", "Water", "Internet", "Food", "Cleaning", "Other"];

export default function AddExpense() {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [form, setForm] = useState({
    amount: "",
    category: "Groceries",
    description: "",
    date: new Date().toISOString().split("T")[0],
    splitType: "equal",
    isRecurring: false,
  });
  const [customShares, setCustomShares] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/rooms/me").then((res) => setRoom(res.data));
  }, []);

  const handleAIParse = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await api.post("/ai/parse-expense", { text: aiText });
      setForm((f) => ({
        ...f,
        amount: res.data.amount ?? f.amount,
        category: categories.includes(res.data.category) ? res.data.category : f.category,
        description: res.data.description || f.description,
        date: res.data.date || f.date,
      }));
    } catch (err) {
      setAiError(err.response?.data?.message || "Could not read that — try filling the form below.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (form.splitType === "custom") {
        payload.splitAmong = Object.entries(customShares)
          .filter(([, v]) => Number(v) > 0)
          .map(([user, share]) => ({ user, share: Number(share) }));
      }
      await api.post("/expenses", payload);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this expense");
    } finally {
      setSubmitting(false);
    }
  };

  const customTotal = Object.values(customShares).reduce((s, v) => s + (Number(v) || 0), 0);

  return (
    <Layout title="Add an expense" subtitle="Log it once — the split works itself out.">
      <div className="max-w-xl space-y-10">
        <div className="border border-ledger rounded p-5 bg-white/40">
          <p className="text-xs uppercase tracking-wider text-inkSoft/70 mb-2">AI Expense Assistant</p>
          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder='Try "Today I spent 300 on groceries"'
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAIParse())}
            />
            <Button type="button" variant="outline" onClick={handleAIParse} disabled={aiLoading}>
              {aiLoading ? "Reading…" : "Parse"}
            </Button>
          </div>
          {aiError && <p className="text-xs text-debit mt-2">{aiError}</p>}
          <p className="text-xs text-inkSoft mt-2">Review the fields below before saving — AI fills them in, it doesn't save automatically.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount (₹)">
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className={inputClass}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description" hint="Optional">
            <input
              className={inputClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Weekly grocery run"
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>

          <Field label="Split">
            <div className="flex rounded border border-ledger overflow-hidden text-sm font-medium">
              <button
                type="button"
                onClick={() => setForm({ ...form, splitType: "equal" })}
                className={`flex-1 py-2.5 transition-colors ${form.splitType === "equal" ? "bg-ink text-paper" : "text-inkSoft"}`}
              >
                Split equally
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, splitType: "custom" })}
                className={`flex-1 py-2.5 transition-colors ${form.splitType === "custom" ? "bg-ink text-paper" : "text-inkSoft"}`}
              >
                Custom split
              </button>
            </div>
          </Field>

          {form.splitType === "custom" && room && (
            <div className="border border-ledger rounded p-4 space-y-3">
              {room.members.map((m) => (
                <div key={m._id} className="flex items-center justify-between gap-3">
                  <p className="text-sm">{m.name}</p>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`${inputClass} w-28`}
                    value={customShares[m._id] || ""}
                    onChange={(e) => setCustomShares({ ...customShares, [m._id]: e.target.value })}
                  />
                </div>
              ))}
              <p className={`text-xs ${customTotal === Number(form.amount) ? "text-credit" : "text-debit"}`}>
                Shares total ₹{customTotal} of ₹{form.amount || 0}
              </p>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-inkSoft">
            <input
              type="checkbox"
              checked={form.isRecurring}
              onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
            />
            Repeats monthly (e.g. rent, internet)
          </label>

          {error && <p className="text-sm text-debit">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full md:w-auto">
            {submitting ? "Saving…" : "Save expense"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
