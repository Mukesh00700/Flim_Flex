import { Home, Film, Users, Calendar, Tv, Ticket, LogOut, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/admin/movies", label: "Movies", icon: <Film size={20} /> },
    { to: "/admin/theaters", label: "Theaters & Halls", icon: <Tv size={20} /> },
    { to: "/admin/shows", label: "Show Scheduler", icon: <Ticket size={20} /> },
    { to: "/admin/bookings", label: "Bookings", icon: <Calendar size={20} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
  ];

  const activeLinkStyle = "bg-blue-600 text-white";
  const inactiveLinkStyle = "hover:bg-slate-700";

  return (
    <div className={`bg-slate-800 text-white flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 h-16">
        {sidebarOpen && <span className="text-xl font-bold">FilmFlex</span>}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 rounded-lg hover:bg-slate-700"
        >
          <Menu />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            end={link.to === "/admin"} // Ensures only the root dashboard link is "exact"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors ${isActive ? activeLinkStyle : inactiveLinkStyle} ${!sidebarOpen && "justify-center"}`
            }
          >
            {link.icon}
            {sidebarOpen && <span className="ml-3 font-medium">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-slate-700">
        <button
          onClick={() => navigate("/login")}
          className={`flex items-center w-full p-2 rounded-lg transition-colors hover:bg-slate-700 ${!sidebarOpen && "justify-center"}`}
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}