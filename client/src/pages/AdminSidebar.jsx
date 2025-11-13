import { useState } from "react";
import { Home, Film, Users, Calendar, BarChart3, LogOut, Menu } from "lucide-react";
import { Navigate } from "react-router-dom";
export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = Navigate();
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-xl font-bold">Admin</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        <a href="#" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
          <Home /> {sidebarOpen && "Dashboard"}
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
          <Film /> {sidebarOpen && "Movies"}
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
          <Users /> {sidebarOpen && "Users"}
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
          <Calendar /> {sidebarOpen && "Bookings"}
        </a>
        <a href="#" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
          <BarChart3 /> {sidebarOpen && "Analytics"}
        </a>
      </nav>

      <button className="flex items-center gap-3 p-4 hover:bg-gray-700" onClick={()=>{
        localStorage.removeItem("token");
        navigate("/");
      }}>
        <LogOut /> {sidebarOpen && "Logout"}
      </button>
    </div>
  );
}
