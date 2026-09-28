import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Layout from "../components/Layout.jsx";
import Avatar from "../components/Avatar.jsx";
import Button from "../components/Button.jsx";
import { inputClass } from "../components/Field.jsx";

export default function RoomMembers() {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/rooms/me").then((res) => {
    setRoom(res.data);
    setBudgetInput(res.data.monthlyBudget);
  });

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleBudgetSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/rooms/budget", { monthlyBudget: Number(budgetInput) });
      setRoom(res.data);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    const res = await api.post("/rooms/regenerate-code");
    setRoom((r) => ({ ...r, inviteCode: res.data.inviteCode }));
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this roommate from the room?")) return;
    const res = await api.delete(`/rooms/members/${id}`);
    setRoom(res.data);
  };

  if (loading || !room) {
    return (
      <Layout title="Room">
        <p className="text-sm text-inkSoft">Loading…</p>
      </Layout>
    );
  }

  return (
    <Layout title={room.name} subtitle="Manage your room's members and budget.">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-xl mb-4">Roommates</h2>
          <div>
            {room.members.map((m) => (
              <div key={m._id} className="ledger-row py-4 flex items-center gap-3">
                <Avatar name={m.name} color={m.avatarColor} size={38} />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {m.name} {m._id === user?.id && <span className="text-inkSoft font-normal">(you)</span>}
                  </p>
                  <p className="text-xs text-inkSoft">{m.email}</p>
                </div>
                {m._id !== user?.id && (
                  <button onClick={() => handleRemove(m._id)} className="text-xs text-inkSoft hover:text-debit transition-colors">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border border-ledger rounded p-5 bg-white/40">
            <p className="text-xs uppercase tracking-wider text-inkSoft/70 mb-2">Invite code</p>
            <div className="flex items-center gap-3">
              <p className="font-mono text-2xl tracking-widest">{room.inviteCode}</p>
              <Button variant="ghost" className="!px-2 text-xs" onClick={handleRegenerate}>
                Regenerate
              </Button>
            </div>
            <p className="text-xs text-inkSoft mt-2">Share this code so a roommate can join during registration.</p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl mb-4">Monthly budget</h2>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-ink mb-1.5">Amount (₹)</label>
              <input type="number" min="0" className={inputClass} value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} />
            </div>
            <Button onClick={handleBudgetSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
          <p className="text-xs text-inkSoft mt-2">
            Used across the room's dashboard and AI analysis to track how much of the budget is left each month.
          </p>
        </div>
      </div>
    </Layout>
  );
}
