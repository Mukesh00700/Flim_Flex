import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit2, Loader, Film } from "lucide-react";

const initialFormState = {
  title: "",
  description: "",
  languages: "",
  genre: "",
  release_date: "",
  poster_file: null, // file upload
};

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [previewSrc, setPreviewSrc] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/movies/getMovies", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch movies: status", response.status);
        setMovies([]);
        return;
      }

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
    // cleanup preview when unmount
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, poster_file: file }));

    // preview
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc);
      setPreviewSrc(null);
    }
    if (file) {
      const src = URL.createObjectURL(file);
      setPreviewSrc(src);
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setShowForm(false);
    setError("");
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc);
      setPreviewSrc(null);
    }
  };

  const handleAddMovie = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditMovie = (movie) => {
    setEditingId(movie.id);

    // If languages is array from API, convert to comma-separated string
    const langValue = Array.isArray(movie.languages)
      ? movie.languages.join(",")
      : movie.languages || "";

    setForm({
      title: movie.title || "",
      description: movie.description || "",
      languages: langValue,
      genre: movie.genre || "",
      release_date: movie.release_date ? movie.release_date.slice(0, 10) : "", // YYYY-MM-DD
      poster_file: null, // we'll upload a new file if chosen
    });

    // clear previous preview
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc);
      setPreviewSrc(null);
    }

    setShowForm(true);
  };

  const addOrUpdateMovie = async () => {
    if (!form.title || !form.genre || !form.release_date || !form.languages) {
      setError("Please fill all required fields.");
      return;
    }

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      setError("");

      const languagesArray = form.languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description || "");
      formData.append("genre", form.genre);
      formData.append("release_date", form.release_date);
      // send as comma-separated string because server currently expects "en,hi"
      formData.append("languages", languagesArray.join(","));

      if (form.poster_file) {
        formData.append("poster", form.poster_file);
      }

      const url = editingId
        ? `http://localhost:3000/movies/updateMovies/${editingId}`
        : "http://localhost:3000/movies/addMovies";

      const method = editingId ? "PUT" : "POST";
      

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`, // do not set Content-Type
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => null);
        console.error("Save failed:", response.status, text);
        throw new Error("Failed to save movie");
      }

      await fetchMovies();
      resetForm();
    } catch (error) {
      console.error(error);
      setError("Error: Could not save the movie.");
    }
  };

  const deleteMovie = async (id) => {
    if (!window.confirm("Are you sure? This will delete the movie and all its shows.")) return;

    if (!token) {
      alert("You must be logged in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/movies/deleteMovies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Delete failed:", response.status);
        throw new Error("Could not delete");
      }

      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error: Could not delete the movie.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Film size={32} className="text-blue-400" />
          Movie Management
        </h1>

        <button
          onClick={handleAddMovie}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white flex items-center gap-2 transition"
        >
          <PlusCircle size={20} /> Add Movie
        </button>
      </div>

      {/* Movie Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Movie" : "Add New Movie"}</h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="title"
                placeholder="Title *"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />

              <input
                type="text"
                name="genre"
                placeholder="Genre *"
                value={form.genre}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />

              <input
                type="date"
                name="release_date"
                value={form.release_date}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />

              <input
                type="text"
                name="languages"
                placeholder="Languages (comma-separated) *"
                value={form.languages}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white sm:col-span-2"
                rows="3"
              />

              {/* Image Upload */}
              <div className="sm:col-span-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
                />

                {form.poster_file && (
                  <p className="text-green-400 text-sm mt-1">Selected: {form.poster_file.name}</p>
                )}

                {previewSrc && (
                  <img src={previewSrc} alt="preview" className="mt-2 max-h-48 object-contain rounded-md" />
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addOrUpdateMovie}
                className="flex-1 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg text-white transition"
              >
                {editingId ? "Update Movie" : "Add Movie"}
              </button>

              <button
                onClick={resetForm}
                className="flex-1 bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin" size={40} />
          </div>
        ) : movies.length === 0 ? (
          <p className="text-gray-400">No movies added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {movies.map((m) => (
              <div
                key={m.id}
                className="bg-slate-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border border-slate-600"
              >
                <img
                  src={m.poster_url || "https://via.placeholder.com/500x750.png?text=No+Poster"}
                  alt={m.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-bold flex-1">{m.title}</h3>

                    <div className="flex gap-2">
                      <button onClick={() => handleEditMovie(m)} className="p-2 hover:bg-slate-600 rounded text-blue-400">
                        <Edit2 size={16} />
                      </button>

                      <button onClick={() => deleteMovie(m.id)} className="p-2 hover:bg-slate-600 rounded text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300">
                    <strong>Genre:</strong> {m.genre}
                  </p>

                  <p className="text-sm text-gray-300">
                    <strong>Released:</strong> {m.release_date ? new Date(m.release_date).toLocaleDateString() : "N/A"}
                  </p>

                  <p className="text-sm text-gray-300">
                    <strong>Languages:</strong>{" "}
                    {Array.isArray(m.languages) ? m.languages.join(", ") : m.languages || "N/A"}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
