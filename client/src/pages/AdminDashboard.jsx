import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

// Import your page components here
import AdminMain from "../components/AdminMain"; // The main dashboard view
import MoviesPage from "./MoviesPage"; 
import UserPage from "./UserPage";
import BookingsPage from "./BookingsPage"
// import TheatersPage from "./TheatersPage";
// import ShowsPage from "./ShowsPage";
// import BookingsPage from "./BookingsPage";
// import UsersPage from "./UsersPage";

export default function AdminDashboard() {
  // Centralized state for the sidebar (open/closed)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-100">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          {/* Router outlet for rendering different admin pages */}
          <Routes>
            <Route path="/" element={<AdminMain />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-slate-800 text-gray-400 text-center py-4 text-sm">
          © 2025 Film Flex Admin Portal
        </footer>
      </div>
    </div>
  );
}