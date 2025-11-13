import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader, MapPin, Building2, ChevronDown } from "lucide-react";

export default function TheatersPage() {
  const [theaters, setTheaters] = useState([]);
  const [halls, setHalls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTheaterId, setExpandedTheaterId] = useState(null);
  
  // Theater form state
  const [showTheaterForm, setShowTheaterForm] = useState(false);
  const [editingTheaterId, setEditingTheaterId] = useState(null);
  const [theaterForm, setTheaterForm] = useState({ name: "", city: "", address: "" });
  
  // Hall form state
  const [showHallForm, setShowHallForm] = useState(false);
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);
  const [hallForm, setHallForm] = useState({ name: "", capacity: "" });

  const token = localStorage.getItem("token");

  // Fetch theaters
  const fetchTheaters = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:3000/theaters/getTheaters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch theaters");
      const data = await response.json();
      setTheaters(data);
    } catch (err) {
      setError(err.message || "Error fetching theaters");
    } finally {
      setLoading(false);
    }
  };

  // Fetch halls for a specific theater
  const fetchHalls = async (theaterId) => {
    try {
      const response = await fetch(`http://localhost:3000/theaters/${theaterId}/halls`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch halls");
      const data = await response.json();
      setHalls(prev => ({ ...prev, [theaterId]: data }));
    } catch (err) {
      console.error("Error fetching halls:", err);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  // Handle theater form toggle
  const handleAddTheater = () => {
    setEditingTheaterId(null);
    setTheaterForm({ name: "", city: "", address: "" });
    setShowTheaterForm(true);
  };

  const handleEditTheater = (theater) => {
    setEditingTheaterId(theater.id);
    setTheaterForm({ name: theater.name, city: theater.city, address: theater.address });
    setShowTheaterForm(true);
  };

  // Save theater (create or update)
  const handleSaveTheater = async (e) => {
    e.preventDefault();
    if (!theaterForm.name || !theaterForm.city) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const method = editingTheaterId ? "PUT" : "POST";
      const url = editingTheaterId
        ? `http://localhost:3000/theaters/updateTheater/${editingTheaterId}`
        : "http://localhost:3000/theaters/createTheater";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(theaterForm),
      });

      if (!response.ok) throw new Error("Failed to save theater");
      
      fetchTheaters();
      setShowTheaterForm(false);
      setTheaterForm({ name: "", city: "", address: "" });
    } catch (err) {
      alert(err.message || "Error saving theater");
    }
  };

  // Delete theater
  const handleDeleteTheater = async (theaterId) => {
    if (!window.confirm("Are you sure you want to delete this theater? All associated halls and seats will be removed.")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/theaters/deleteTheater/${theaterId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete theater");
      fetchTheaters();
    } catch (err) {
      alert(err.message || "Error deleting theater");
    }
  };

  // Toggle theater expansion and fetch halls
  const toggleTheaterExpand = (theaterId) => {
    if (expandedTheaterId === theaterId) {
      setExpandedTheaterId(null);
    } else {
      setExpandedTheaterId(theaterId);
      if (!halls[theaterId]) {
        fetchHalls(theaterId);
      }
    }
  };

  // Handle add hall form
  const handleShowHallForm = (theaterId) => {
    setSelectedTheaterId(theaterId);
    setHallForm({ name: "", capacity: "" });
    setShowHallForm(true);
  };

  // Save hall
  const handleSaveHall = async (e) => {
    e.preventDefault();
    if (!hallForm.name) {
      alert("Please enter hall name");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/theaters/${selectedTheaterId}/halls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(hallForm),
      });

      if (!response.ok) throw new Error("Failed to create hall");
      
      // Refresh halls for this theater
      await fetchHalls(selectedTheaterId);
      setShowHallForm(false);
      setHallForm({ name: "", capacity: "" });
    } catch (err) {
      alert(err.message || "Error creating hall");
    }
  };

  // Delete hall
  const handleDeleteHall = async (hallId, theaterId) => {
    if (!window.confirm("Are you sure you want to delete this hall? All associated seats will be removed.")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/theaters/halls/${hallId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete hall");
      await fetchHalls(theaterId);
    } catch (err) {
      alert(err.message || "Error deleting hall");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 size={32} className="text-blue-400" />
          Theater Management
        </h1>
        <button
          onClick={handleAddTheater}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white flex items-center gap-2 transition"
        >
          <Plus size={20} /> New Theater
        </button>
      </div>

      {/* Theater Form Modal */}
      {showTheaterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingTheaterId ? "Edit Theater" : "Add New Theater"}
            </h2>
            <form onSubmit={handleSaveTheater} className="space-y-4">
              <input
                type="text"
                placeholder="Theater Name *"
                value={theaterForm.name}
                onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400"
                required
              />
              <input
                type="text"
                placeholder="City *"
                value={theaterForm.city}
                onChange={(e) => setTheaterForm({ ...theaterForm, city: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400"
                required
              />
              <textarea
                placeholder="Address"
                value={theaterForm.address}
                onChange={(e) => setTheaterForm({ ...theaterForm, address: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-white transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowTheaterForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-white transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hall Form Modal */}
      {showHallForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Hall</h2>
            <form onSubmit={handleSaveHall} className="space-y-4">
              <input
                type="text"
                placeholder="Hall Name (e.g., Screen 1) *"
                value={hallForm.name}
                onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400"
                required
              />
              <input
                type="number"
                placeholder="Capacity (optional)"
                value={hallForm.capacity}
                onChange={(e) => setHallForm({ ...hallForm, capacity: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded-lg text-white transition"
                >
                  Add Hall
                </button>
                <button
                  type="button"
                  onClick={() => setShowHallForm(false)}
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

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin" size={40} />
        </div>
      ) : theaters.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center text-gray-400">
          <p>No theaters yet. Create your first theater to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {theaters.map((theater) => (
            <div
              key={theater.id}
              className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700"
            >
              {/* Theater Header */}
              <div
                className="p-4 hover:bg-slate-700/50 cursor-pointer flex justify-between items-center transition"
                onClick={() => toggleTheaterExpand(theater.id)}
              >
                <div className="flex items-start gap-3 flex-1">
                  <Building2 size={24} className="text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">{theater.name}</h3>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <MapPin size={14} />
                      {theater.city}, {theater.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTheater(theater);
                    }}
                    className="p-2 hover:bg-slate-600 rounded-lg text-blue-400 transition"
                    title="Edit Theater"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTheater(theater.id);
                    }}
                    className="p-2 hover:bg-slate-600 rounded-lg text-red-400 transition"
                    title="Delete Theater"
                  >
                    <Trash2 size={18} />
                  </button>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${
                      expandedTheaterId === theater.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Halls Section */}
              {expandedTheaterId === theater.id && (
                <div className="border-t border-slate-700 bg-slate-700/30 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-white">Halls</h4>
                    <button
                      onClick={() => handleShowHallForm(theater.id)}
                      className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm text-white flex items-center gap-1 transition"
                    >
                      <Plus size={14} /> Add Hall
                    </button>
                  </div>

                  {halls[theater.id] && halls[theater.id].length > 0 ? (
                    <div className="space-y-2">
                      {halls[theater.id].map((hall) => (
                        <div
                          key={hall.id}
                          className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center hover:bg-slate-700 transition border border-slate-600"
                        >
                          <div>
                            <p className="font-medium">{hall.name}</p>
                            {hall.capacity && (
                              <p className="text-sm text-gray-400">Capacity: {hall.capacity}</p>
                            )}
                            {hall.seat_count && (
                              <p className="text-sm text-gray-400">Seats: {hall.seat_count}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteHall(hall.id, theater.id)}
                            className="p-1 hover:bg-slate-600 rounded text-red-400 transition"
                            title="Delete Hall"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No halls yet. Add one to get started.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
