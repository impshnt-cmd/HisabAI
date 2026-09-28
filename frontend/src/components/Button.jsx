export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-ink text-paper hover:bg-inkSoft",
    outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
    ghost: "text-inkSoft hover:text-ink",
    danger: "bg-debit text-paper hover:opacity-90",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
