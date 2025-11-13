import { useState, useEffect } from "react";
import { Loader, DollarSign, Save, Trash2, ChevronDown } from "lucide-react";

export default function PricingPage() {
  const [shows, setShows] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedShowId, setExpandedShowId] = useState(null);
  const [savingShowId, setSavingShowId] = useState(null);

  const token = localStorage.getItem("token");
  const seatTypes = ["basic", "recliner", "vip"];

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:3000/prices/shows/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch shows");
      const data = await response.json();
      setShows(data);

      // Fetch prices for all shows
      for (const show of data) {
        await fetchPricesForShow(show.id);
      }
    } catch (err) {
      setError(err.message || "Error fetching shows");
    } finally {
      setLoading(false);
    }
  };

  const fetchPricesForShow = async (showId) => {
    try {
      const response = await fetch(`http://localhost:3000/prices/show/${showId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch prices");
      const data = await response.json();
      
      // Create price map for easy access
      const priceMap = {};
      data.forEach(price => {
        priceMap[price.seat_type] = price;
      });
      
      setPrices(prev => ({ ...prev, [showId]: priceMap }));
    } catch (err) {
      console.error("Error fetching prices:", err);
      setPrices(prev => ({ ...prev, [showId]: {} }));
    }
  };

  const handlePriceChange = (showId, seatType, value) => {
    setPrices(prev => ({
      ...prev,
      [showId]: {
        ...prev[showId],
        [seatType]: {
          ...prev[showId]?.[seatType],
          price: parseFloat(value) || 0,
          seat_type: seatType,
          show_id: showId
        }
      }
    }));
  };

  const savePrices = async (showId) => {
    try {
      setSavingShowId(showId);
      const showPrices = Object.values(prices[showId] || {}).map(p => ({
        seatType: p.seat_type,
        price: p.price
      }));

      if (showPrices.length === 0) {
        setError("Please set prices for at least one seat type");
        return;
      }

      const response = await fetch(`http://localhost:3000/prices/show/${showId}/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prices: showPrices }),
      });

      if (!response.ok) throw new Error("Failed to save prices");

      alert("Prices saved successfully!");
      await fetchPricesForShow(showId);
    } catch (err) {
      alert(err.message || "Error saving prices");
      console.log(err);
    } finally {
      setSavingShowId(null);
    }
  };

  const deletePrice = async (showId, seatType) => {
    if (!window.confirm(`Delete ${seatType} seat price?`)) return;

    try {
      const priceObj = prices[showId]?.[seatType];
      if (!priceObj?.id) {
        alert("Price not found");
        return;
      }

      const response = await fetch(`http://localhost:3000/prices/${priceObj.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete price");

      await fetchPricesForShow(showId);
      alert("Price deleted successfully!");
    } catch (err) {
      alert(err.message || "Error deleting price");
    }
  };

  const toggleShowExpand = (showId) => {
    setExpandedShowId(expandedShowId === showId ? null : showId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <DollarSign size={32} className="text-emerald-400" />
        <h1 className="text-3xl font-bold">Pricing Management</h1>
      </div>

      <p className="text-gray-400 mb-6">
        Set prices for each seat type (Basic, Recliner, VIP) per show. This allows flexible pricing for different movie times and demand.
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {shows.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center text-gray-400">
          <p>No shows scheduled yet. Create shows first to set prices.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shows.map(show => (
            <div
              key={show.id}
              className="bg-slate-800 rounded-lg shadow border border-slate-700 overflow-hidden"
            >
              {/* Show Header */}
              <div
                className="p-4 hover:bg-slate-700/50 cursor-pointer flex justify-between items-center transition"
                onClick={() => toggleShowExpand(show.id)}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{show.movie_title}</h3>
                  <p className="text-sm text-gray-400">
                    {show.theater_name} - {show.hall_name} | {new Date(show.show_time).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-slate-700 px-3 py-1 rounded-full">
                    {show.price_count}/3 prices set
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${
                      expandedShowId === show.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Pricing Form */}
              {expandedShowId === show.id && (
                <div className="border-t border-slate-700 bg-slate-700/30 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {seatTypes.map(seatType => {
                      const priceObj = prices[show.id]?.[seatType];
                      const price = priceObj?.price || "";

                      return (
                        <div key={seatType} className="bg-slate-700 p-4 rounded-lg">
                          <label className="block text-sm font-semibold text-gray-300 mb-2 capitalize">
                            {seatType} Seat Price
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <span className="absolute left-3 top-2 text-gray-400">₹</span>
                              <input
                                type="number"
                                min="0"
                                step="10"
                                value={price}
                                onChange={(e) => handlePriceChange(show.id, seatType, e.target.value)}
                                placeholder="Enter price"
                                className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-600 border border-slate-500 text-white placeholder-gray-400"
                              />
                            </div>
                            {priceObj?.id && (
                              <button
                                onClick={() => deletePrice(show.id, seatType)}
                                className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 transition"
                                title="Delete price"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => savePrices(show.id)}
                    disabled={savingShowId === show.id}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition"
                  >
                    {savingShowId === show.id ? (
                      <>
                        <Loader className="animate-spin" size={18} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Prices
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pricing Guide */}
      <div className="mt-10 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-300 mb-3">💡 Pricing Strategy Tips</h3>
        <ul className="text-gray-300 space-y-2 text-sm">
          <li>• <strong>Basic Seats:</strong> Standard seats at lower prices (e.g., ₹150-250)</li>
          <li>• <strong>Recliner Seats:</strong> Comfortable recliners at mid-range prices (e.g., ₹250-400)</li>
          <li>• <strong>VIP Seats:</strong> Premium seats with best views at higher prices (e.g., ₹350-600)</li>
          <li>• <strong>Peak Hours Pricing:</strong> Increase prices for evening/weekend shows</li>
          <li>• <strong>New Release Pricing:</strong> Premium prices for newly released movies</li>
        </ul>
      </div>
    </div>
  );
}
