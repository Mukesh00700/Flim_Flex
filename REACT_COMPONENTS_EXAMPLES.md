# React Components - Ticket Booking Frontend Examples

This file contains example React components showing how to integrate the ticket booking API with your frontend.

## 1. Shows Listing Component

```jsx
import React, { useState, useEffect } from 'react';

export const ShowsListing = ({ movieId, selectedDate }) => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId || !selectedDate) return;

    const fetchShows = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/bookings/shows?movieId=${movieId}&date=${selectedDate}`
        );
        const data = await response.json();
        
        if (response.ok) {
          setShows(data.shows);
          setError(null);
        } else {
          setError(data.msg);
        }
      } catch (err) {
        setError('Failed to fetch shows');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [movieId, selectedDate]);

  if (loading) return <div className="text-center py-4">Loading shows...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (shows.length === 0) return <div className="text-gray-600">No shows available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {shows.map(show => (
        <div key={show.showId} className="border rounded-lg p-4 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-bold">{show.theaterName}</p>
              <p className="text-sm text-gray-600">{show.city}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {show.language}
            </span>
          </div>
          <p className="text-lg font-semibold mb-2">
            {new Date(show.showTime).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
          <div className="flex justify-between text-sm mb-3">
            <span>Hall: {show.hallName}</span>
            <span>{show.availableSeats} seats available</span>
          </div>
          <button
            onClick={() => selectShow(show.showId)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Select Show
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 2. Seat Selection Component

```jsx
import React, { useState, useEffect } from 'react';

export const SeatSelection = ({ showId, onSeatsSelected }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showId) return;

    const fetchSeats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/bookings/seats/${showId}`);
        const data = await response.json();
        
        if (response.ok) {
          setSeats(data.seats);
          setShowDetails(data.show);
        }
      } catch (err) {
        console.error('Error fetching seats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [showId]);

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    onSeatsSelected(selectedSeats);
  };

  // Group seats by row
  const seatsByRow = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = [];
    }
    seatsByRow[seat.row].push(seat);
  });

  if (loading) return <div className="text-center py-4">Loading seats...</div>;

  return (
    <div className="space-y-4">
      {showDetails && (
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>{showDetails.movieTitle}</strong></p>
          <p className="text-sm text-gray-600">
            {showDetails.theaterName} - {showDetails.hallName}
          </p>
        </div>
      )}

      <div className="border-t-4 border-gray-400 py-4 text-center text-sm text-gray-600 font-semibold">
        SCREEN
      </div>

      <div className="space-y-2">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex justify-center gap-2 items-center">
            <span className="w-8 font-bold">{row}</span>
            <div className="flex gap-2">
              {rowSeats.map(seat => (
                <button
                  key={seat.id}
                  onClick={() => !seat.isBooked && toggleSeat(seat.id)}
                  disabled={seat.isBooked}
                  className={`w-8 h-8 rounded text-xs font-semibold transition ${
                    seat.isBooked
                      ? 'bg-gray-300 cursor-not-allowed'
                      : selectedSeats.includes(seat.id)
                      ? 'bg-green-600 text-white'
                      : seat.type === 'vip'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : seat.type === 'recliner'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  title={`${row}${seat.number} - $${seat.price} - ${seat.type}`}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-around text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded"></div>
            <span>Basic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-600 rounded"></div>
            <span>Recliner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded"></div>
            <span>VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <span>Booked</span>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded">
          <p className="text-sm">
            <strong>Selected Seats:</strong> {selectedSeats.length > 0 
              ? 'Calculating...' 
              : 'None'}
          </p>
        </div>

        <button
          onClick={handleProceed}
          disabled={selectedSeats.length === 0}
          className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};
```

## 3. Booking Validation Component

```jsx
import React, { useState, useEffect } from 'react';

export const BookingValidation = ({ showId, seatIds, token, onValidated }) => {
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateBooking = async () => {
      try {
        const response = await fetch('/api/bookings/validate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            showId,
            seatIds
          })
        });

        const data = await response.json();

        if (response.ok) {
          setValidation(data);
          setError(null);
        } else {
          setError(data.msg);
        }
      } catch (err) {
        setError('Validation failed');
      } finally {
        setLoading(false);
      }
    };

    validateBooking();
  }, [showId, seatIds, token]);

  if (loading) return <div className="text-center py-4">Validating booking...</div>;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-800 font-semibold">Error</p>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded p-4">
        <p className="text-green-800 font-semibold mb-3">Booking Summary</p>
        
        <table className="w-full text-sm">
          <tbody>
            {validation.seatDetails.map(seat => (
              <tr key={seat.id} className="border-b">
                <td className="py-2">{seat.seat}</td>
                <td className="text-right">${seat.price}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="py-2 pt-3">Total</td>
              <td className="text-right text-lg text-green-700">
                ${validation.totalAmount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={() => onValidated(validation)}
        className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
      >
        Proceed to Payment
      </button>
    </div>
  );
};
```

## 4. Booking History Component

```jsx
import React, { useState, useEffect } from 'react';

export const BookingHistory = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, [filter, page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/bookings/my-bookings?status=${filter}&limit=5&offset=${page * 5}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      
      if (response.ok) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && bookings.length === 0) {
    return <div className="text-center py-4">Loading bookings...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'paid', 'pending', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => { setFilter(status); setPage(0); }}
            className={`px-4 py-2 rounded capitalize transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {bookings.map(booking => (
          <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-lg">{booking.movieTitle}</p>
                <p className="text-sm text-gray-600">
                  {booking.theaterName} - {booking.hallName}
                </p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                getStatusColor(booking.paymentStatus)
              }`}>
                {booking.paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <p className="text-gray-600">Show Time</p>
                <p className="font-semibold">
                  {new Date(booking.showTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-semibold">${booking.totalAmount}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Seats</p>
                <p className="font-semibold">{booking.seats.join(', ')}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition">
                View Details
              </button>
              {booking.paymentStatus === 'paid' && (
                <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition">
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No bookings found
        </div>
      )}
    </div>
  );
};
```

## 5. Complete Booking Page Component

```jsx
import React, { useState } from 'react';
import { ShowsListing } from './ShowsListing';
import { SeatSelection } from './SeatSelection';
import { BookingValidation } from './BookingValidation';

export const BookingPage = ({ movieId, token }) => {
  const [currentStep, setCurrentStep] = useState('shows'); // shows, seats, validate, payment
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleShowSelected = (showId) => {
    setSelectedShowId(showId);
    setCurrentStep('seats');
  };

  const handleSeatsSelected = (seatIds) => {
    setSelectedSeatIds(seatIds);
    setCurrentStep('validate');
  };

  const handleValidated = (validationData) => {
    // Store validation data and proceed to payment
    setCurrentStep('payment');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Book Your Tickets</h1>

      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {['shows', 'seats', 'validate', 'payment'].map((step, idx) => (
          <div
            key={step}
            className={`flex items-center ${
              idx < 3 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                currentStep === step || 
                (['shows', 'seats', 'validate', 'payment'].indexOf(currentStep) > idx)
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
            >
              {idx + 1}
            </div>
            {idx < 3 && (
              <div className={`flex-1 h-1 mx-2 ${
                ['shows', 'seats', 'validate', 'payment'].indexOf(currentStep) > idx
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 'shows' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <ShowsListing 
            movieId={movieId} 
            selectedDate={selectedDate}
          />
        </div>
      )}

      {currentStep === 'seats' && selectedShowId && (
        <SeatSelection
          showId={selectedShowId}
          onSeatsSelected={handleSeatsSelected}
        />
      )}

      {currentStep === 'validate' && selectedShowId && selectedSeatIds.length > 0 && (
        <BookingValidation
          showId={selectedShowId}
          seatIds={selectedSeatIds}
          token={token}
          onValidated={handleValidated}
        />
      )}

      {currentStep === 'payment' && (
        <div className="bg-blue-50 border border-blue-200 rounded p-6 text-center">
          <p className="text-lg font-semibold text-blue-900 mb-4">
            Payment Integration Needed
          </p>
          <p className="text-blue-800 mb-4">
            Integrate your payment gateway here (Stripe, Razorpay, etc.)
          </p>
          <button
            onClick={() => setCurrentStep('validate')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};
```

## Usage in Your App

```jsx
import { BookingPage } from './components/BookingPage';
import { BookingHistory } from './components/BookingHistory';

function App() {
  const token = localStorage.getItem('token');
  const movieId = 1; // From route params or props

  return (
    <div>
      {/* Booking Page */}
      <BookingPage movieId={movieId} token={token} />

      {/* Or Booking History */}
      <BookingHistory token={token} />
    </div>
  );
}
```

## Notes

- Replace `onSeatsSelected`, `selectShow`, etc. with actual navigation logic
- Integrate actual payment gateway (Stripe, Razorpay, PayPal, etc.)
- Add error boundaries for production
- Add loading states and animations
- Implement proper error handling and user feedback
- Add confirmation dialogs for cancellations
- Make components fully responsive for mobile

