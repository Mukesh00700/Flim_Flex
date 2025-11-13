import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Trash2 } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");


  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const query = new URLSearchParams({ search: searchTerm, status: statusFilter }).toString();
      const response = await fetch(`/api/bookings/my-theater?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => fetchBookings(), 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter]);


  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/bookings/${bookingId}/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'cancelled' })
        });
        fetchBookings(); 
      } catch (error) {
        alert("Failed to cancel booking.");
      }
    }
  };

  const getStatusClass = (status) => {
  
    const statusClasses = {
      paid: "bg-green-500/20 text-green-300",
      pending: "bg-yellow-500/20 text-yellow-300",
      failed: "bg-red-500/20 text-red-300",
      cancelled: "bg-gray-500/20 text-gray-300",
      refunded: "bg-blue-500/20 text-blue-300",
    };
    return statusClasses[status] || "bg-gray-500/20 text-gray-300";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Booking Management</h1>

      
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-slate-800 rounded-xl">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search ID, Customer, or Movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 rounded-lg bg-slate-700 border border-slate-600"
          />
        </div>
        <div className="relative">
           <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto p-2 pl-10 rounded-lg bg-slate-700 border border-slate-600 appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      
      <div className="bg-slate-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Movie</th>
                <th className="p-4">Showtime</th>
                <th className="p-4">Seats</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" className="text-center p-8 text-gray-400">Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan="8" className="text-center p-8 text-gray-400">No bookings found.</td></tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.booking_id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="p-4 font-mono text-sm">{booking.booking_id}</td>
                    <td className="p-4">{booking.customer_name}</td>
                    <td className="p-4">{booking.movie_title}</td>
                    <td className="p-4 text-gray-300">{new Date(booking.show_time).toLocaleString()}</td>
                    <td className="p-4 text-gray-300">{booking.seats}</td>
                    <td className="p-4">₹{booking.total_amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(booking.payment_status)}`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleCancelBooking(booking.booking_id)} 
                        className="text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                        disabled={booking.payment_status === 'cancelled' || booking.payment_status === 'refunded'}
                        title="Cancel Booking"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}