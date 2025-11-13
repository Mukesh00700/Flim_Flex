import React, { useState } from "react";
import {
  Smartphone,
  CreditCard,
  Globe,
  QrCode,
  Film,
  CheckCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // 🎫 Booking data (get from seats page or fallback dummy)
  const bookingDetails = state || {
    movie: "Ek Deewane Ki Deewaniyat",
    theatre: "Cinepolis: DB Mall, Bhopal (AUDI 2)",
    showtime: "Wed, 12 Nov, 2025 | 07:15 PM",
    seats: ["L7", "L8"],
    language: "Hindi (2D)",
    section: "EXECUTIVE",
    price: 420,
    convenienceFee: 70.8,
  };

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const total = bookingDetails.price + bookingDetails.convenienceFee;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL: Payment Options */}
        <div className="bg-white rounded-lg shadow-lg col-span-1">
          <h2 className="text-lg font-semibold p-4 border-b">Payment options</h2>

          {/* UPI */}
          <div
            onClick={() => setPaymentMethod("UPI")}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-l-4 ${
              paymentMethod === "UPI"
                ? "border-red-500 bg-red-50"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <Smartphone className="text-gray-600 w-5 h-5" />
            <span className="font-medium text-gray-700">Pay by any UPI App</span>
          </div>

          {/* Card */}
          <div
            onClick={() => setPaymentMethod("CARD")}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-l-4 ${
              paymentMethod === "CARD"
                ? "border-red-500 bg-red-50"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <CreditCard className="text-gray-600 w-5 h-5" />
            <span className="font-medium text-gray-700">Debit / Credit Card</span>
          </div>

          {/* Net Banking */}
          <div
            onClick={() => setPaymentMethod("NETBANKING")}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-l-4 ${
              paymentMethod === "NETBANKING"
                ? "border-red-500 bg-red-50"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <Globe className="text-gray-600 w-5 h-5" />
            <span className="font-medium text-gray-700">Net Banking</span>
          </div>
        </div>

        {/* MIDDLE PANEL: Payment Method Details */}
        <div className="bg-white rounded-lg shadow-lg col-span-1 p-6">
          {paymentMethod === "UPI" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pay using UPI</h3>
              <div className="space-y-4">
                {/* GPay */}
                <div className="flex items-center justify-between border p-3 rounded-md hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png"
                      alt="GPay"
                      className="w-12"
                    />
                    <span className="font-medium text-gray-800">Google Pay</span>
                  </div>
                  <button className="text-blue-600 font-medium text-sm hover:underline">
                    Proceed →
                  </button>
                </div>

                {/* QR Option */}
                <div className="flex flex-col items-center mt-5">
                  <p className="text-gray-500 mb-2">Or</p>
                  <div className="border rounded-lg p-3 flex items-center gap-3 shadow-sm">
                    <QrCode className="text-gray-600 w-6 h-6" />
                    <div>
                      <p className="font-medium text-gray-700">Scan QR code</p>
                      <p className="text-xs text-gray-500">
                        You need a registered UPI ID
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "CARD" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pay by Card</h3>
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="border p-2 w-full rounded-md"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="border p-2 w-1/2 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="border p-2 w-1/2 rounded-md"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="border p-2 w-full rounded-md"
                />
              </form>
            </div>
          )}

          {paymentMethod === "NETBANKING" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pay via Net Banking</h3>
              <select className="border p-2 rounded-md w-full">
                <option>Select Bank</option>
                <option>SBI</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Punjab National Bank</option>
              </select>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`mt-6 w-full py-2 rounded-lg text-white font-semibold shadow-md transition-transform duration-300 ${
              isProcessing
                ? "bg-gray-400 cursor-wait"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:scale-105"
            }`}
          >
            {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
          </button>
        </div>

        {/* RIGHT PANEL: Booking Summary */}
        <div className="bg-white rounded-lg shadow-lg col-span-1 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{bookingDetails.movie}</h3>
            <span className="text-sm text-red-500 font-medium">🎟️ M-Ticket</span>
          </div>

          <p className="text-sm text-gray-600">{bookingDetails.showtime}</p>
          <p className="text-sm text-gray-600 mb-3">
            {bookingDetails.language} • {bookingDetails.section}
          </p>

          <p className="text-sm font-medium text-gray-700 mb-2">
            {bookingDetails.theatre}
          </p>

          <div className="bg-orange-50 text-orange-700 text-xs p-2 rounded-md mb-4">
            ⚠️ Cancellation unavailable — this venue does not support booking cancellation.
          </div>

          <div className="space-y-1 text-sm text-gray-700 border-b pb-2 mb-2">
            <div className="flex justify-between">
              <span>Ticket(s) price</span>
              <span>₹{bookingDetails.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience fees</span>
              <span>₹{bookingDetails.convenienceFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between font-semibold text-gray-800 text-base mb-3">
            <span>Order Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="border rounded-md p-3 text-sm text-gray-700 mb-3">
            <p className="font-medium mb-1">For Booking Details</p>
            <p>📞 8765739120</p>
            <p>📧 adityadwivedi525@gmail.com</p>
            <button className="text-blue-600 text-xs font-medium mt-1 hover:underline">
              Edit
            </button>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-2 rounded-md text-white font-semibold ${
              isProcessing ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
          </button>
        </div>
      </div>

      {/* ✅ Success Message */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 backdrop-blur-sm text-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-80">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-green-700 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">Your booking is confirmed 🎉</p>
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
