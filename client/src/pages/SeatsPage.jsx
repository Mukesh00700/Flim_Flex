import React, { useState } from "react";
import { Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SeatsPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [seatCount, setSeatCount] = useState(0);

  const navigate = useNavigate();

  // 🎞️ Define sections
  const sections = [
    { name: "VIP", price: 260, rows: ["A"], cols: 10 },
    { name: "PREMIUM", price: 180, rows: ["B", "C", "D"], cols: 14 },
    { name: "EXECUTIVE", price: 130, rows: ["E", "F", "G"], cols: 14 },
  ];

  // ❌ Already booked seats
  const bookedSeats = ["A5", "A6", "C7", "E8", "G9", "G10"];

  // 🧠 Toggle seat selection (add/remove)
  const handleSeatClick = (seatId) => {
    const section = sections.find((s) => s.rows.includes(seatId.charAt(0)));
    if (!section || bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length < seatCount) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        alert(`⚠️ You can only select ${seatCount} seats.`);
      }
    }
  };

  // 💰 Calculate total dynamically
  const totalAmount = selectedSeats.reduce((sum, seat) => {
    const section = sections.find((s) => s.rows.includes(seat.charAt(0)));
    return sum + (section ? section.price : 0);
  }, 0);

  // 🎟️ Seat count popup
  const handleSeatSelectNumber = (num) => {
    setSeatCount(num);
    setShowPopup(false);
    setSelectedSeats([]);
  };

  // 🎨 Seat color logic
  const getSeatClasses = (seatId) => {
    if (bookedSeats.includes(seatId))
      return "bg-gray-300 border-gray-300 text-gray-400 cursor-not-allowed";
    if (selectedSeats.includes(seatId))
      return `
        bg-yellow-300 border-yellow-400 text-gray-700
        shadow-[0_0_10px_rgba(255,215,0,0.8)]
        font-semibold scale-105
      `;
    return `
      bg-white border-2 border-green-400 text-gray-700
      hover:bg-green-50 hover:scale-105
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 flex flex-col items-center py-8 px-4 relative overflow-x-hidden">

      {/* 🎟️ Popup for seat count */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-2xl border border-gray-700 text-center w-80 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-3 text-yellow-400">🎬 Choose Seat Count</h2>
            <p className="mb-4 text-gray-300">Select how many seats you want</p>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleSeatSelectNumber(i + 1)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🔴 Seat count display */}
      {seatCount > 0 && (
        <div className="fixed top-4 right-6 flex items-center space-x-3 z-40">
          <p className="text-red-500 font-semibold text-lg bg-red-50 px-4 py-1 rounded-md shadow-sm">
            Seats: {seatCount}
          </p>
          <button
            onClick={() => setShowPopup(true)}
            className="text-blue-700 underline text-sm font-medium hover:text-blue-900"
          >
            Edit
          </button>
        </div>
      )}

      {/* 🚪 Entry label */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 rotate-90 text-sm">
        ENTRY →
      </div>

      {/* 🪑 Seat Layout */}
      <div className="w-full flex flex-col items-center space-y-8">
        {sections.map((section) => (
          <div key={section.name} className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              ₹{section.price} {section.name}
            </h2>

            <div className="space-y-3">
              {section.rows.map((row) => (
                <div key={row} className="flex justify-center items-center space-x-3">
                  {/* Left block */}
                  <div className="flex space-x-2">
                    {Array.from({ length: section.cols / 2 }, (_, i) => {
                      const seatId = `${row}${i + 1}`;
                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(seatId)}
                          className={`w-9 h-9 flex items-center justify-center text-[12px] font-bold rounded-md border transition-all duration-200 ease-in-out ${getSeatClasses(seatId)}`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle */}
                  <div className="w-10" />

                  {/* Right block */}
                  <div className="flex space-x-2">
                    {Array.from({ length: section.cols / 2 }, (_, i) => {
                      const seatId = `${row}${i + 1 + section.cols / 2}`;
                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(seatId)}
                          className={`w-9 h-9 flex items-center justify-center text-[12px] font-bold rounded-md border transition-all duration-200 ease-in-out ${getSeatClasses(seatId)}`}
                        >
                          {String(i + 1 + section.cols / 2).padStart(2, "0")}
                        </button>
                      );
                    })}
                  </div>
                </div>
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
      <div className="bg-white shadow-lg rounded-xl p-5 w-full max-w-md text-center border-t-4 border-blue-500 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Booking Summary</h3>
        <p className="text-gray-700">
          Selected Seats:{" "}
          <span className="font-semibold text-blue-700">
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </span>
        </p>
        <p className="text-gray-700 mt-1">
          Total:{" "}
          <span className="font-semibold text-green-600">₹{totalAmount}</span>
        </p>

        {/* ✅ Proceed to Pay button */}
        <button
          onClick={() =>
            navigate("/payment", {
              state: {
                movie: "Ek Deewane Ki Deewaniyat",
                theatre: "Cinepolis: DB Mall, Bhopal (AUDI 2)",
                showtime: "Wed, 12 Nov, 2025 | 07:15 PM",
                seats: selectedSeats,
                section: "EXECUTIVE",
                price: totalAmount,
                convenienceFee: 70.8,
                language: "Hindi (2D)",
              },
            })
          }
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
