import { useState } from "react";
import Sidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Trash2, Edit, Plus } from "lucide-react";

export default function MoviesPage() {
  // Sample Movies Data
  const [movies, setMovies] = useState([
    { id: 1, title: "Jawan", genre: "Action", release: "15 Sep 2023", duration: "2h 45m" },
    { id: 2, title: "Kalki 2898 AD", genre: "Sci-Fi", release: "2024", duration: "3h 5m" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [form, setForm] = useState({ title: "", genre: "", release: "", duration: "" });

  // Open modal for Add or Edit
  const openModal = (movie = null) => {
    if (movie) {
      setCurrentMovie(movie);
      setForm(movie);
    } else {
      setCurrentMovie(null);
      setForm({ title: "", genre: "", release: "", duration: "" });
    }
    setShowModal(true);
  };

  // Save or Update Movie
  const handleSave = () => {
    if (currentMovie) {
      // Update existing
      setMovies(movies.map(m => (m.id === currentMovie.id ? { ...form, id: currentMovie.id } : m)));
    } else {
      // Add new
      setMovies([...movies, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  // Delete Movie
  const handleDelete = (id) => {
    setMovies(movies.filter(m => m.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar title="Manage Movies" />

        <main className="flex-1 py-12 px-6 overflow-y-auto">
          {/* Top Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Movies List</h2>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
            >
              <Plus size={18} className="mr-2" /> Add Movie
            </button>
          </div>

          {/* Movies Table */}
          <div className="bg-slate-800 rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-700 text-gray-300">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Genre</th>
                  <th className="p-3">Release Date</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id} className="border-b border-slate-700 hover:bg-slate-700">
                    <td className="p-3">{movie.title}</td>
                    <td className="p-3">{movie.genre}</td>
                    <td className="p-3">{movie.release}</td>
                    <td className="p-3">{movie.duration}</td>
                    <td className="p-3 flex items-center space-x-3">
                      <button
                        onClick={() => openModal(movie)}
                        className="text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        <Edit size={18} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="text-red-400 hover:text-red-300 flex items-center"
                      >
                        <Trash2 size={18} className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-gray-400 text-center py-4">
          © 2025 Film Flex Admin Portal
        </footer>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 text-gray-100 rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {currentMovie ? "Edit Movie" : "Add Movie"}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-900 text-white"
              />
              <input
                type="text"
                placeholder="Genre"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-900 text-white"
              />
              <input
                type="text"
                placeholder="Release Date"
                value={form.release}
                onChange={(e) => setForm({ ...form, release: e.target.value })}
                className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-900 text-white"
              />
              <input
                type="text"
                placeholder="Duration"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full border border-slate-600 rounded px-3 py-2 bg-slate-900 text-white"
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
