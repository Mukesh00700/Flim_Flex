import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Loader, AlertCircle, Calendar, MapPin, Ticket, X } from 'lucide-react';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('upcoming'); // upcoming or past
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await API.get('/bookings/user');
        
        if (response.data.success) {
          setBookings(response.data.bookings || []);
        } else {
          setError(response.data.msg || 'Failed to load bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.msg || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filterBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const showTime = new Date(booking.show_time);
      if (tab === 'upcoming') {
        return showTime > now && booking.payment_status !== 'cancelled';
      } else {
        return showTime <= now || booking.payment_status === 'cancelled';
      }
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const response = await API.delete(`/payments/booking/${bookingId}`);
      
      if (response.data.success) {
        // Update bookings list
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, payment_status: 'cancelled' } : b
        ));
        alert(`Booking cancelled. Refund of ₹${response.data.refundAmount} will be processed.`);
      } else {
        alert(response.data.msg || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.response?.data?.msg || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  const filteredBookings = filterBookings();

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="text-blue-400 hover:text-blue-300 flex items-center mb-4 transition"
            >
              ← Back to Home
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
            <p className="text-slate-400">View and manage your movie tickets</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-700">
            <button
              onClick={() => setTab('upcoming')}
              className={`py-3 px-6 font-semibold transition-colors ${
                tab === 'upcoming'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming Shows ({bookings.filter(b => new Date(b.show_time) > new Date() && b.payment_status !== 'cancelled').length})
            </button>
            <button
              onClick={() => setTab('past')}
              className={`py-3 px-6 font-semibold transition-colors ${
                tab === 'past'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Shows ({bookings.filter(b => new Date(b.show_time) <= new Date() || b.payment_status === 'cancelled').length})
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-8 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No {tab === 'upcoming' ? 'upcoming' : 'past'} bookings
              </h3>
              <p className="text-slate-400 mb-6">
                {tab === 'upcoming' 
                  ? 'You haven\'t booked any upcoming shows yet.'
                  : 'You haven\'t watched any movies yet.'}
              </p>
              <button
                onClick={() => navigate('/movies')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
              >
                Explore Movies
              </button>
            </div>
          )}

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition"
              >
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{booking.movie_title}</h3>
                    
                    <div className="space-y-2 text-slate-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>{booking.theater_name} - {booking.hall_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>{new Date(booking.show_time).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-blue-400" />
                        <span>Booking ID: <span className="font-mono font-semibold">{booking.id}</span></span>
                      </div>
                    </div>

                    {/* Seats */}
                    {booking.seats && booking.seats.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {booking.seats.map((seat, idx) => (
                          <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                            Seat {seat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="mt-4">
                      {booking.payment_status === 'paid' && (
                        <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          Confirmed
                        </span>
                      )}
                      {booking.payment_status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                          Cancelled
                        </span>
                      )}
                      {booking.payment_status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition text-sm font-semibold"
                      disabled={true}
                    >
                      Download Tickets
                    </button>
                    
                    {new Date(booking.show_time) > new Date() && booking.payment_status === 'paid' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white py-2 px-4 rounded-lg transition text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        {cancellingId === booking.id ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Cancel Booking
                          </>
                        )}
                      </button>
                    )}

                    {tab === 'past' && (
                      <button
                        onClick={() => navigate('/movies')}
                        className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition text-sm font-semibold"
                      >
                        Book Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
