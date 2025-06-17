import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/authUser";
import { logout } from "../api/auth";

const MainLayout = () => {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

const handleLogout = async () => {
  try {
    await logout();
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  } catch {
    // Fallback in case logout fails
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  }
};
const handleLogoutClick = () => {
  handleLogout();
  setDropdownOpen(false);
};
  // Detect click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex flex-wrap gap-2 justify-between items-center">
  <h1 className="text-xl font-bold">🧾 Inventory Store</h1>

  <div className="flex flex-wrap items-center gap-4 justify-end w-full sm:w-auto">
    {/* Buttons */}
    <button
      onClick={() => navigate("/sales")}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
    >
      Go to Sales
    </button>
    <button
      onClick={() => navigate("/customers")}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
    >
      Go to Customers
    </button>
    <button
      onClick={() => navigate("/items")}
      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
    >
      Go to Items
    </button>

    {/* Dropdown remains the same */}
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="text-gray-600 font-medium hover:text-black transition"
      >
        👤 {user?.name || "User"}
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
             onClick={handleLogoutClick}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  </div>
</header>


      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
