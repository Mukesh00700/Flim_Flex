import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader, Calendar, Clock, Film } from "lucide-react";

export default function ShowSchedulerPage() {
  const [theaters, setTheaters] = useState([]);
  const [halls, setHalls] = useState({});
  const [shows, setShows] = useState({});
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // UI State
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingShowId, setEditingShowId] = useState(null);
  const [showData, setShowData] = useState({
    movieId: "",
    showTime: "",
    language: "English"
  });

  const token = localStorage.getItem("token");

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch theaters
        const theaterRes = await fetch("http://localhost:3000/theaters/getTheaters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!theaterRes.ok) throw new Error("Failed to fetch theaters");
        const theaterData = await theaterRes.json();
        setTheaters(theaterData);
        if (theaterData.length > 0) {
          setSelectedTheaterId(theaterData[0].id);
        }

        // Fetch movies
        const movieRes = await fetch("http://localhost:3000/movies/getMovies");
        if (!movieRes.ok) throw new Error("Failed to fetch movies");
        const movieData = await movieRes.json();
        setMovies(movieData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch halls when theater changes
  useEffect(() => {
    if (selectedTheaterId) {
      fetchHalls(selectedTheaterId);
    }
  }, [selectedTheaterId]);

  // Fetch halls for a specific theater
  const fetchHalls = async (theaterId) => {
    try {
      const response = await fetch(`http://localhost:3000/theaters/${theaterId}/halls`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch halls");
      const data = await response.json();
      setHalls(prev => ({ ...prev, [theaterId]: data }));
      if (data.length > 0) {
        setSelectedHallId(data[0].id);
      } else {
        setSelectedHallId(null);
      }
    } catch (err) {
      console.error("Error fetching halls:", err);
      setHalls(prev => ({ ...prev, [theaterId]: [] }));
    }
  };

  // Fetch shows for a hall
  const fetchShowsForHall = async (hallId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/hall/${hallId}/shows`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch shows");
      const data = await response.json();
      setShows(prev => ({ ...prev, [hallId]: data }));
    } catch (err) {
      console.error("Error fetching shows:", err);
      setShows(prev => ({ ...prev, [hallId]: [] }));
    }
  };

  // Handle hall selection
  const handleHallSelect = (hallId) => {
    setSelectedHallId(hallId);
    fetchShowsForHall(hallId);
  };

  // Handle add/edit show form
  const handleShowForm = (show = null) => {
    if (show) {
      setEditingShowId(show.id);
      setShowData({
        movieId: show.movie_id,
        showTime: new Date(show.show_time).toISOString().slice(0, 16),
        language: show.language || "English"
      });
    } else {
      setEditingShowId(null);
      setShowData({ movieId: "", showTime: "", language: "English" });
    }
    setShowForm(true);
  };

  // Save show
  const handleSaveShow = async (e) => {
    e.preventDefault();
    if (!showData.movieId || !showData.showTime) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const url = editingShowId
        ? `http://localhost:3000/api/bookings/schedule/${editingShowId}`
        : "http://localhost:3000/api/bookings/schedule/create";

      const method = editingShowId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: parseInt(showData.movieId),
          hallId: selectedHallId,
          showTime: new Date(showData.showTime).toISOString(),
          language: showData.language
        }),
      });

      if (!response.ok) throw new Error("Failed to save show");

      // Refresh shows
      if (selectedHallId) {
        await fetchShowsForHall(selectedHallId);
      }
      setShowForm(false);
    } catch (err) {
      alert(err.message || "Error saving show");
    }
  };

  // Delete show
  const handleDeleteShow = async (showId) => {
    if (!window.confirm("Are you sure you want to delete this show?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/bookings/schedule/${showId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Failed to delete show");
      }

      if (selectedHallId) {
        await fetchShowsForHall(selectedHallId);
      }
    } catch (err) {
      alert(err.message || "Error deleting show");
    }
  };

  const currentTheater = theaters.find(t => t.id === selectedTheaterId);
  const currentHalls = halls[selectedTheaterId] || [];
  const currentHall = currentHalls.find(h => h.id === selectedHallId);
  const currentShows = shows[selectedHallId] || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar size={32} className="text-purple-400" />
          Show Scheduler
        </h1>
        <button
          onClick={() => handleShowForm()}
          disabled={!selectedHallId || currentHalls.length === 0}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 px-4 py-2 rounded-lg text-white flex items-center gap-2 transition"
        >
          <Plus size={20} /> Schedule Show
        </button>
      </div>

      {/* Show Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingShowId ? "Edit Show" : "Schedule New Show"}
            </h2>
            <form onSubmit={handleSaveShow} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Movie *</label>
                <select
                  value={showData.movieId}
                  onChange={(e) => setShowData({ ...showData, movieId: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
                  required
                >
                  <option value="">Select Movie</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={showData.showTime}
                  onChange={(e) => setShowData({ ...showData, showTime: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Language</label>
                <select
                  value={showData.language}
                  onChange={(e) => setShowData({ ...showData, language: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Marathi">Marathi</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-500 py-2 rounded-lg text-white transition"
                >
                  {editingShowId ? "Update" : "Schedule"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-white transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin" size={40} />
        </div>
      ) : theaters.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center text-gray-400">
          <p>No theaters available. Create a theater first to schedule shows.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Theater & Hall Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Theater Selection */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="font-semibold text-white mb-2">Theaters</h3>
              <div className="space-y-2">
                {theaters.map(theater => (
                  <button
                    key={theater.id}
                    onClick={() => setSelectedTheaterId(theater.id)}
                    className={`w-full text-left p-2 rounded-lg transition ${
                      selectedTheaterId === theater.id
                        ? "bg-purple-600 text-white"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    }`}
                  >
                    <p className="font-medium">{theater.name}</p>
                    <p className="text-xs">{theater.city}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Hall Selection */}
            {currentTheater && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">Halls in {currentTheater.name}</h3>
                {currentHalls.length === 0 ? (
                  <p className="text-gray-400 text-sm">No halls available</p>
                ) : (
                  <div className="space-y-2">
                    {currentHalls.map(hall => (
                      <button
                        key={hall.id}
                        onClick={() => handleHallSelect(hall.id)}
                        className={`w-full text-left p-2 rounded-lg transition ${
                          selectedHallId === hall.id
                            ? "bg-purple-600 text-white"
                            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                        }`}
                      >
                        <p className="font-medium">{hall.name}</p>
                        <p className="text-xs">{hall.seat_count || 0} seats</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Shows List */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} />
                Shows in {currentHall ? currentHall.name : "Select a Hall"}
              </h3>

              {!selectedHallId ? (
                <p className="text-gray-400">Select a hall to view and manage shows</p>
              ) : currentShows.length === 0 ? (
                <p className="text-gray-400">No shows scheduled. Create one to get started.</p>
              ) : (
                <div className="space-y-3">
                  {currentShows.map(show => (
                    <div
                      key={show.id}
                      className="bg-slate-700 p-4 rounded-lg flex justify-between items-start hover:bg-slate-700/70 transition border border-slate-600"
                    >
                      <div className="flex-1">
                        <p className="font-semibold flex items-center gap-2">
                          <Film size={16} className="text-purple-400" />
                          {show.movie_title}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(show.show_time).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                        <p className="text-sm text-gray-400">
                          Language: {show.language} | Booked: {show.booked_seats} seats
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShowForm(show)}
                          className="p-2 hover:bg-slate-600 rounded text-blue-400 transition"
                          title="Edit Show"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteShow(show.id)}
                          className="p-2 hover:bg-slate-600 rounded text-red-400 transition"
                          title="Delete Show"
                          disabled={show.booked_seats > 0}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
