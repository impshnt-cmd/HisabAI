export default function StatBlock({ label, value, tone = "ink", suffix }) {
  const toneClass = {
    ink: "text-ink",
    credit: "text-credit",
    debit: "text-debit",
    gold: "text-gold",
  }[tone];

  return (
    <div className="ledger-row py-4 flex items-baseline justify-between md:block md:py-0 md:border-0">
      <p className="text-xs uppercase tracking-wider text-inkSoft/70 mb-0 md:mb-1.5">{label}</p>
      <p className={`font-display text-2xl md:text-3xl tabular ${toneClass}`}>
        {value}
        {suffix && <span className="text-sm text-inkSoft font-body ml-1">{suffix}</span>}
      </p>
    </div>
  );
}
