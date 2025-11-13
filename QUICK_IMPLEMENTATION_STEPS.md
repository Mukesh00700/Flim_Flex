# 🎬 Movie Ticket Booking WebApp - Quick Implementation Steps

## ✅ JUST COMPLETED

Your ticket booking routes are now mounted! You can test immediately.

---

## 🚀 NEXT STEPS (In Order)

### STEP 1: Test Your API (5 minutes)

Start your server:
```bash
cd server
npm run dev
```

Test the endpoints using Postman, Thunder Client, or curl:

```bash
# 1. Get shows
curl "http://localhost:3000/api/bookings/shows?movieId=1&date=2025-11-12"

# 2. Get available seats
curl "http://localhost:3000/api/bookings/seats/1"

# 3. Login to get token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 4. Validate booking (replace TOKEN with actual token)
curl -X POST http://localhost:3000/api/bookings/validate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"showId":1,"seatIds":[1,3,5]}'

# 5. View bookings
curl http://localhost:3000/api/bookings/my-bookings \
  -H "Authorization: Bearer TOKEN"
```

---

### STEP 2: Setup Payment Gateway (30-60 minutes)

#### Option A: RAZORPAY (Recommended for India)

1. **Create Razorpay Account**
   - Go to https://razorpay.com
   - Sign up and verify
   - Get API keys from dashboard

2. **Install Razorpay**
   ```bash
   cd server
   npm install razorpay
   ```

3. **Add to .env**
   ```
   RAZORPAY_KEY_ID=your_key_here
   RAZORPAY_KEY_SECRET=your_secret_here
   ```

4. **Create payment controller** - See STEP 2A below

#### Option B: STRIPE

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up and verify
   - Get API keys

2. **Install Stripe**
   ```bash
   cd server
   npm install stripe
   ```

3. **Add to .env**
   ```
   STRIPE_SECRET_KEY=your_key_here
   STRIPE_PUBLISHABLE_KEY=your_publishable_key
   ```

---

### STEP 2A: Create Payment Controller (Razorpay)

Create file: `server/controllers/paymentController.js`

```javascript
import Razorpay from 'razorpay';
import pool from '../config/db.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
export const createPaymentOrder = async (req, res) => {
  const { amount, bookingId } = req.body;
  
  if (!amount || !bookingId) {
    return res.status(400).json({ msg: 'Amount and bookingId required' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId
      }
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Payment order error:', error);
    res.status(500).json({ msg: 'Payment order creation failed' });
  }
};

// Verify payment signature
export const verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature, bookingId } = req.body;

  try {
    const crypto = await import('crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === signature) {
      // Payment verified - update booking
      await pool.query(
        `UPDATE bookings SET payment_status = 'paid', payment_reference = $1 WHERE id = $2`,
        [paymentId, bookingId]
      );

      res.status(200).json({ msg: 'Payment verified successfully' });
    } else {
      res.status(400).json({ msg: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ msg: 'Verification failed' });
  }
};
```

---

### STEP 3: Create Payment Routes

Create file: `server/routes/paymentRoutes.js`

```javascript
import express from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);

export default router;
```

---

### STEP 4: Mount Payment Routes in server/index.js

Add import:
```javascript
import paymentRoutes from "./routes/paymentRoutes.js";
```

Add route:
```javascript
try{
    console.log("loading payment route");
    app.use("/api/payments", paymentRoutes);
}catch(e){
    console.log("Couldn't connect to payment route", e);
}
```

---

### STEP 5: Create React Components

Create directory: `client/src/components/BookingComponents/`

#### Component 1: SeatSelector.jsx

