import Sidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar title="Analytics" />

        <main className="flex-1 py-12 px-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
          <p>Here you can display charts, statistics, or reports.</p>
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-gray-400 text-center py-4">
          © 2025 Film Flex Admin Portal
        </footer>
      </div>
    </div>
  );
}
