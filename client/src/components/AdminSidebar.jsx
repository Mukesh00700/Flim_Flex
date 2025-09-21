import { useState } from "react";
import {
  Home,
  Film,
  Users,
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  Clock,
  Ticket,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const links = [
    { to: "/admin", label: "Dashboard", icon: <Home /> },
    { to: "/movies", label: "Movies", icon: <Film /> },
    { to: "/user", label: "Users", icon: <Users /> },
    { to: "/bookings", label: "Bookings", icon: <Calendar /> },
  
    
     
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-xl font-bold">{sidebarOpen ? "Admin" : "A"}</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {links.map((link, i) => (
          <NavLink
            key={i}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded transition ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            {link.icon} {sidebarOpen && link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-3 p-4 hover:bg-gray-700"
      >
        <LogOut /> {sidebarOpen && "Logout"}
      </button>
    </div>
  );
}
