import React, { useState } from "react";
import axios from "axios";
import SeatConfigPreview from "./SeatConfigPreview";

const AddSeatsToHall = ({ hallId, onClose, onSuccess }) => {
  const [config, setConfig] = useState({
    totalSeats: 100,
    seatsPerRow: 10,
    basicSeats: 50,
    reclinerSeats: 30,
    vipSeats: 20
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const totalTypesSum = config.basicSeats + config.reclinerSeats + config.vipSeats;
  const isValid = totalTypesSum === config.totalSeats;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid) {
      setError(`Sum of seat types (${totalTypesSum}) must equal total seats (${config.totalSeats})`);
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3000/theater/halls/${hallId}/seats`,
        { seatConfiguration: config },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResult(res.data);
      if (onSuccess) onSuccess(res.data);
      
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Error adding seats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-4 text-white">Add Seats to Hall</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Total Seats Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Total Seats *
            </label>
            <input
              type="number"
              min="1"
              value={config.totalSeats}
              onChange={(e) => handleChange("totalSeats", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Seats per Row *
            </label>
            <input
              type="number"
              min="1"
              value={config.seatsPerRow}
              onChange={(e) => handleChange("seatsPerRow", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
              required
            />
          </div>
        </div>

        {/* Seat Type Configuration */}
        <div className="border border-slate-600 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-white mb-2">Seat Types Distribution</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              🪑 Basic Seats
            </label>
            <input
              type="number"
              min="0"
              value={config.basicSeats}
              onChange={(e) => handleChange("basicSeats", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              💺 Recliner Seats
            </label>
            <input
              type="number"
              min="0"
              value={config.reclinerSeats}
              onChange={(e) => handleChange("reclinerSeats", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              👑 VIP Seats
            </label>
            <input
              type="number"
              min="0"
              value={config.vipSeats}
              onChange={(e) => handleChange("vipSeats", e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
            />
          </div>
        </div>

        {/* Validation Message */}
        <div className={`p-3 rounded-lg ${isValid ? 'bg-green-500/20 border border-green-500' : 'bg-yellow-500/20 border border-yellow-500'}`}>
          <p className={`text-sm ${isValid ? 'text-green-300' : 'text-yellow-300'}`}>
            {isValid 
              ? `✓ Valid: ${totalTypesSum} seat types = ${config.totalSeats} total seats`
              : `⚠ Sum of seat types (${totalTypesSum}) must equal total seats (${config.totalSeats})`
            }
          </p>
        </div>

        {/* Visual Preview */}
        {isValid && <SeatConfigPreview config={config} />}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-xs text-blue-300">
            <strong>Distribution:</strong> VIP seats at front rows, Recliner in middle, Basic at back.
            <br />
            <strong>Rows:</strong> Auto-generated (A-Z, AA-AZ, etc.) based on total seats and seats per row.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Display */}
        {result && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-lg">
            <p className="font-semibold">✓ Seats added successfully!</p>
            <p className="text-sm mt-1">
              Total: {result.breakdown?.total} | 
              Basic: {result.breakdown?.basic} | 
              Recliner: {result.breakdown?.recliner} | 
              VIP: {result.breakdown?.vip}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !isValid}
            className={`flex-1 py-3 rounded-lg text-white font-semibold transition ${
              loading || !isValid
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {loading ? "Adding Seats..." : "Add Seats"}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-500 py-3 rounded-lg text-white font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddSeatsToHall;
