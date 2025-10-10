import { useState, useEffect } from "react";
import { UserCheck } from "lucide-react";

export default function UserPage() {
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentCustomers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/recent-by-theater', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data. You may not be authorized.');
      }

      const data = await response.json();
      setRecentCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentCustomers();
  }, []); // Runs once on component mount

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <UserCheck size={32} className="text-blue-400" />
        <h1 className="text-3xl font-bold">Recent Customers</h1>
      </div>

      <p className="mb-6 text-gray-400">
        Showing the 10 most recent users who have booked tickets at your theaters.
      </p>

      {/* Recent Customers Table */}
      <div className="bg-slate-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-700/50 text-gray-300">
              <tr>
                <th className="p-4 font-semibold">Customer Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Movie Booked</th>
                <th className="p-4 font-semibold">Booking Time</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="text-center p-8 text-gray-400">Loading recent customers...</td></tr>
              ) : recentCustomers.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-8 text-gray-400">No recent bookings found.</td></tr>
              ) : (
                recentCustomers.map((customer, index) => (
                  <tr key={`${customer.user_id}-${index}`} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 font-medium text-white">{customer.name}</td>
                    <td className="p-4 text-gray-300">{customer.email}</td>
                    <td className="p-4 text-gray-300">{customer.movie_title}</td>
                    <td className="p-4 text-gray-400">
                      {new Date(customer.booking_time).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
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