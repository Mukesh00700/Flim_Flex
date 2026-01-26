import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import { Loader, AlertCircle, Check } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const bookingData = location.state || {};
  const { showId, seats = [], totalAmount = 0, showDetails = {} } = bookingData;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const orderResponse = await API.post('/payments/create-order', {
        seats,
        totalAmount,
        showId
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.msg);
      }

      const { orderId, bookingId } = orderResponse.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        name: 'Flim Flex',
        description: `Movie Booking - ${showDetails.movieTitle || 'Movie'}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await API.post('/payments/verify-payment', {
              orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              bookingId,
              seats,
              totalAmount,
              showId
            });

            if (verifyResponse.data.success) {
              setPaymentStatus('success');
              setTimeout(() => {
                navigate('/booking-confirmation', {
                  state: {
                    bookingId: verifyResponse.data.bookingId,
                    bookingDetails: bookingData,
                    transactionId: response.razorpay_payment_id
                  }
                });
              }, 2000);
            } else {
              throw new Error(verifyResponse.data.msg);
            }
          } catch (verifyError) {
            console.error('Verification error:', verifyError);
            setError('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || ''
        },
        theme: { color: '#3b82f6' },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setError('Payment cancelled. Please try again.');
          }
        }
      };

      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay script not loaded. Please refresh and try again.');
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-400 hover:text-blue-300 flex items-center mb-4 transition"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Complete Your Payment</h1>
            <p className="text-slate-400">Secure payment via Razorpay</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-8 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Payment Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {paymentStatus === 'success' && (
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-8 text-center">
              <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-slate-300 mb-4">Redirecting to booking confirmation...</p>
              <Loader className="w-6 h-6 text-green-400 animate-spin mx-auto" />
            </div>
          )}

          {/* Main Content */}
          {!paymentStatus && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
                  <h2 className="text-xl font-bold text-white mb-6">Booking Summary</h2>

                  <div className="space-y-4 mb-6">
                    {showDetails?.movieTitle && (
                      <div>
                        <p className="text-slate-400 text-sm">Movie</p>
                        <p className="text-white font-semibold">{showDetails.movieTitle}</p>
                      </div>
                    )}

                    {showDetails?.theaterName && (
                      <div>
                        <p className="text-slate-400 text-sm">Theater</p>
                        <p className="text-white">{showDetails.theaterName}</p>
                      </div>
                    )}

                    {showDetails?.showTime && (
                      <div>
                        <p className="text-slate-400 text-sm">Date & Time</p>
                        <p className="text-white">
                          {new Date(showDetails.showTime).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {seats.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-sm">Seats</p>
                        <p className="text-white font-semibold">{seats.join(', ')}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-700 pt-4 space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Seats ({seats.length})</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-slate-700">
                      <span>Total Amount</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>

                  <div className="bg-slate-900 rounded-lg p-6 border-2 border-dashed border-yellow-500 mb-6">
                    <p className="text-center text-slate-300 mb-4">
                      Click the button below to pay securely using Razorpay
                    </p>
                    <p className="text-center text-slate-400 text-sm">
                      Supports: Credit/Debit Card, UPI, Netbanking, Wallets
                    </p>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || !seats.length || !totalAmount}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-all transform flex items-center justify-center gap-2 ${
                      isProcessing || !seats.length || !totalAmount
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-105'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : !seats.length || !totalAmount ? (
                      'No booking data - Go back to select seats'
                    ) : (
                      <>
                        Pay ₹{totalAmount}
                      </>
                    )}
                  </button>

                  {/* Security Info */}
                  <div className="mt-8 bg-green-900/10 border border-green-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-green-200 font-semibold">Secure & Safe</p>
                        <p className="text-green-300 text-sm">
                          Powered by Razorpay - 256-bit SSL encryption. Your payment details are never stored.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
