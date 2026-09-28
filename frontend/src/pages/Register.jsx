import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import Field, { inputClass } from "../components/Field.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [roomAction, setRoomAction] = useState("create");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roomName: "",
    monthlyBudget: "",
    inviteCode: "",
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        roomAction,
        roomName: form.roomName,
        monthlyBudget: Number(form.monthlyBudget) || 0,
        inviteCode: form.inviteCode,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-display text-3xl leading-none">Hisab</p>
          <p className="font-display italic text-3xl leading-none text-gold -mt-1">AI</p>
          <p className="text-inkSoft text-sm mt-3">
            {step === 1 ? "Every person keeps their own login." : "Now, connect a room."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <Field label="Full name">
                <input required className={inputClass} value={form.name} onChange={update("name")} placeholder="Prashant" />
              </Field>
              <Field label="Email">
                <input type="email" required className={inputClass} value={form.email} onChange={update("email")} placeholder="you@example.com" />
              </Field>
              <Field label="Password" hint="At least 6 characters">
                <input type="password" required minLength={6} className={inputClass} value={form.password} onChange={update("password")} placeholder="••••••••" />
              </Field>
              <Button type="button" className="w-full" onClick={() => setStep(2)} disabled={!form.name || !form.email || form.password.length < 6}>
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex rounded border border-ledger overflow-hidden text-sm font-medium">
                <button type="button" onClick={() => setRoomAction("create")} className={`flex-1 py-2.5 transition-colors ${roomAction === "create" ? "bg-ink text-paper" : "text-inkSoft"}`}>
                  Create a room
                </button>
                <button type="button" onClick={() => setRoomAction("join")} className={`flex-1 py-2.5 transition-colors ${roomAction === "join" ? "bg-ink text-paper" : "text-inkSoft"}`}>
                  Join a room
                </button>
              </div>

              {roomAction === "create" ? (
                <>
                  <Field label="Room name">
                    <input required className={inputClass} value={form.roomName} onChange={update("roomName")} placeholder="Flat 4B" />
                  </Field>
                  <Field label="Monthly budget (₹)" hint="You can change this later">
                    <input type="number" min="0" className={inputClass} value={form.monthlyBudget} onChange={update("monthlyBudget")} placeholder="15000" />
                  </Field>
                </>
              ) : (
                <Field label="Invite code" hint="Ask a roommate for their room's code">
                  <input required className={`${inputClass} uppercase`} value={form.inviteCode} onChange={update("inviteCode")} placeholder="A1B2C3" />
                </Field>
              )}

              {error && <p className="text-sm text-debit">{error}</p>}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Creating…" : "Create account"}
                </Button>
              </div>
            </>
          )}
        </form>

        {step === 1 && (
          <p className="text-center text-sm text-inkSoft mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-ink font-medium underline underline-offset-2">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
