import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getInitials } from "../utils";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/projects", label: "Funds", icon: "📁" },
  { to: "/admin/categories", label: "Categories", icon: "📂" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/feedback", label: "Reviews", icon: "📝" },
];

function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isActive = (to) => pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside className="fixed top-0 left-0 w-60 h-screen bg-brand-warm border-r border-orange-100/60 flex flex-col pb-6 z-50 overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-6 border-b border-orange-100/50">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-orange to-brand-amber flex items-center justify-center text-sm">❤️</span>
          <div>
            <div className="font-serif font-bold text-brand-dark text-base leading-tight">FundTrust</div>
            <div className="text-[10px] text-brand-tan uppercase tracking-widest">Admin Panel</div>
          </div>
        </div>

        {/* User */}
        {user && (
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-orange-100/40 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange to-brand-amber flex items-center justify-center text-xs font-bold text-white shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-brand-dark truncate">{user.name}</div>
              <div className="text-[11px] text-brand-tan">Administrator</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3">
          {NAV.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} className={[
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-sm transition-all no-underline",
                "border-l-[3px]",
                active
                  ? "bg-orange-50 text-brand-burn font-bold border-brand-orange"
                  : "text-brand-brown font-medium border-transparent hover:bg-orange-50/50",
              ].join(" ")}>
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 flex flex-col gap-1.5">
          <Link to="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-brand-tan text-sm font-medium no-underline hover:bg-orange-50/50 transition-colors">
            <span>🌐</span> Visit Site
          </Link>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium cursor-pointer w-full text-left font-sans">
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      <main className="ml-60 flex-1 p-9 pb-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;