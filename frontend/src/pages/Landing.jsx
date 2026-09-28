import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const inr = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Logo({ light = true }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="w-8 h-8 rounded-lg bg-gold text-night grid place-items-center font-display font-semibold text-lg leading-none">
        ₹
      </span>
      <span className={`font-display text-2xl leading-none ${light ? "text-paper" : "text-ink"}`}>
        Hisab<span className="italic text-gold">AI</span>
      </span>
    </span>
  );
}

function SectionLabel({ children, light }) {
  return (
    <p className={`text-xs uppercase tracking-[0.2em] font-medium mb-4 ${light ? "text-gold" : "text-gold"}`}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const links = [
    ["Features", "#features"],
    ["Live demo", "#demo"],
    ["AI", "#ai"],
    ["FAQ", "#faq"],
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled || open ? "bg-night/85 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="#top" aria-label="HisabAI home">
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-paper/70 hover:text-paper transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-paper/80 hover:text-paper px-3 py-2 transition-colors">
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-gold text-night px-4 py-2 rounded-full hover:bg-[#d8ac4d] transition-colors"
          >
            Get started
          </Link>
        </div>

        <button
          className="md:hidden text-paper/90 text-sm px-3 py-2 border border-white/15 rounded-full"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-6 pt-2 space-y-1">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 text-paper/80 border-b border-white/10"
            >
              {label}
            </a>
          ))}
          <div className="flex gap-3 pt-4">
            <Link to="/login" className="flex-1 text-center py-3 rounded-full border border-white/20 text-paper text-sm">
              Sign in
            </Link>
            <Link to="/register" className="flex-1 text-center py-3 rounded-full bg-gold text-night text-sm font-medium">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function PhoneMock() {
  const rows = [
    ["Groceries", "Prashant paid", "₹500"],
    ["Doodh", "Rahul paid", "₹200"],
    ["Bijli bill", "Aman paid", "₹1,800"],
  ];
  return (
    <div className="relative mx-auto w-[290px]">
      <div className="absolute -inset-10 rounded-full bg-gold/25 blur-3xl animate-glow" aria-hidden />

      <div className="relative w-[290px] rounded-[2.6rem] border-[7px] border-[#20265a] bg-paper overflow-hidden shadow-[0_50px_120px_-30px_rgba(200,155,60,0.45)]">
        <div className="bg-ink text-paper px-5 pt-7 pb-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-paper/50">Flat 4B · This month</p>
          <p className="font-display text-[34px] leading-none mt-2 tabular">₹12,000</p>
          <p className="text-xs text-paper/60 mt-1.5">
            spent · <span className="text-gold">66.7% of budget</span>
          </p>
          <div className="h-1.5 rounded-full bg-white/10 mt-3">
            <div className="h-full w-[66.7%] rounded-full bg-gold" />
          </div>
        </div>

        <div className="px-5 pt-3">
          {rows.map(([title, sub, amt]) => (
            <div key={title} className="flex items-center justify-between py-3 border-b border-ledger/70 last:border-0">
              <div>
                <p className="text-[13px] font-medium text-ink">{title}</p>
                <p className="text-[11px] text-inkSoft">{sub}</p>
              </div>
              <p className="font-display text-[15px] text-ink tabular">{amt}</p>
            </div>
          ))}
        </div>

        <div className="mx-5 mt-2 mb-4 rounded-lg bg-creditSoft px-3.5 py-3 flex items-center justify-between">
          <p className="text-[11px] text-credit font-medium">Aapko milne hain</p>
          <p className="font-display text-lg text-credit tabular">+₹300</p>
        </div>

        <div className="px-5 pb-6">
          <div className="rounded-lg bg-ink text-paper text-center text-xs font-medium py-3">+ Add expense</div>
        </div>
      </div>

      <div className="absolute -left-14 top-24 hidden sm:block animate-float">
        <div className="rounded-xl bg-night2/95 border border-white/10 backdrop-blur px-3.5 py-2.5 shadow-2xl">
          <p className="text-[10px] uppercase tracking-widest text-gold">AI detected</p>
          <p className="text-xs text-paper mt-0.5">Groceries · ₹300 · Aaj</p>
        </div>
      </div>

      <div className="absolute -right-12 bottom-28 hidden sm:block animate-floatSlow">
        <div className="rounded-xl bg-night2/95 border border-white/10 backdrop-blur px-3.5 py-2.5 shadow-2xl">
          <p className="text-[10px] uppercase tracking-widest text-emerald-300">Settled</p>
          <p className="text-xs text-paper mt-0.5">Aman → Prashant · ₹100</p>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative bg-night text-paper overflow-hidden">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-night2 blur-3xl opacity-80" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-32 pb-20 md:pt-40 md:pb-28 grid md:grid-cols-[1.15fr_1fr] gap-16 items-center">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-paper/80">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              AI-powered · Roommates ke liye bana
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-[44px] leading-[1.05] sm:text-6xl md:text-7xl mt-6 tracking-tight">
              Roommates ka hisab,
              <br />
              ab bilkul <span className="italic text-gradient-gold">automatic.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-paper/70 text-lg leading-relaxed mt-6 max-w-xl">
              Kisne kitna diya, kisko kitna dena hai — HisabAI sab kuch khud calculate karta hai. Bas bolo{" "}
              <span className="text-paper">“aaj 300 ki groceries li”</span> aur baaki hum sambhal lenge.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex flex-wrap items-center gap-4 mt-9">
              <Link
                to="/register"
                className="rounded-full bg-gold text-night font-medium px-7 py-3.5 hover:bg-[#d8ac4d] transition-colors"
              >
                Apna room banao
              </Link>
              <a
                href="#demo"
                className="rounded-full border border-white/20 text-paper px-7 py-3.5 hover:bg-white/10 transition-colors"
              >
                Live demo dekho
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-12 text-sm text-paper/60">
              <span>✓ Har roommate ka alag login</span>
              <span>✓ Kam se kam transactions</span>
              <span>✓ Math AI nahi, pakka logic</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="flex justify-center md:justify-end">
          <PhoneMock />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ticker                                                              */
/* ------------------------------------------------------------------ */

function Ticker() {
  const items = ["Room rent", "Groceries", "Bijli bill", "Doodh", "WiFi", "Khaana", "Gas cylinder", "Maid", "Cleaning", "Paani"];
  const row = [...items, ...items];
  return (
    <div className="bg-night2 border-y border-white/10 overflow-hidden py-4" aria-hidden>
      <div className="flex w-max animate-marquee gap-10 text-paper/50 font-display italic text-xl whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="text-gold not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive demo — same greedy algorithm as backend/utils/settlement */
/* ------------------------------------------------------------------ */

const NAMES = ["Prashant", "Rahul", "Aman", "Rohit"];
const COLORS = ["#1B1F3B", "#2F7A5D", "#C89B3C", "#9A3B2E"];

function Demo() {
  const [paid, setPaid] = useState([500, 200, 100, 0]);

  const { total, share, balances, transfers } = useMemo(() => {
    const total = paid.reduce((a, b) => a + b, 0);
    const share = total / paid.length;
    const balances = paid.map((p) => Math.round((p - share) * 100) / 100);

    const creditors = [];
    const debtors = [];
    balances.forEach((b, i) => {
      if (b > 0.01) creditors.push({ i, a: b });
      else if (b < -0.01) debtors.push({ i, a: -b });
    });
    creditors.sort((x, y) => y.a - x.a);
    debtors.sort((x, y) => y.a - x.a);

    const transfers = [];
    let d = 0;
    let c = 0;
    while (d < debtors.length && c < creditors.length) {
      const m = Math.min(debtors[d].a, creditors[c].a);
      transfers.push({ from: debtors[d].i, to: creditors[c].i, amt: Math.round(m * 100) / 100 });
      debtors[d].a -= m;
      creditors[c].a -= m;
      if (debtors[d].a < 0.01) d++;
      if (creditors[c].a < 0.01) c++;
    }
    return { total, share, balances, transfers };
  }, [paid]);

  const setOne = (i, v) => {
    const n = Math.max(0, Number(v) || 0);
    setPaid((p) => p.map((x, idx) => (idx === i ? n : x)));
  };

  return (
    <section id="demo" className="bg-paper py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Reveal>
          <SectionLabel>Live demo</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl max-w-2xl leading-tight">
            Khud try karo. Amount badlo, <span className="italic">hisab turant</span> badlega.
          </h2>
          <p className="text-inkSoft mt-4 max-w-xl">
            Ye wahi logic hai jo app ke andar chalta hai — equal split, aur sabko settle karne ke liye minimum transfers.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid lg:grid-cols-[1.1fr_1fr] gap-6">
            <div className="rounded-3xl bg-white/70 border border-ledger p-6 md:p-8 shadow-soft">
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-xs uppercase tracking-widest text-inkSoft/70">Kisne kitna diya</p>
                <p className="text-xs text-inkSoft">
                  Total <span className="font-medium text-ink tabular">{inr(total)}</span> · Per head{" "}
                  <span className="font-medium text-ink tabular">{inr(share)}</span>
                </p>
              </div>

              {NAMES.map((name, i) => {
                const b = balances[i];
                return (
                  <div key={name} className="flex items-center gap-3 py-4 border-b border-ledger/70 last:border-0">
                    <span
                      className="w-9 h-9 rounded-full grid place-items-center text-paper font-display shrink-0"
                      style={{ backgroundColor: COLORS[i] }}
                    >
                      {name[0]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{name}</p>
                      <p className={`text-xs tabular ${b > 0.01 ? "text-credit" : b < -0.01 ? "text-debit" : "text-inkSoft"}`}>
                        {b > 0.01 ? `Milne hain ${inr(b)}` : b < -0.01 ? `Dene hain ${inr(-b)}` : "Barabar"}
                      </p>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-inkSoft text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        inputMode="decimal"
                        aria-label={`${name} paid`}
                        value={paid[i]}
                        onChange={(e) => setOne(i, e.target.value)}
                        className="w-28 rounded-lg border border-ledger bg-paper pl-7 pr-3 py-2 text-sm tabular focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-3xl bg-night text-paper p-6 md:p-8 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gold/20 blur-3xl" aria-hidden />
              <p className="relative text-xs uppercase tracking-widest text-gold mb-5">Suggested transfers</p>

              {transfers.length === 0 ? (
                <p className="relative text-paper/70 text-sm py-6">Sab barabar hai — kisi ko kuch dena nahi. 🎉</p>
              ) : (
                <div className="relative space-y-3">
                  {transfers.map((t, i) => (
                    <div
                      key={`${t.from}-${t.to}-${i}`}
                      className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3.5"
                    >
                      <p className="text-sm flex-1">
                        <span className="font-medium">{NAMES[t.from]}</span>
                        <span className="text-paper/50"> → </span>
                        <span className="font-medium">{NAMES[t.to]}</span>
                      </p>
                      <p className="font-display text-xl text-gradient-gold tabular">{inr(t.amt)}</p>
                    </div>
                  ))}
                </div>
              )}

              <p className="relative text-xs text-paper/50 mt-6 leading-relaxed">
                {NAMES.length} log, sirf {transfers.length} transfer{transfers.length === 1 ? "" : "s"}. Har baar minimum
                transactions mein hisab clear.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features (bento)                                                    */
/* ------------------------------------------------------------------ */

function Features() {
  const items = [
    {
      glyph: "AI",
      title: "Bolo aur expense add",
      text: "“Aaj 300 ki groceries li” likho. Amount, category aur date apne aap bhar jaate hain — save karne se pehle tum confirm karte ho.",
      span: "md:col-span-2",
      dark: true,
    },
    { glyph: "÷", title: "Equal ya custom split", text: "Sabme barabar baanto ya sirf selected roommates mein, apne hisab se." },
    { glyph: "⇄", title: "Minimum transfers", text: "Kam se kam payments mein sabka balance zero — chaar log, zyada se zyada teen transfer." },
    { glyph: "↻", title: "Recurring bills", text: "Rent, WiFi ya bijli — ek baar set karo, har mahine khud add ho jaata hai." },
    {
      glyph: "◎",
      title: "Budget planner",
      text: "Room ka monthly budget set karo aur dekho kitna use hua, kitna bacha — AI batayega bacha hua kaise sambhalna hai.",
      span: "md:col-span-2",
    },
    { glyph: "▤", title: "Monthly insights", text: "Kis category mein sabse zyada kharch, pichhle mahine se kitna zyada — charts aur AI summary ke saath." },
    { glyph: "?", title: "Ledger se poocho", text: "“Is month food pe kitna gaya?” — chatbot tumhare room ke asli data se jawab deta hai." },
    { glyph: "⬇", title: "PDF reports", text: "Mahine ki report ek tap mein download ya share karo." },
  ];

  return (
    <section id="features" className="bg-paperDark/60 py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Reveal>
          <SectionLabel>Features</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl max-w-2xl leading-tight">
            Ek app, <span className="italic">poore room</span> ka hisab.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mt-12">
          {items.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className={f.span || ""}>
              <div
                className={`h-full rounded-3xl p-7 border transition-transform duration-300 hover:-translate-y-1 ${
                  f.dark ? "bg-night text-paper border-night" : "bg-white/70 border-ledger text-ink"
                }`}
              >
                <span
                  className={`inline-grid place-items-center w-11 h-11 rounded-xl font-mono text-sm font-semibold ${
                    f.dark ? "bg-gold text-night" : "bg-goldSoft text-gold"
                  }`}
                >
                  {f.glyph}
                </span>
                <h3 className="font-display text-2xl mt-5">{f.title}</h3>
                <p className={`text-sm leading-relaxed mt-2 ${f.dark ? "text-paper/70" : "text-inkSoft"}`}>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* AI section                                                          */
/* ------------------------------------------------------------------ */

function AISection() {
  return (
    <section id="ai" className="relative bg-night text-paper py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <SectionLabel light>AI assistant</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            AI ko likhna aata hai. <span className="italic text-gradient-gold">Hisab</span> sirf pakka logic karta hai.
          </h2>
          <p className="text-paper/70 mt-5 leading-relaxed max-w-lg">
            AI sirf tumhari baat samajhta hai — amount, category, date nikaalta hai aur summary likhta hai. Splitting aur
            settlement ki calculation normal code se hoti hai, isliye har paisa sahi rehta hai.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-paper/80">
            <li>• Save se pehle tum details confirm karte ho</li>
            <li>• Jawab sirf tumhare room ke asli expenses se aate hain</li>
            <li>• Hindi, English ya Hinglish — jaise bolte ho waise likho</li>
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="space-y-5">
            <div className="rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-3">Natural language entry · sample</p>
              <div className="rounded-xl bg-night/70 border border-white/10 px-4 py-3 text-sm text-paper/90">
                Aaj groceries pe 300 rupaye kharch kiye
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  ["Amount", "₹300"],
                  ["Category", "Groceries"],
                  ["Paid by", "Aap"],
                  ["Date", "Aaj"],
                ].map(([k, v]) => (
                  <span key={k} className="rounded-full bg-gold/15 border border-gold/30 px-3 py-1.5 text-xs">
                    <span className="text-paper/50">{k}: </span>
                    <span className="text-gold font-medium">{v}</span>
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-gold text-night text-center text-sm font-medium py-2.5">Confirm &amp; save</div>
            </div>

            <div className="rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur p-6 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-paper/40">Ask the ledger · sample</p>
              <div className="text-right">
                <span className="inline-block bg-paper text-ink rounded-2xl rounded-br-md px-4 py-2 text-sm">
                  Is month khaane pe kitna kharch hua?
                </span>
              </div>
              <div>
                <span className="inline-block bg-white/10 rounded-2xl rounded-bl-md px-4 py-2 text-sm text-paper/90 max-w-[90%]">
                  Is mahine khaane par ₹2,450 gaye hain, jo pichhle mahine se thoda zyada hai. Weekend orders kam karne
                  se bachat ho sakti hai.
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    ["01", "Room banao", "Register karo, room ka naam aur budget daalo. Ek invite code milega."],
    ["02", "Roommates ko jodo", "Code share karo. Har roommate apne login se join karta hai — sabko dikhta hai kisne kya diya."],
    ["03", "Kharch daalte jao", "Type karo ya bolo. Balance aur settlement apne aap update hote rehte hain."],
  ];
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Reveal>
          <SectionLabel>Kaise kaam karta hai</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl max-w-2xl leading-tight">
            Teen step. <span className="italic">Bas.</span>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {steps.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 100}>
              <p className="font-display text-6xl text-gradient-gold leading-none">{n}</p>
              <h3 className="font-display text-2xl mt-4">{t}</h3>
              <p className="text-inkSoft text-sm leading-relaxed mt-2">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust band                                                          */
/* ------------------------------------------------------------------ */

function TrustBand() {
  const facts = [
    ["Pakka logic", "Splitting aur settlement code se hoti hai, AI se nahi — isliye calculation hamesha exact."],
    ["Alag login", "Har roommate ka apna account. Password encrypted (bcrypt) aur sessions JWT se secure."],
    ["Android + iOS", "Ek hi codebase se asli mobile app — phone pe install karo, jab chahe khol lo."],
  ];
  return (
    <section className="bg-paperDark/60 border-y border-ledger">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-3 gap-10">
        {facts.map(([t, d], i) => (
          <Reveal key={t} delay={i * 90}>
            <p className="font-display text-2xl">{t}</p>
            <p className="text-sm text-inkSoft leading-relaxed mt-2">{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

function FAQ() {
  const qs = [
    ["Kya calculation AI karta hai?", "Nahi. Splitting, balances aur settlement plain backend logic se hote hain. AI sirf sentence samajhne aur summary likhne ke liye hai."],
    ["AI ne galat amount pakad liya toh?", "Kuch save nahi hota jab tak tum confirm na karo. AI form bhar deta hai, tum check karke save karte ho."],
    ["Kya sabko alag account banana padega?", "Haan, aur yehi better hai — isse pata chalta hai kisne expense add kiya. Room ke invite code se sab ek room mein judte hain."],
    ["Custom split kaise hota hai?", "Expense add karte waqt “Custom split” chuno aur har roommate ka hissa daalo — jaise sirf 3 log ne khaana khaya ho."],
    ["Kya ye mobile app hai?", "Haan — Android aur iOS dono ke liye. Web browser mein bhi chalta hai."],
  ];
  return (
    <section id="faq" className="bg-paper py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <Reveal>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">Aksar poochhe jaane wale sawaal</h2>
        </Reveal>
        <div className="mt-10 border-t border-ledger">
          {qs.map(([q, a]) => (
            <details key={q} className="group border-b border-ledger">
              <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer">
                <span className="font-medium">{q}</span>
                <span className="text-gold text-2xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-inkSoft text-sm leading-relaxed pb-5 pr-8">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA + footer                                                  */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="relative bg-night text-paper overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-70" aria-hidden />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-48 w-[700px] h-[400px] rounded-full bg-gold/25 blur-3xl" aria-hidden />
      <div className="relative max-w-3xl mx-auto px-5 md:px-8 py-24 md:py-32 text-center">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Ab <span className="italic text-gradient-gold">“tune kitna diya?”</span> wali bahes band.
          </h2>
          <p className="text-paper/70 mt-5">Room banao, roommates ko jodo, aur hisab HisabAI pe chhod do.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-9">
            <Link to="/register" className="rounded-full bg-gold text-night font-medium px-8 py-3.5 hover:bg-[#d8ac4d] transition-colors">
              Shuru karo
            </Link>
            <Link to="/login" className="rounded-full border border-white/20 px-8 py-3.5 hover:bg-white/10 transition-colors">
              Sign in
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-night text-paper/60 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-5 text-sm">
        <Logo />
        <p>© {new Date().getFullYear()} HisabAI. Roommates ka hisab, saaf.</p>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-paper transition-colors">Features</a>
          <a href="#demo" className="hover:text-paper transition-colors">Demo</a>
          <a href="#faq" className="hover:text-paper transition-colors">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

export default function Landing() {
  return (
    <div className="bg-night">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Demo />
        <Features />
        <AISection />
        <HowItWorks />
        <TrustBand />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
