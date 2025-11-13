import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  
  // Mock booking data - in real app, this would come from route state or context
  const [bookingDetails] = useState({
    movieTitle: "Inception Dreams",
    theater: "PVR Cinemas - Phoenix Mall",
    date: "November 15, 2025",
    time: "7:00 PM",
    seats: ["E5", "E6", "E7"],
    ticketPrice: 300,
    convenienceFee: 50,
    taxes: 35
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    walletType: 'paytm'
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total amount
  const totalAmount = (bookingDetails.ticketPrice * bookingDetails.seats.length) + 
                      bookingDetails.convenienceFee + 
                      bookingDetails.taxes;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiryDate = (date) => {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateUPI = (upi) => {
    return /^[\w.-]+@[\w.-]+$/.test(upi);
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!formData.cardName || formData.cardName.trim().length < 3) {
        newErrors.cardName = 'Please enter the cardholder name';
      }
      if (!formData.expiryDate || !validateExpiryDate(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!formData.cvv || !validateCVV(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId || !validateUPI(formData.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to confirmation page
      navigate('/booking-confirmation', { 
        state: { 
          bookingDetails,
          paymentMethod,
          totalAmount,
          transactionId: `TXN${Date.now()}`
        } 
      });
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const matches = cleaned.match(/\d{1,4}/g);
    return matches ? matches.join(' ') : '';
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Complete Your Payment</h1>
            <p className="text-slate-400">Secure payment gateway powered by SSL encryption</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Booking Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-slate-400 text-sm">Movie</p>
                    <p className="text-white font-semibold">{bookingDetails.movieTitle}</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm">Theater</p>
                    <p className="text-white">{bookingDetails.theater}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Date</p>
                      <p className="text-white">{bookingDetails.date}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Time</p>
                      <p className="text-white">{bookingDetails.time}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm">Seats</p>
                    <p className="text-white font-semibold">{bookingDetails.seats.join(', ')}</p>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Tickets ({bookingDetails.seats.length}x ₹{bookingDetails.ticketPrice})</span>
                    <span>₹{bookingDetails.ticketPrice * bookingDetails.seats.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Convenience Fee</span>
                    <span>₹{bookingDetails.convenienceFee}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Taxes</span>
                    <span>₹{bookingDetails.taxes}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-slate-700">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💳</div>
                      <p className="text-white font-semibold text-sm">Card</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <p className="text-white font-semibold text-sm">UPI</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'wallet'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👛</div>
                      <p className="text-white font-semibold text-sm">Wallet</p>
                    </div>
                  </button>
                </div>

                <form onSubmit={handlePayment}>
                  {/* Card Payment */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            if (formatted.replace(/\s/g, '').length <= 16) {
                              handleInputChange({ target: { name: 'cardNumber', value: formatted }});
                            }
                          }}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full px-4 py-3 bg-slate-900 border ${
                            errors.cardNumber ? 'border-red-500' : 'border-slate-700'
                          } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 bg-slate-900 border ${
                            errors.cardName ? 'border-red-500' : 'border-slate-700'
                          } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.cardName && (
                          <p className="text-red-400 text-sm mt-1">{errors.cardName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 mb-2 font-medium">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            className={`w-full px-4 py-3 bg-slate-900 border ${
                              errors.expiryDate ? 'border-red-500' : 'border-slate-700'
                            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-slate-300 mb-2 font-medium">CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="4"
                            className={`w-full px-4 py-3 bg-slate-900 border ${
                              errors.cvv ? 'border-red-500' : 'border-slate-700'
                            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {errors.cvv && (
                            <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Payment */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">UPI ID</label>
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          placeholder="yourname@upi"
                          className={`w-full px-4 py-3 bg-slate-900 border ${
                            errors.upiId ? 'border-red-500' : 'border-slate-700'
                          } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.upiId && (
                          <p className="text-red-400 text-sm mt-1">{errors.upiId}</p>
                        )}
                      </div>
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <p className="text-slate-300 text-sm">
                          💡 Enter your UPI ID and you'll receive a payment request on your UPI app
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Wallet Payment */}
                  {paymentMethod === 'wallet' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">Select Wallet</label>
                        <select
                          name="walletType"
                          value={formData.walletType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="paytm">Paytm</option>
                          <option value="phonepe">PhonePe</option>
                          <option value="googlepay">Google Pay</option>
                          <option value="amazonpay">Amazon Pay</option>
                        </select>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <p className="text-slate-300 text-sm">
                          💡 You'll be redirected to your wallet app to complete the payment
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing Payment...
                        </span>
                      ) : (
                        `Pay ₹${totalAmount}`
                      )}
                    </button>
                    
                    <p className="text-center text-slate-400 text-sm mt-4">
                      🔒 Your payment information is secure and encrypted
                    </p>
                  </div>
                </form>
              </div>

              {/* Payment Security Info */}
              <div className="mt-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Secure Payment</h3>
                    <p className="text-slate-400 text-sm">
                      All transactions are secured with 256-bit SSL encryption. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
