import Sidebar from "../components/AdminSidebar";   // Reusing same sidebar
import AdminNavbar from "../components/AdminNavbar";

export default function UserPage() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <AdminNavbar title="Manage Users" />

        {/* Page Content */}
        <main className="flex-1 py-8 px-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Users</h2>

          {/* Users Table */}
          <div className="bg-slate-800 rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
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
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-gray-400 text-center py-4">
          © 2025 Film Flex Admin Portal
        </footer>
      </div>
    </div>
  );
}
