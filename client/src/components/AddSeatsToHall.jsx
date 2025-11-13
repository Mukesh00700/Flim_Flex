import React, { useState } from "react";
import axios from "axios";

const AddSeatsToHall = ({ hallId }) => {
  const [seats, setSeats] = useState([{ row_label: "A", seat_number: 1, seat_type: "basic" }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSeatChange = (idx, field, value) => {
    const updated = seats.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
    setSeats(updated);
  };

  const addSeatRow = () => {
    setSeats([...seats, { row_label: "", seat_number: 1, seat_type: "basic" }]);
  };

  const removeSeatRow = idx => {
    setSeats(seats.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`/api/theaters/halls/${hallId}/seats`, { seats });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Error adding seats");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-bold mb-2">Add Seats to Hall</h2>
      <form onSubmit={handleSubmit}>
        {seats.map((seat, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Row Label"
              value={seat.row_label}
              onChange={e => handleSeatChange(idx, "row_label", e.target.value)}
              className="border px-2 py-1 rounded w-20"
              required
            />
            <input
              type="number"
              min={1}
              placeholder="Seat Number"
              value={seat.seat_number}
              onChange={e => handleSeatChange(idx, "seat_number", Number(e.target.value))}
              className="border px-2 py-1 rounded w-20"
              required
            />
            <select
              value={seat.seat_type}
              onChange={e => handleSeatChange(idx, "seat_type", e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="basic">Basic</option>
              <option value="recliner">Recliner</option>
              <option value="vip">VIP</option>
            </select>
            <button type="button" onClick={() => removeSeatRow(idx)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addSeatRow} className="bg-blue-100 px-2 py-1 rounded">Add Row</button>
        <br />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          {loading ? "Adding..." : "Add Seats"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && <div className="text-green-600 mt-2">Seats added: {result.added.length}</div>}
    </div>
  );
};

export default AddSeatsToHall;
