import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { PlusCircle, Trash2, Menu } from "lucide-react";

// Initial state for the movie form, matching the schema
const initialFormState = {
  title: "",
  description: "",
  languages: "", // Will be a comma-separated string in the form
  genre: "",
  release_date: "",
  poster_url: "",
};

export default function MoviesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching and Management ---

  // Fetch all movies from the backend when the component loads
  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/movies/getMovies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new movie by sending data to the backend
  const addMovie = async () => {
    if (!form.title || !form.genre || !form.release_date || !form.languages) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/movies/addMovies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to add movie');

      setForm(initialFormState); // Reset form
      fetchMovies(); // Refresh the movie list
    } catch (error) {
      console.error(error);
      alert("Error: Could not add the movie.");
    }
  };

  // Delete a movie using its ID
  const deleteMovie = async (id) => {
    if (window.confirm("Are you sure? This will delete the movie and all its shows.")) {
      try {
        const response = await fetch(`http://localhost:3000/movies/deleteMovies/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete');
        // Update state locally for a faster UI response
        setMovies(movies.filter((m) => m.id !== id));
      } catch (error) {
        console.error(error);
        alert("Error: Could not delete the movie.");
      }
    }
  };

  // --- JSX Structure ---

  return (
    <div className="flex min-h-screen bg-slate-950 text-gray-100">
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>
      
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between lg:hidden bg-slate-800 px-4 py-3 shadow">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-200 hover:text-white"><Menu size={24} /></button>
          <span className="font-semibold">Movies</span>
        </div>
        <AdminNavbar title="Movies" className="hidden lg:block" />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-slate-900 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Movie Management</h1>

          {/* Add Movie Form - Modified for the new schema */}
          <div className="bg-slate-800 p-4 sm:p-6 rounded-2xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Movie</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600" />
              <input type="text" name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600" />
              <input type="date" name="release_date" value={form.release_date} onChange={handleChange} className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600" />
              <input type="text" name="languages" placeholder="Languages (comma-separated)" value={form.languages} onChange={handleChange} className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600" />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 sm:col-span-2" rows="3" />
              <input type="text" name="poster_url" placeholder="Poster Image URL" value={form.poster_url} onChange={handleChange} className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 sm:col-span-2" />
            </div>
            <button onClick={addMovie} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg text-white">
              <PlusCircle size={18} className="inline mr-1" /> Save Movie
            </button>
          </div>

          {/* Movies List - Modified to display new data */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Movies List</h2>
            {isLoading ? <p className="text-gray-400">Loading...</p> : movies.length === 0 ? (
              <p className="text-gray-400">No movies added yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {movies.map((m) => (
                  <div key={m.id} className="bg-slate-700 rounded-lg shadow-md overflow-hidden">
                    <img src={m.poster_url || 'https://via.placeholder.com/500x750.png?text=No+Poster'} alt={m.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold mb-2">{m.title}</h3>
                        <button onClick={() => deleteMovie(m.id)} className="text-red-400 hover:text-red-300 transition"><Trash2 size={20} /></button>
                      </div>
                      <p className="text-sm text-gray-300"><strong>Genre:</strong> {m.genre}</p>
                      <p className="text-sm text-gray-300"><strong>Released:</strong> {new Date(m.release_date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-300"><strong>Languages:</strong> {m.languages.join(', ')}</p>
                      <p className="text-xs text-gray-400 mt-2">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}