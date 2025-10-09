import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarButton = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg mb-2 transition 
      ${active ? "bg-white text-purple-800 font-semibold" : "bg-white/10 hover:bg-white/20 text-white"}
    `}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const CustomerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🧠 Later: Clear localStorage / sessionStorage / auth tokens here
    // localStorage.removeItem("token");
    navigate("/loginUser"); // redirect to login page
  };

  return (
    <div className="w-64 bg-black/40 backdrop-blur-md p-5 flex flex-col justify-between min-h-screen">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">🎬 My Account</h2>

        <SidebarButton label="Profile" icon="👤" onClick={() => navigate("/customer/profile")} />
        <SidebarButton label="Bookings" icon="🎟" onClick={() => navigate("/customer/bookings")} />
        <SidebarButton label="Booking History" icon="📜" onClick={() => navigate("/customer/booking-history")} />
      </div>

      {/* 🚪 Logout Button at the bottom */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg transition bg-red-600 hover:bg-red-700 text-white mt-4"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerSidebar;
