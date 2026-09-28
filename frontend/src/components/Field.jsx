export default function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-inkSoft mt-1">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded border border-ledger bg-white/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-inkSoft/50 focus:border-ink focus:outline-none transition-colors";
