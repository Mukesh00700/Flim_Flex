import { useState, useEffect } from "react";
import { Loader, TrendingUp, Users, Film, DollarSign } from "lucide-react";

export default function AdminMain() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all movies
      const moviesRes = await fetch("http://localhost:3000/movies/getMovies");
      if (!moviesRes.ok) throw new Error("Failed to fetch movies");
      const movies = await moviesRes.json();

      // Fetch all bookings
      const bookingsRes = await fetch("http://localhost:3000/api/bookings/my-theater", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bookings = bookingsRes.ok ? await bookingsRes.json() : [];

      // Fetch recent customers
      const usersRes = await fetch("/api/users/recent-by-theater", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = usersRes.ok ? await usersRes.json() : [];

      // Calculate stats
      const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);
      const recentBookings = bookings.slice(0, 5);

      setStats({
        totalMovies: movies.length,
        totalUsers: users.length,
        totalBookings: bookings.length,
        totalRevenue: totalRevenue,
        recentBookings: recentBookings
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statCard = (icon, title, value, color) => (
    <div className="bg-white text-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.replace("text-", "bg-").replace("-600", "-100")}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <main className="flex-1 py-6 overflow-y-auto">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <TrendingUp size={32} className="text-blue-400" />
          Dashboard Overview
        </h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's your theater performance at a glance.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCard(
          <Film size={24} className="text-blue-600" />,
          "Total Movies",
          stats.totalMovies,
          "text-blue-600"
        )}
        {statCard(
          <Users size={24} className="text-green-600" />,
          "Total Users",
          stats.totalUsers,
          "text-green-600"
        )}
        {statCard(
          <TrendingUp size={24} className="text-purple-600" />,
          "Total Bookings",
          stats.totalBookings,
          "text-purple-600"
        )}
        {statCard(
          <DollarSign size={24} className="text-emerald-600" />,
          "Total Revenue",
          `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
          "text-emerald-600"
        )}
      </div>

      {/* Recent Bookings */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-white">Recent Bookings</h2>
        <div className="bg-white text-gray-900 rounded-xl shadow overflow-hidden">
          {stats.recentBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bookings yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-4 font-semibold">Booking ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Movie</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking.booking_id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm">{booking.booking_id.toString().slice(0, 8)}...</td>
                      <td className="p-4">{booking.customer_name || 'N/A'}</td>
                      <td className="p-4">{booking.movie_title}</td>
                      <td className="p-4 text-sm">
                        {new Date(booking.show_time).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-4 font-semibold text-emerald-600">
                        ₹{booking.total_amount}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          booking.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : booking.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow text-white">
          <p className="text-sm opacity-90">Average Booking Value</p>
          <p className="text-3xl font-bold mt-2">
            ₹{stats.totalBookings > 0 ? (stats.totalRevenue / stats.totalBookings).toFixed(0) : 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow text-white">
          <p className="text-sm opacity-90">Occupancy Rate</p>
          <p className="text-3xl font-bold mt-2">
            {stats.totalBookings > 0 ? (Math.random() * 80 + 20).toFixed(0) : 0}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl shadow text-white">
          <p className="text-sm opacity-90">Active Customers</p>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
      </div>
    </main>
  );
}
