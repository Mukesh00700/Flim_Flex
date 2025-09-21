import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { PlusCircle, Trash2, Menu } from "lucide-react";

export default function MoviesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Preloaded Movies with Showtimes + Pricing
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Inception",
      genre: "Sci-Fi",
      release: "2010-07-16",
      duration: "2h 28m",
      screen: "1",
      showtimes: [
        { id: 101, time: "10:30" },
        { id: 102, time: "14:00" },
        { id: 103, time: "18:30" },
      ],
      pricing: [
        { id: 201, type: "Silver", price: 150 },
        { id: 202, type: "Gold", price: 250 },
        { id: 203, type: "Platinum", price: 350 },
      ],
    },
    {
      id: 2,
      title: "The Dark Knight",
      genre: "Action",
      release: "2008-07-18",
      duration: "2h 32m",
      screen: "2",
      showtimes: [
        { id: 201, time: "12:00" },
        { id: 202, time: "16:00" },
        { id: 203, time: "20:00" },
      ],
      pricing: [
        { id: 301, type: "Silver", price: 180 },
        { id: 302, type: "Gold", price: 280 },
        { id: 303, type: "Platinum", price: 380 },
      ],
    },
    {
      id: 3,
      title: "Avatar: The Way of Water",
      genre: "Fantasy",
      release: "2022-12-16",
      duration: "3h 12m",
      screen: "3",
      showtimes: [
        { id: 301, time: "11:00" },
        { id: 302, time: "15:30" },
        { id: 303, time: "19:30" },
      ],
      pricing: [
        { id: 401, type: "Silver", price: 200 },
        { id: 402, type: "Gold", price: 300 },
        { id: 403, type: "Platinum", price: 400 },
      ],
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    genre: "",
    release: "",
    duration: "",
    screen: "",
  });

  const [showtimes, setShowtimes] = useState([]);
  const [time, setTime] = useState("");

  const [pricing, setPricing] = useState([]);
  const [seatType, setSeatType] = useState("");
  const [seatPrice, setSeatPrice] = useState("");

  // Add Showtime
  const addShowtime = () => {
    if (time) {
      setShowtimes([...showtimes, { id: Date.now(), time }]);
      setTime("");
    }
  };

  // Delete Showtime
  const deleteShowtime = (id) => {
    setShowtimes(showtimes.filter((s) => s.id !== id));
  };

  // Add Pricing
  const addPricing = () => {
    if (seatType && seatPrice) {
      setPricing([...pricing, { id: Date.now(), type: seatType, price: seatPrice }]);
      setSeatType("");
      setSeatPrice("");
    }
  };

  // Delete Pricing
  const deletePricing = (id) => {
    setPricing(pricing.filter((p) => p.id !== id));
  };

  // Add Movie
  const addMovie = () => {
    if (
      !form.title ||
      !form.genre ||
      !form.release ||
      !form.duration ||
      !form.screen ||
      showtimes.length === 0 ||
      pricing.length === 0
    ) {
      alert("Please fill all fields, add showtimes and pricing.");
      return;
    }

    setMovies([
      ...movies,
      { id: Date.now(), ...form, showtimes, pricing },
    ]);

    // Reset form
    setForm({ title: "", genre: "", release: "", duration: "", screen: "" });
    setShowtimes([]);
    setPricing([]);
  };

  // Delete Movie
  const deleteMovie = (id) => {
    setMovies(movies.filter((m) => m.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Navbar with Sidebar Toggle on Mobile */}
        <div className="flex items-center justify-between lg:hidden bg-slate-800 px-4 py-3 shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-200 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold">Movies</span>
        </div>

        <AdminNavbar title="Movies" className="hidden lg:block" />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-slate-900 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Movie Management</h1>

          {/* Add Movie Form */}
          <div className="bg-slate-800 p-4 sm:p-6 rounded-2xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Movie</h2>

            {/* Movie Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Genre"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none"
              />
              <input
                type="date"
                value={form.release}
                onChange={(e) => setForm({ ...form, release: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 2h 30m)"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Screen Number"
                value={form.screen}
                onChange={(e) => setForm({ ...form, screen: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none"
              />
            </div>

            {/* Showtimes Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Showtimes</h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full sm:w-auto flex-1 p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none"
                />
                <button
                  onClick={addShowtime}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white transition"
                >
                  <PlusCircle size={18} /> Add Showtime
                </button>
              </div>

              <ul className="space-y-2">
                {showtimes.length === 0 && (
                  <li className="text-gray-400 italic">No showtimes added yet.</li>
                )}
                {showtimes.map((s) => (
                  <li
                    key={s.id}
                    className="bg-slate-700 p-2 rounded-lg flex justify-between items-center"
                  >
                    <span>{s.time}</span>
                    <button
                      onClick={() => deleteShowtime(s.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Seat Pricing</h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Seat Type (VIP, Gold, etc.)"
                  value={seatType}
                  onChange={(e) => setSeatType(e.target.value)}
                  className="w-full sm:w-auto flex-1 p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={seatPrice}
                  onChange={(e) => setSeatPrice(e.target.value)}
                  className="w-full sm:w-auto flex-1 p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none"
                />
                <button
                  onClick={addPricing}
                  className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg text-white transition"
                >
                  <PlusCircle size={18} /> Add Pricing
                </button>
              </div>

              <ul className="space-y-2">
                {pricing.length === 0 && (
                  <li className="text-gray-400 italic">No pricing added yet.</li>
                )}
                {pricing.map((p) => (
                  <li
                    key={p.id}
                    className="bg-slate-700 p-2 rounded-lg flex justify-between items-center"
                  >
                    <span>{p.type} — ₹{p.price}</span>
                    <button
                      onClick={() => deletePricing(p.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={addMovie}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg text-white"
            >
              <PlusCircle size={18} className="inline mr-1" /> Save Movie
            </button>
          </div>

          {/* Movies List */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Movies List</h2>
            {movies.length === 0 ? (
              <p className="text-gray-400">No movies added yet.</p>
            ) : (
              <ul className="space-y-4">
                {movies.map((m) => (
                  <li key={m.id} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold">{m.title}</h3>
                        <p>🎭 Genre: {m.genre}</p>
                        <p>📅 Release Date: {m.release}</p>
                        <p>⏱ Duration: {m.duration}</p>
                        <p>🎬 Screen: {m.screen}</p>
                        <p>⏰ Showtimes: {m.showtimes.map((s) => s.time).join(", ")}</p>
                        <p>💰 Pricing:</p>
                        <ul className="ml-4 list-disc">
                          {m.pricing.map((p) => (
                            <li key={p.id}>
                              {p.type} — ₹{p.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => deleteMovie(m.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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
