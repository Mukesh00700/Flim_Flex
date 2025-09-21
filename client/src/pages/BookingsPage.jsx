import { useState } from "react";
import Sidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Menu } from "lucide-react";

export default function BookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample booking data
  const [bookings] = useState([
    {
      id: "BK001",
      customer: "Rajesh Kumar",
      movie: "Jawan",
      showtime: "15 Sep 2023, 6:30 PM",
      seats: "A1, A2, A3",
      total: 1200,
      status: "confirmed",
    },
    {
      id: "BK002",
      customer: "Priya Sharma",
      movie: "Kalki 2898 AD",
      showtime: "20 Sep 2024, 8:00 PM",
      seats: "B4, B5",
      total: 800,
      status: "confirmed",
    },
    {
      id: "BK003",
      customer: "Vikram Singh",
      movie: "Pathaan",
      showtime: "16 Sep 2023, 3:00 PM",
      seats: "C7, C8",
      total: 800,
      status: "cancelled",
    },
    {
      id: "BK004",
      customer: "Ananya Patel",
      movie: "Kalki 2898 AD",
      showtime: "21 Sep 2024, 9:30 PM",
      seats: "D2, D3, D4",
      total: 1200,
      status: "pending",
    },
  ]);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus;
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.movie.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          <span className="font-semibold">Manage Bookings</span>
        </div>

        {/* Desktop Navbar */}
        <AdminNavbar title="Manage Bookings" className="hidden lg:block" />

        {/* Page Content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">Bookings</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-slate-800 rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-700 text-gray-300">
                  <tr>
                    <th className="p-4 font-medium">Booking ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Movie</th>
                    <th className="p-4 font-medium">Showtime</th>
                    <th className="p-4 font-medium">Seats</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-700 hover:bg-slate-700"
                    >
                      <td className="p-4 font-mono">{booking.id}</td>
                      <td className="p-4">{booking.customer}</td>
                      <td className="p-4">{booking.movie}</td>
                      <td className="p-4">{booking.showtime}</td>
                      <td className="p-4">{booking.seats}</td>
                      <td className="p-4">₹{booking.total}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            View
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
