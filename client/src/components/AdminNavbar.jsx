import { Menu } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

export default function AdminNavbar({ onMenuClick }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This logic should ideally live in an AuthContext for app-wide use
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        // Handle invalid token, e.g., logout user
      }
    }
  }, []);

  return (
    <header className="bg-slate-800 shadow p-4 flex justify-between items-center h-16 flex-shrink-0">
      {/* Mobile Hamburger Menu Button */}
      <button 
        onClick={onMenuClick} 
        className="lg:hidden text-gray-200 hover:text-white"
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Title (can be made dynamic with props) */}
      <h1 className="text-xl font-semibold hidden lg:block">Dashboard</h1>

      {/* User Info Section */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-300 font-medium hidden sm:inline">
              Welcome, {user.name || 'Admin'}
            </span>
            <img
              src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
              alt="Profile"
              className="rounded-full w-10 h-10 border-2 border-slate-600"
            />
          </>
        ) : (
          <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
        )}
      </div>
    </header>
  );
}