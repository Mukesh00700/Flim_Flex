import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import AdminMain from "../components/AdminMain";
import { Menu } from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar with Sidebar Toggle on Mobile */}
        <div className="flex items-center justify-between lg:hidden bg-slate-800 px-4 py-3 shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-200 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold">Dashboard</span>
        </div>

        <AdminNavbar title="Dashboard" className="hidden lg:block" />

        {/* Page Content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          <AdminMain />
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-gray-400 text-center py-4 text-sm">
          © 2025 Film Flex Admin Portal
        </footer>
      </div>
    </div>
  );
}
