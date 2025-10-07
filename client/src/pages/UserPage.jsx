import { useState } from "react";
import Sidebar from "../components/AdminSidebar"; // Reusing same sidebar
import AdminNavbar from "../components/AdminNavbar";
import { Menu } from "lucide-react";

export default function UserPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-screen bg-slate-900">
        {/* Mobile Navbar with Sidebar Toggle */}
        <div className="flex items-center justify-between lg:hidden bg-slate-800 px-4 py-3 shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-200 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold">Manage Users</span>
        </div>

        {/* Desktop Navbar */}
        <AdminNavbar title="Manage Users" className="hidden lg:block" />

        {/* Page Content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Users</h2>

          {/* Users Table */}
          <div className="bg-slate-800 rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-700 text-gray-300">
                  <tr>
                    <th className="p-4 font-medium">User ID</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample Data */}
                  <tr className="border-b border-slate-700 hover:bg-slate-700">
                    <td className="p-4 font-mono">USR001</td>
                    <td className="p-4">Rajesh Kumar</td>
                    <td className="p-4">rajesh@example.com</td>
                    <td className="p-4">Customer</td>
                    <td className="p-4 flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        View
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-700">
                    <td className="p-4 font-mono">USR002</td>
                    <td className="p-4">Priya Sharma</td>
                    <td className="p-4">priya@example.com</td>
                    <td className="p-4">Customer</td>
                    <td className="p-4 flex gap-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        View
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-gray-400 text-center py-4 text-sm">
          © 2025 Film Flex Admin Portal
        </footer>
      </div>
    </div>
  );
}
