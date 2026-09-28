import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

const links = [
  { to: "/", label: "Dashboard", exact: true },
  { to: "/add-expense", label: "Add Expense" },
  { to: "/history", label: "History" },
  { to: "/settlement", label: "Settlement" },
  { to: "/ai-assistant", label: "AI Assistant" },
  { to: "/reports", label: "Reports" },
  { to: "/members", label: "Room" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 shrink-0 border-r border-ledger bg-paper h-screen sticky top-0">
      <div className="px-6 pt-8 pb-6">
        <p className="font-display text-xl leading-none">Hisab</p>
        <p className="font-display italic text-xl leading-none text-gold -mt-0.5">AI</p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.exact}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive ? "bg-ink text-paper" : "text-inkSoft hover:bg-paperDark"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-ledger flex items-center gap-3">
        <Avatar name={user?.name} color={user?.avatarColor} size={34} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <button onClick={logout} className="text-xs text-inkSoft hover:text-debit transition-colors">
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
