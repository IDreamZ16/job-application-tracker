import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../store/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/jobs", icon: Briefcase, label: "Jobs" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-base-900 border-r border-base-700 p-4 fixed left-0 top-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8 mt-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Briefcase size={16} className="text-base-950" />
          </div>
          <span className="font-display font-bold text-slate-100 text-lg">
            Tracker
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${
                    active
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-base-700"
                  }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-base-700 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-400 text-xs font-bold font-display">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-base-900/95 backdrop-blur border-b border-base-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
            <Briefcase size={13} className="text-base-950" />
          </div>
          <span className="font-display font-bold text-slate-100">Tracker</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-ghost p-1.5"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-base-950/95 pt-16 p-4">
          <nav className="space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-base-800"
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 w-full"
            >
              <LogOut size={18} />
              <span className="font-medium">Sign out</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
