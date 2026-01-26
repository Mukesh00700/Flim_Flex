import React, { useState, useEffect, useMemo } from "react";
import { Film, Loader, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

const SeatsPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [seatCount, setSeatCount] = useState(0);
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH SEATS ---------------- */
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/bookings/seats/${showId}`);

        setShowDetails(response.data.show);
        setSeats(response.data.seats);

        const booked = response.data.seats
          .filter(seat => seat.isBooked)
          .map(seat => `${seat.row}${seat.number}`);

        setBookedSeats(booked);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load seats");
      } finally {
        setLoading(false);
      }
    };

    if (showId) fetchSeats();
  }, [showId]);

  /* ---------------- GROUP SEATS BY ROW ---------------- */
  const seatsByRow = useMemo(() => {
    const grouped = {};
    seats.forEach(seat => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    return grouped;
  }, [seats]);

  const rows = Object.keys(seatsByRow).sort();

  /* ---------------- FAST SEAT LOOKUP ---------------- */
  const seatMap = useMemo(() => {
    const map = {};
    seats.forEach(s => {
      map[`${s.row}${s.number}`] = s;
    });
    return map;
  }, [seats]);

  /* ---------------- SEAT CLICK ---------------- */
  const handleSeatClick = (seat) => {
    const seatId = `${seat.row}${seat.number}`;

    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= seatCount) {
        alert(`You can only select ${seatCount} seats.`);
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  /* ---------------- TOTAL PRICE ---------------- */
  const totalAmount = useMemo(() => {
    return selectedSeats.reduce(
      (sum, id) => sum + (seatMap[id]?.price || 0),
      0
    );
  }, [selectedSeats, seatMap]);

  /* ---------------- POPUP SEAT COUNT ---------------- */
  const handleSeatSelectNumber = (num) => {
    setSeatCount(num);
    setSelectedSeats([]);
    setShowPopup(false);
  };

  /* ---------------- SEAT STYLES ---------------- */
  const getSeatClasses = (seat) => {
    const seatId = `${seat.row}${seat.number}`;
    const base =
      "w-8 h-8 rounded text-xs font-bold border-2 flex items-center justify-center transition-all";

    if (bookedSeats.includes(seatId))
      return `${base} bg-red-500 border-red-600 text-white cursor-not-allowed`;

    if (selectedSeats.includes(seatId))
      return `${base} bg-yellow-400 border-yellow-500 text-black hover:bg-yellow-500`;

    return `${base} bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:scale-110 cursor-pointer`;
  };

  /* ---------------- LOADING / ERROR ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-red-900 text-white p-6 rounded-lg text-center">
          <AlertCircle className="w-10 h-10 mx-auto mb-3" />
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 px-5 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ======================= UI ======================= */
  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4">

      {/* BACK */}
      <button onClick={() => navigate(-1)} className="text-blue-400 mb-6">
        ← Back
      </button>

      {/* SHOW DETAILS */}
      {showDetails && (
        <div className="bg-slate-800 p-6 rounded-lg mb-8 border-l-4 border-yellow-400">
          <h1 className="text-3xl font-bold">{showDetails.movieTitle}</h1>
          <p className="text-slate-300">{showDetails.theaterName}</p>
          <p className="text-slate-400">
            {new Date(showDetails.showTime).toLocaleString()}
          </p>
        </div>
      )}

      {/* LEGEND */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-slate-700 rounded" /> Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-400 rounded" /> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded" /> Booked
        </div>
      </div>

      {/* SEAT GRID */}
      <div className="bg-slate-800 p-8 rounded-lg mb-10">
        {rows.map(row => (
          <div key={row} className="flex items-center justify-center gap-3 mb-3">
            <span className="w-6">{row}</span>

            <div className="flex gap-2">
              {seatsByRow[row].map(seat => (
                <button
                  key={`${seat.row}${seat.number}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={bookedSeats.includes(`${seat.row}${seat.number}`)}
                  className={getSeatClasses(seat)}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SCREEN */}
      <div className="w-1/2 mx-auto bg-gray-200 text-gray-800 py-1 rounded text-center mb-8">
        <Film className="inline w-4 h-4 mr-1" /> SCREEN
      </div>

      {/* FOOTER */}
      {seatCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400">Selected Seats</p>
              <p>{selectedSeats.join(", ") || "None"}</p>
              <p className="text-yellow-400 font-bold">₹{totalAmount}</p>
            </div>

            <button
              disabled={selectedSeats.length !== seatCount}
              onClick={() =>
                navigate("/payment", {
                  state: { showId, seats: selectedSeats, totalAmount, showDetails }
                })
              }
              className={`px-6 py-3 rounded font-semibold ${
                selectedSeats.length !== seatCount
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-yellow-500 text-black hover:bg-yellow-600"
              }`}
            >
              {selectedSeats.length !== seatCount
                ? "Select all seats"
                : `Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>
      )}

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">
              Choose Seat Count
            </h2>
            <div className="grid grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSeatSelectNumber(i + 1)}
                  className="bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SeatsPage;

