import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import { Check, Download, Home, Loader, AlertCircle } from 'lucide-react';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { bookingId, transactionId } = location.state || {};

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!bookingId) {
          setError('No booking found. Please go back and try again.');
          setLoading(false);
          return;
        }

        const response = await API.get(`/payments/booking/${bookingId}`);
        
        if (response.data.success) {
          setBooking(response.data.booking);
        } else {
          setError(response.data.msg || 'Failed to load booking details');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.response?.data?.msg || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleDownloadTicket = () => {
    // TODO: Implement ticket download/PDF generation
    alert('Ticket download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Oops!</h2>
          <p className="text-red-200 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 border border-green-500 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-slate-400">Your tickets have been booked successfully</p>
          </div>

          {/* Booking Details */}
          {booking && (
            <>
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
                  <p className="text-blue-100 text-sm mb-1">Booking ID</p>
                  <p className="text-white text-2xl font-bold">{booking.id}</p>
                </div>

                {/* Details Grid */}
                <div className="p-6 space-y-6">
                  {/* Movie & Theater */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Movie</p>
                      <p className="text-white text-xl font-semibold">{booking.movie_title}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Theater</p>
                      <p className="text-white text-xl font-semibold">{booking.theater_name}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Date & Time</p>
                      <p className="text-white font-semibold">
                        {new Date(booking.show_time).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Hall</p>
                      <p className="text-white font-semibold">{booking.hall_name}</p>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="border-t border-slate-700 pt-6">
                    <p className="text-slate-400 text-sm mb-3">Seats Booked</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.seats && booking.seats.map((seat, idx) => (
                        <div
                          key={idx}
                          className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg font-semibold"
                        >
                          {seat}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">Total Amount Paid</span>
                      <span className="text-white font-bold">₹{booking.total_amount}</span>
                    </div>
                    {transactionId && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Transaction ID</span>
                        <span className="text-slate-300 font-mono">{transactionId.substring(0, 16)}...</span>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-green-400 font-semibold">Payment Successful</span>
                    <span className="text-slate-400 text-sm ml-2">
                      {new Date(booking.updated_at || booking.booking_time).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={handleDownloadTicket}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Tickets
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </button>
              </div>

              {/* Important Info */}
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3">Important Information</h3>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>✓ A confirmation email has been sent to your registered email address</li>
                  <li>✓ Please arrive 15 minutes before the show starts</li>
                  <li>✓ Present your booking ID or downloaded tickets at the theater</li>
                  <li>✓ Keep your transaction ID for any queries or cancellations</li>
                  <li>✓ Cancellations are allowed up to 30 minutes before show time</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
