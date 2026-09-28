import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Settlement() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/expenses/settlement").then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Settlement" subtitle="The fewest transactions to bring everyone to zero.">
      {loading ? (
        <p className="text-inkSoft text-sm">Working it out…</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-xl mb-4">Balances</h2>
            <div>
              {data.balances.map((b) => (
                <div key={b.userId} className="ledger-row py-4 flex items-center gap-3">
                  <Avatar name={b.name} color={b.avatarColor} size={36} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-inkSoft">
                      {b.balance > 0.01 ? "is owed money" : b.balance < -0.01 ? "owes money" : "settled up"}
                    </p>
                  </div>
                  <p className={`font-display text-lg tabular ${b.balance >= 0 ? "text-credit" : "text-debit"}`}>
                    {b.balance >= 0 ? "+" : "−"}₹{Math.abs(b.balance).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl mb-4">Suggested transfers</h2>
            {data.transactions.length === 0 ? (
              <p className="text-sm text-inkSoft border-y border-ledger py-6">Everyone's already settled up.</p>
            ) : (
              <div className="space-y-3">
                {data.transactions.map((t, i) => (
                  <div key={i} className="border border-ledger rounded p-4 flex items-center gap-3">
                    <p className="text-sm flex-1">
                      <span className="font-medium">{t.fromName}</span>
                      <span className="text-inkSoft"> pays </span>
                      <span className="font-medium">{t.toName}</span>
                    </p>
                    <p className="font-display text-lg tabular text-gold">₹{t.amount.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