```jsx
import React, { useState, useEffect } from 'react';

export const SeatSelector = ({ showId, onSelectSeats }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showInfo, setShowInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
  }, [showId]);

  const fetchSeats = async () => {
    try {
      const response = await fetch(`/api/bookings/seats/${showId}`);
      const data = await response.json();
      setSeats(data.seats);
      setShowInfo(data.show);
    } catch (error) {
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

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
    onSelectSeats(selectedSeats);
  };

  if (loading) return <div className="p-4">Loading seats...</div>;

  // Group seats by row
  const seatsByRow = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.row]) seatsByRow[seat.row] = [];
    seatsByRow[seat.row].push(seat);
  });

  // Calculate total
  const total = selectedSeats.reduce((sum, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return sum + (seat?.price || 0);
  }, 0);

  return (
    <div className="bg-slate-800 p-6 rounded-lg text-white space-y-6">
      {showInfo && (
        <div className="text-center border-b border-slate-700 pb-4">
          <h3 className="text-xl font-bold">{showInfo.movieTitle}</h3>
          <p className="text-sm text-gray-400">{showInfo.theaterName} - {showInfo.hallName}</p>
          <p className="text-sm text-gray-400">{new Date(showInfo.showTime).toLocaleString()}</p>
        </div>
      )}

      {/* Screen */}
      <div className="text-center py-2 border-t-4 border-gray-400 mb-4">
        <p className="text-gray-400 text-sm">SCREEN</p>
      </div>

      {/* Seats Grid */}
      <div className="space-y-2">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex justify-center gap-1 items-center">
            <span className="w-6 text-center font-bold text-xs">{row}</span>
            <div className="flex gap-1">
              {rowSeats.map(seat => (
                <button
                  key={seat.id}
                  onClick={() => !seat.isBooked && toggleSeat(seat.id)}
                  disabled={seat.isBooked}
                  className={`w-7 h-7 rounded text-xs font-bold transition ${
                    seat.isBooked
                      ? 'bg-gray-500 cursor-not-allowed'
                      : selectedSeats.includes(seat.id)
                      ? 'bg-green-500'
                      : seat.type === 'vip'
                      ? 'bg-purple-500 hover:bg-purple-600'
                      : seat.type === 'recliner'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  title={`${row}${seat.number} - ₹${seat.price}`}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center text-xs mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Basic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Recliner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Selected Seats & Total */}
      <div className="bg-slate-700 p-4 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">
          Selected: {selectedSeats.length > 0 ? 'Calculating...' : 'None'}
        </p>
        <p className="text-xl font-bold text-green-400">Total: ₹{total}</p>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        disabled={selectedSeats.length === 0}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default SeatSelector;
```

#### Component 2: BookingFlow.jsx

```jsx
import React, { useState } from 'react';
import SeatSelector from './SeatSelector';

export const BookingFlow = () => {
  const [step, setStep] = useState('shows'); // shows, seats, payment, confirmation
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleShowSelect = (showId) => {
    setSelectedShow(showId);
    setStep('seats');
  };

  const handleSeatsSelect = (seatIds) => {
    setSelectedSeats(seatIds);
    setStep('payment');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book Your Tickets 🎬</h1>

        {/* Progress Bar */}
        <div className="flex justify-between mb-8">
          {['shows', 'seats', 'payment', 'confirmation'].map((s, idx) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === s ? 'bg-blue-600' : 
                ['shows', 'seats', 'payment', 'confirmation'].indexOf(step) > idx ? 'bg-green-600' :
                'bg-gray-600'
              }`}>
                {idx + 1}
              </div>
              {idx < 3 && <div className={`flex-1 h-1 mx-2 ${
                ['shows', 'seats', 'payment', 'confirmation'].indexOf(step) > idx ? 'bg-green-600' : 'bg-gray-600'
              }`}></div>}
            </div>
          ))}
        </div>

        {/* Content */}
        {step === 'seats' && selectedShow && (
          <SeatSelector showId={selectedShow} onSelectSeats={handleSeatsSelect} />
        )}

        {step === 'payment' && (
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Payment</h2>
            <p className="mb-4">Total Amount: ₹{totalAmount}</p>
            <p className="text-gray-400 p-4 bg-slate-700 rounded">
              Payment gateway integration goes here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
```

---

### STEP 6: Create New Page for Booking

Create file: `client/src/pages/TicketBookingPage.jsx`

```jsx
import React from 'react';
import BookingFlow from '../components/BookingComponents/BookingFlow';

const TicketBookingPage = () => {
  return <BookingFlow />;
};

export default TicketBookingPage;
```

---

### STEP 7: Add Route to App.jsx

```jsx
import TicketBookingPage from "./pages/TicketBookingPage";

// In Routes:
<Route path="/booking" element={<TicketBookingPage />} />
```

---

## 📋 Checklist

- [x] Mount ticket booking routes ✅
- [ ] Setup payment gateway (Razorpay/Stripe)
- [ ] Create payment controller
- [ ] Mount payment routes
- [ ] Create seat selector component
- [ ] Create booking flow component
- [ ] Add booking page to routes
- [ ] Test complete flow
- [ ] Add email notifications
- [ ] Add admin features
- [ ] Deploy to production

---

## 🧪 Testing Sequence

1. **Start server & test API endpoints** (5 min)
2. **Setup payment gateway** (15 min)
3. **Create React components** (30 min)
4. **Test booking flow end-to-end** (15 min)

---

## 📞 Need Help?

Refer to:
- `TICKET_BOOKING_API.md` - API details
- `TICKET_BOOKING_GUIDE.md` - Controller details
- `REACT_COMPONENTS_EXAMPLES.md` - Component examples
- `WEBAPP_COMPLETION_GUIDE.md` - Full overview

---

## 🎯 Your Next Move

**Choose ONE:**

1. **If you want Razorpay:** Reply and I'll create complete payment integration
2. **If you want Stripe:** Reply and I'll create Stripe integration
3. **If you want to skip payment for now:** I'll create mock payment component

Which one? 🚀
