import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  BarChart3, 
  Users, 
  Package, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  Bell
} from "lucide-react";

const MainLayout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navLinks = [
    { name: "Inventory", path: "/items", icon: <Package size={18} /> },
    { name: "Customers", path: "/customers", icon: <Users size={18} /> },
    { name: "Sales", path: "/sales", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                  <LayoutDashboard size={24} />
                </div>
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  InvenTrack
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                      ${isActive 
                        ? "bg-blue-50 text-blue-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }
                    `}
                  >
                    {link.icon}
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Actions */}
              <div className="hidden sm:flex items-center gap-2 mr-4 text-slate-400">
                 <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                 </button>
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 pl-3 pr-2 py-1.5 bg-slate-100/50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all active:scale-95"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || "User"}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} size={16} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 py-2.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">User Profile</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                    </div>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
                      <UserIcon size={18} />
                      Account Settings
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all border-t border-slate-50 mt-1"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav (Scrolled) - Simple version for small screens */}
        <div className="md:hidden flex items-center justify-around py-3 border-t border-slate-100 bg-white/50">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 text-[10px] font-bold transition-all
                ${isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={isActive ? "text-blue-600 scale-110" : ""}>
                    {link.icon}
                  </div>
                  {link.name}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </main>

      {/* Subtle Footer */}
      <footer className="py-8 bg-white/50 border-t border-slate-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-medium text-slate-400">
            &copy; {new Date().getFullYear()} InvenTrack Pro. Built with performance in mind.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

