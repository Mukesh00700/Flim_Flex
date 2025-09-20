import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import AdminMain from "../components/AdminMain";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <AdminNavbar title="Dashboard" />

        {/* Page Content */}
        <main className="flex-1 py-8 px-6 overflow-y-auto">
          <AdminMain />
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-gray-400 text-center py-4">
          © 2025 Film Flex Admin Portal
        </footer>
      </div>
    </div>
  );
}
