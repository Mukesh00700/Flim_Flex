import React from "react";
import { useOutletContext } from "react-router-dom";

const CustomerBookingsPage = () => {
  const { bookings, handleCancel } = useOutletContext();

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-slate-900 text-white min-h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">🎟 My Bookings</h1>

      <div className="bg-slate-800 p-6 rounded-2xl shadow mb-6">
        {bookings.length === 0 ? (
          <p className="text-gray-400">No bookings found.</p>
        ) : (
          <table className="w-full text-left border border-slate-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-700 text-gray-200">
                <th className="py-2 px-3">Movie</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Seats</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-slate-700 hover:bg-slate-700/40 transition"
                >
                  <td className="py-2 px-3">{b.movie}</td>
                  <td className="py-2 px-3">{b.date}</td>
                  <td className="py-2 px-3">{b.seats}</td>
                  <td className="py-2 px-3">₹{b.amount}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white text-sm transition"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerBookingsPage;
