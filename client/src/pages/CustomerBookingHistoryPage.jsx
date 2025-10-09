import React from "react";

const BookingHistoryPage = () => {
  const history = [
    { id: 1, movie: "Pathaan", date: "2025-09-10", seats: "A1, A2", amount: 400, status: "Completed" },
    { id: 2, movie: "RRR", date: "2025-09-15", seats: "B1, B2, B3", amount: 600, status: "Completed" },
    { id: 3, movie: "Dune 2", date: "2025-09-20", seats: "C5, C6", amount: 500, status: "Cancelled" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-[#0f172a] text-white min-h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>📜</span> Booking History
      </h1>

      <div className="bg-[#1e293b] p-6 rounded-2xl shadow mb-6">
        {history.length === 0 ? (
          <p className="text-gray-400">No booking history found.</p>
        ) : (
          <table className="w-full text-left border border-slate-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-700 text-gray-200">
                <th className="py-2 px-3">Movie</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Seats</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-slate-700 hover:bg-slate-700/40 transition"
                >
                  <td className="py-2 px-3">{b.movie}</td>
                  <td className="py-2 px-3">{b.date}</td>
                  <td className="py-2 px-3">{b.seats}</td>
                  <td className="py-2 px-3">₹{b.amount}</td>
                  <td
                    className={`py-2 px-3 font-semibold ${
                      b.status === "Cancelled" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {b.status}
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

export default BookingHistoryPage;
