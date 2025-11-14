import React, { useState, useEffect } from "react";
import { Film, Loader } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const SeatsPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showData, setShowData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { showId } = useParams();
  const [searchParams] = useSearchParams();
  const showIdFromQuery = searchParams.get('showId');
  
  const finalShowId = showId || showIdFromQuery;

  useEffect(() => {
    if (finalShowId) {
      fetchSeats();
    } else {
      setError("No show selected");
      setLoading(false);
    }
  }, [finalShowId]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/bookings/seats/${finalShowId}`);
      setShowData(response.data.show);
      setSeats(response.data.seats);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load seats");
    } finally {
      setLoading(false);
    }
  };


  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    const seatIndex = selectedSeats.findIndex(s => s.id === seat.id);
    if (seatIndex > -1) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Group seats by row and type for display
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // Get unique seat types with their prices
  const seatTypes = [...new Set(seats.map(s => s.type))].map(type => {
    const seat = seats.find(s => s.type === type);
    return {
      type,
      price: seat?.price || 0
    };
  });


  const handleSeatSelectNumber = (num) => {
    setSeatCount(num);
    setShowPopup(false);
    setSelectedSeats([]);
  };

  const getSeatClasses = (seat) => {
    if (seat.isBooked)
      return "bg-gray-400 border-gray-400 text-gray-200 cursor-not-allowed";
    if (selectedSeats.find(s => s.id === seat.id))
      return "bg-green-500 border-green-600 text-white shadow-lg scale-105";
    
    // Different colors based on seat type
    if (seat.type === 'vip')
      return "bg-purple-100 border-purple-400 text-purple-700 hover:bg-purple-200 hover:scale-105";
    if (seat.type === 'recliner')
      return "bg-blue-100 border-blue-400 text-blue-700 hover:bg-blue-200 hover:scale-105";
    return "bg-gray-100 border-gray-400 text-gray-700 hover:bg-gray-200 hover:scale-105";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-500 text-red-700 p-6 rounded-lg">
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 flex flex-col items-center py-8 px-4 relative overflow-x-hidden">
      {/* Show Info */}
      {showData && (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-800">{showData.movieTitle}</h1>
          <p className="text-gray-600">{showData.theaterName} - {showData.hallName}</p>
          <p className="text-gray-500">{new Date(showData.showTime).toLocaleString()}</p>
          {showData.language && <p className="text-blue-600">{showData.language}</p>}
        </div>
      )}

      {/* Legend */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 border border-gray-400 rounded"></div>
          <span className="text-sm">Basic (₹{seatTypes.find(t => t.type === 'basic')?.price || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 border border-blue-400 rounded"></div>
          <span className="text-sm">Recliner (₹{seatTypes.find(t => t.type === 'recliner')?.price || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-100 border border-purple-400 rounded"></div>
          <span className="text-sm">VIP (₹{seatTypes.find(t => t.type === 'vip')?.price || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 border border-green-600 rounded"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 border border-gray-400 rounded"></div>
          <span className="text-sm">Booked</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="w-full flex flex-col items-center space-y-3 max-w-4xl">
        {Object.keys(groupedSeats).sort().map((row) => (
          <div key={row} className="flex items-center gap-3">
            <span className="text-gray-600 font-semibold w-8 text-right">{row}</span>
            <div className="flex gap-2">
              {groupedSeats[row]
                .sort((a, b) => a.number - b.number)
                .map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                    className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded border-2 transition-all duration-200 ${getSeatClasses(seat)}`}
                    title={`${row}${seat.number} - ${seat.type} - ₹${seat.price}`}
                  >
                    {seat.number}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🖥️ Screen */}
      <div className="w-1/2 bg-gray-200 text-center py-1 rounded-lg mt-10 mb-4 text-gray-800 font-semibold shadow-inner flex items-center justify-center">
        <Film className="w-4 h-4 mr-1 text-gray-600" />
        SCREEN — All eyes this way 👀
      </div>

      {/* 🎟️ Booking Summary */}
      <div className="bg-white shadow-lg rounded-xl p-5 w-full max-w-md text-center border-t-4 border-blue-500 mt-8 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Booking Summary</h3>
        <p className="text-gray-700">
          Selected Seats:{" "}
          <span className="font-semibold text-blue-700">
            {selectedSeats.length > 0
              ? selectedSeats.map(s => `${s.row}${s.number}`).join(", ")
              : "None"}
          </span>
        </p>
        <p className="text-gray-700 mt-1">
          Total:{" "}
          <span className="font-semibold text-green-600">₹{totalAmount}</span>
        </p>

        {/* ✅ Proceed to Pay button */}
        <button
          onClick={() => {
            if (!showData) {
              alert("Show information not available");
              return;
            }
            navigate("/payment", {
              state: {
                showId: finalShowId,
                movie: showData.movieTitle,
                theatre: `${showData.theaterName} - ${showData.hallName}`,
                showtime: new Date(showData.showTime).toLocaleString(),
                seats: selectedSeats.map(s => ({
                  id: s.id,
                  label: `${s.row}${s.number}`,
                  type: s.type,
                  price: s.price
                })),
                ticketPrice: totalAmount / selectedSeats.length,
                totalAmount: totalAmount,
                language: showData.language || "N/A",
              },
            });
          }}
          disabled={selectedSeats.length === 0}
          className={`mt-3 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-transform duration-300 ${
            selectedSeats.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105"
          }`}
        >
          {selectedSeats.length === 0
            ? "Select Seats to Proceed"
            : `Proceed to Pay ₹${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default SeatsPage;
