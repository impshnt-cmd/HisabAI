import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import { inputClass } from "../components/Field.jsx";

export default function AIAssistant() {
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState("");

  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask me anything about your room's expenses — e.g. \"How much did we spend on food this month?\"" },
  ]);
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    api
      .get("/ai/analysis")
      .then((res) => setAnalysis(res.data))
      .catch((err) => setAnalysisError(err.response?.data?.message || "Could not generate analysis"))
      .finally(() => setAnalysisLoading(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const q = question;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setChatLoading(true);
    try {
      const res = await api.post("/ai/chat", { question: q });
      setMessages((m) => [...m, { role: "assistant", text: res.data.answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", text: err.response?.data?.message || "I couldn't answer that." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <Layout title="AI Assistant" subtitle="Plain-English answers about your room's spending.">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-xl mb-4">This month, at a glance</h2>
          {analysisLoading ? (
            <p className="text-sm text-inkSoft">Reading the numbers…</p>
          ) : analysisError ? (
            <p className="text-sm text-debit border border-ledger rounded p-4">{analysisError}</p>
          ) : (
            <div className="border border-ledger rounded p-5 bg-white/40">
              <p className="text-sm leading-relaxed text-inkSoft">{analysis.insight}</p>
              <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-ledger">
                <div>
                  <p className="text-xs uppercase tracking-wider text-inkSoft/70">This month</p>
                  <p className="font-display text-xl tabular">₹{analysis.currentTotal.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-inkSoft/70">Last month</p>
                  <p className="font-display text-xl tabular">₹{analysis.previousTotal.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col h-[520px]">
          <h2 className="font-display text-xl mb-4">Ask the ledger</h2>
          <div ref={scrollRef} className="flex-1 overflow-y-auto border border-ledger rounded p-4 space-y-3 bg-white/40">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3.5 py-2 rounded-lg max-w-[85%] ${
                    m.role === "user" ? "bg-ink text-paper" : "bg-paperDark text-ink"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {chatLoading && <p className="text-xs text-inkSoft">Thinking…</p>}
          </div>
          <form onSubmit={handleAsk} className="flex gap-2 mt-3">
            <input
              className={inputClass}
              placeholder="Is month humne food par kitna kharch kiya?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button type="submit" disabled={chatLoading}>Ask</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
