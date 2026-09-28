import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", exact: true },
  { to: "/add-expense", label: "Add" },
  { to: "/history", label: "History" },
  { to: "/settlement", label: "Settle" },
  { to: "/ai-assistant", label: "AI" },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-paper border-t border-ledger flex justify-around py-2 z-20">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.exact}
          className={({ isActive }) =>
            `text-xs font-medium px-3 py-1.5 rounded ${isActive ? "text-ink font-semibold" : "text-inkSoft"}`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
