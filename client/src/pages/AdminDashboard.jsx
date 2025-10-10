import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";


import AdminMain from "../components/AdminMain"; 
import MoviesPage from "./MoviesPage"; 
import UserPage from "./UserPage";
import BookingsPage from "./BookingsPage"

export default function AdminDashboard() {
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