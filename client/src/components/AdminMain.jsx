export default function AdminMain() {
  return (
    <main className="flex-1 py-12 px-6 overflow-y-auto">
      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white text-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Movies</h2>
          <p className="text-3xl font-bold text-blue-600">120</p>
        </div>
        <div className="bg-white text-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-3xl font-bold text-green-600">5400</p>
        </div>
        <div className="bg-white text-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Bookings</h2>
          <p className="text-3xl font-bold text-purple-600">340</p>
        </div>
        <div className="bg-white text-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-3xl font-bold text-red-600">₹1,20,000</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="bg-white text-gray-900 rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Movie</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">Rahul Kumar</td>
                <td className="p-3">Jawan</td>
                <td className="p-3">2</td>
                <td className="p-3">18 Sep 2025</td>
                <td className="p-3 text-green-600">₹500</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Sneha Verma</td>
                <td className="p-3">Kalki 2898 AD</td>
                <td className="p-3">3</td>
                <td className="p-3">18 Sep 2025</td>
                <td className="p-3 text-green-600">₹750</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Aditya Dwivedi</td>
                <td className="p-3">Pushpa 2</td>
                <td className="p-3">1</td>
                <td className="p-3">19 Sep 2025</td>
                <td className="p-3 text-green-600">₹250</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Abhishek Kumar</td>
                <td className="p-3">Animal</td>
                <td className="p-3">2</td>
                <td className="p-3">20 Sep 2025</td>
                <td className="p-3 text-green-600">₹500</td>
              </tr>
             
               <tr className="border-b">
                <td className="p-3">Mukesh Pradhan</td>
                <td className="p-3">DDLJ</td>
                <td className="p-3">2</td>
                <td className="p-3">22 Sep 2025</td>
                <td className="p-3 text-green-600">₹500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
