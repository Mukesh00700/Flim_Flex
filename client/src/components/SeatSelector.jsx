import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Seat = ({ seat, isSelected, onToggle }) => {
  const base = 'inline-flex items-center justify-center border-2 rounded cursor-pointer select-none transition-all transform hover:scale-110';
  
  let cls = base + ' ';
  if (seat.isBooked) {
    cls += 'bg-gray-500 border-gray-600 text-white cursor-not-allowed opacity-50';
  } else if (isSelected) {
    cls += 'bg-green-500 border-green-600 text-white shadow-lg scale-110';
  } else {
    cls += 'bg-white border-gray-300 text-slate-800 hover:bg-blue-50 hover:border-blue-400';
  }

  return (
    <button
      className={`${cls} w-12 h-12 m-1 font-semibold text-sm`}
      onClick={() => !seat.isBooked && onToggle(seat)}
      title={`${seat.row}${seat.number} - ${seat.type} - ₹${seat.price}`}
      disabled={seat.isBooked}
    >
      {seat.row}{seat.number}
    </button>
  );
};

const SeatSelector = ({ showId, onBookingSuccess }) => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!showId) return;
    setLoading(true);
    setError('');
    
    axios.get(`http://localhost:3000/api/bookings/seats/${showId}`)
      .then(res => {
        const data = res.data;
        setShowInfo(data.show);
        setSeats(data.seats || []);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.msg || 'Failed to load seats');
      })
      .finally(() => setLoading(false));
  }, [showId]);

  useEffect(() => {
    const map = {};
    seats.forEach(s => {
      const row = s.row;
      if (!map[row]) map[row] = [];
      map[row].push(s);
    });
    Object.keys(map).forEach(r => map[r].sort((a, b) => a.number - b.number));
    setGrouped(map);
  }, [seats]);

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;
    if (selected.includes(seat.id)) {
      setSelected(selected.filter(id => id !== seat.id));
      setSuccess('');
      return;
    }
    if (selected.length >= 7) {
      setError('You can select a maximum of 7 seats');
      return;
    }
    setSelected([...selected, seat.id]);
    setError('');
  };

  const totalAmount = () => {
    const sel = seats.filter(s => selected.includes(s.id));
    return sel.reduce((sum, s) => sum + (s.price || 0), 0).toFixed(2);
  };

  const selectedSeats = seats.filter(s => selected.includes(s.id));

  const handleBook = async () => {
    if (selected.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to book tickets');
      setTimeout(() => navigate('/loginUser'), 2000);
      return;
    }

    setBooking(true);
    setError('');
    setSuccess('');

    try {
      const payload = { showId, seatIds: selected };
      const res = await axios.post('http://localhost:3000/api/bookings/create', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('✓ Booking successful! Redirecting to bookings...');
      setSelected([]);
      
      setTimeout(() => {
        if (onBookingSuccess) onBookingSuccess(res.data.booking || res.data);
        navigate('/customer/booking-history');
      }, 2000);
    } catch (err) {
      console.error('Booking error', err);
      setError(err.response?.data?.msg || 'Failed to create booking. Please try again.');
    }
    setBooking(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader size={48} className="animate-spin text-blue-400 mb-4" />
        <p className="text-gray-400">Loading seats...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
      {/* Show Info */}
      {showInfo && (
        <div className="mb-8 pb-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-2">{showInfo.movieTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Theater</p>
              <p className="text-white font-semibold">{showInfo.theaterName}</p>
            </div>
            <div>
              <p className="text-gray-400">Hall</p>
              <p className="text-white font-semibold">{showInfo.hallName}</p>
            </div>
            <div>
              <p className="text-gray-400">Time</p>
              <p className="text-white font-semibold">
                {new Date(showInfo.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Language</p>
              <p className="text-white font-semibold">{showInfo.language || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mb-8 p-4 bg-slate-700/50 rounded-lg">
        <p className="text-gray-300 text-sm font-semibold mb-3">Seat Status:</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded" />
            <span className="text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 border-2 border-green-600 rounded" />
            <span className="text-gray-300">Selected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-500 border-2 border-gray-600 rounded opacity-50" />
            <span className="text-gray-300">Booked</span>
          </div>
        </div>
      </div>

      {/* Errors & Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg flex items-start gap-3">
          <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-green-200">{success}</p>
        </div>
      )}

      {/* Seats Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-6">Select Your Seats</h3>
        
        {Object.keys(grouped).length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            No seats available
          </div>
        )}

        <div className="overflow-x-auto">
          {Object.entries(grouped).map(([row, rowSeats]) => (
            <div key={row} className="mb-4">
              <div className="font-bold text-gray-300 mb-2 w-8">Row {row}</div>
              <div className="flex flex-wrap gap-1">
                {rowSeats.map(s => (
                  <Seat
                    key={s.id}
                    seat={{ ...s, row }}
                    isSelected={selected.includes(s.id)}
                    onToggle={toggleSeat}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Screen Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-block border-4 border-gray-400 w-full max-w-md h-2 rounded-full" title="Screen">
            <div className="bg-gray-400 w-full h-full rounded-full opacity-30" />
          </div>
          <p className="text-gray-400 text-sm mt-2">Screen</p>
        </div>
      </div>

      {/* Summary & Booking */}
      <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-gray-400 text-sm">Seats Selected</p>
            <p className="text-2xl font-bold text-white">{selected.length}/7</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Seat Numbers</p>
            <p className="text-white font-semibold text-sm">
              {selectedSeats.length > 0
                ? selectedSeats.map(s => `${s.row}${s.number}`).join(', ')
                : 'None'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Seat Type</p>
            <p className="text-white font-semibold">
              {selectedSeats.length > 0
                ? selectedSeats[0].type
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Amount</p>
            <p className="text-3xl font-bold text-green-400">₹{totalAmount()}</p>
          </div>
        </div>

        <button
          onClick={handleBook}
          disabled={booking || selected.length === 0}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-70"
        >
          {booking ? (
            <span className="flex items-center justify-center gap-2">
              <Loader size={20} className="animate-spin" />
              Processing...
            </span>
          ) : (
            `Book ${selected.length} Seat${selected.length !== 1 ? 's' : ''} for ₹${totalAmount()}`
          )}
        </button>
      </div>
    </div>
  );
};

export default SeatSelector;
