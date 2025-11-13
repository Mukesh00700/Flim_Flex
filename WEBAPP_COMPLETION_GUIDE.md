# Complete Movie Ticket Booking WebApp - Checklist & Implementation Guide

## Current Status ✅

You have:
- ✅ Backend Controllers for ticket booking (ticketBookingControllers.js)
- ✅ Routes setup for bookings
- ✅ Database schema with all tables
- ✅ Authentication system (JWT)
- ✅ Frontend pages: BookingsPage, CustomerBookingsPage
- ✅ Admin and Customer dashboards
- ✅ Movies page

---

## What's Still Missing & To-Do

### 🔴 CRITICAL - MUST DO FIRST

#### 1. **Mount Ticket Booking Routes** ⚠️
**File:** `server/index.js`
**Status:** NOT YET DONE

```javascript
// Add this import at the top
import ticketBookingRoutes from "./routes/ticketBookingRoutes.js";

// Add this in the routes section (around line 35-45)
try{
    console.log("loading ticket booking route");
    app.use("/api/bookings", ticketBookingRoutes);
}catch(e){
    console.log("Couldn't connect to ticket booking route");
}
```

---

### 🟡 HIGH PRIORITY

#### 2. **Payment Gateway Integration**
**Files:** Need new middleware/utilities

Create `server/utils/paymentGateway.js`:
```javascript
// Support for Razorpay or Stripe
// - Process payments
// - Verify payment signatures
// - Handle webhooks
```

**Options:**
- **Razorpay** (Best for India) - Add `razorpay` to package.json
- **Stripe** - Add `stripe` to package.json
- **PayPal** - Add `@paypal/checkout-server-sdk`

#### 3. **Email Notifications**
**Files:** Create `server/utils/emailService.js`

Features:
- Booking confirmation email
- Booking cancellation email
- Booking reminder email (24 hours before show)

Uses: Nodemailer (already in package.json)

#### 4. **SMS Notifications** (Optional but recommended)
**Files:** Create `server/utils/smsService.js`

Uses: Twilio or AWS SNS

---

### 🟢 MEDIUM PRIORITY

#### 5. **React Components for Ticket Booking**
Create `client/src/components/BookingComponents/`:

```
TicketBookingFlow.jsx          - Main booking flow orchestrator
ShowsSelector.jsx              - Show selection component
SeatSelector.jsx               - Interactive seat selection map
BookingSummary.jsx             - Shows booking details & total
PaymentGateway.jsx             - Payment processing
BookingConfirmation.jsx        - Confirmation page
```

#### 6. **Booking Page Implementation**
**File:** Create dedicated page `client/src/pages/TicketBookingPage.jsx`
- Integrate all booking components
- Handle multi-step flow
- State management for booking process

#### 7. **Admin Dashboard Enhancements**
**File:** Update `client/src/pages/AdminDashboard.jsx`

Add sections for:
- Revenue analytics
- Booking trends
- Show management
- Theater management

#### 8. **Customer Profile Enhancements**
**Files:** Update customer pages

Add:
- Download booking tickets (PDF)
- Edit profile
- Change password (partially done)
- Booking cancellation policy
- Refund status tracking

---

### 🔵 NICE-TO-HAVE

#### 9. **Advanced Features**

**Seat Availability Real-time Updates**
- WebSocket integration for live seat updates
- Already have socket.io in package.json

**Promotional Codes**
- Database table for coupons
- Discount calculation logic
- Coupon validation

**Favorite Theaters/Movies**
- Wishlist functionality
- Personalized recommendations

**Reviews & Ratings**
- Theater reviews
- Movie ratings
- Already have ReviewCard & ReviewsSection components

**Search & Filtering**
- Filter by city, theater, language, time
- Search by movie name

**Mobile App**
- React Native version of frontend

---

## Detailed Implementation Plan

### PHASE 1: Setup (TODAY - 1 hour)

**Task 1.1:** Mount Ticket Booking Routes
```bash
cd server
# Edit index.js and add ticketBookingRoutes import
```

**Task 1.2:** Test API endpoints
```bash
# Test in Postman or Thunderclient
GET  http://localhost:3000/api/bookings/shows?movieId=1&date=2025-11-12
GET  http://localhost:3000/api/bookings/seats/1
```

### PHASE 2: Payment Integration (2-3 hours)

**Task 2.1:** Choose Payment Gateway
- Razorpay recommended for India
- Install: `npm install razorpay`

**Task 2.2:** Create payment controller
```javascript
// server/controllers/paymentController.js
- verifyPayment()
- createPaymentOrder()
- handlePaymentWebhook()
```

**Task 2.3:** Update createBooking to integrate payment
```javascript
// In ticketBookingControllers.js
// Link payment verification with booking creation
```

### PHASE 3: Frontend Components (3-4 hours)

**Task 3.1:** Create seat selector component
- Interactive seat map
- Real-time availability
- Price display

**Task 3.2:** Create booking flow page
- Step-by-step process
- Progress indicator
- State management

**Task 3.3:** Payment form component
- Razorpay/Stripe checkout
- Error handling

**Task 3.4:** Confirmation page
- Display booking details
- Download ticket
- Share option

### PHASE 4: Notifications (1-2 hours)

**Task 4.1:** Email service
- Confirmation emails
- Cancellation emails
- Reminders

**Task 4.2:** SMS service (Optional)
- Booking confirmation
- Show reminders

### PHASE 5: Admin Features (2-3 hours)

**Task 5.1:** Booking analytics dashboard
- Revenue reports
- Booking trends
- Occupancy rates

**Task 5.2:** Theater management
- Add/edit theaters
- Manage halls
- Set seat prices

**Task 5.3:** Show management
- Create/edit shows
- Set pricing
- View bookings

---

## Code Examples

### Example 1: Mount Routes (MUST DO NOW)

**server/index.js**
```javascript
import ticketBookingRoutes from "./routes/ticketBookingRoutes.js";

// ... existing code ...

try{
    console.log("loading ticket booking route");
    app.use("/api/bookings", ticketBookingRoutes);
}catch(e){
    console.log("Couldn't connect to ticket booking route", e);
}
```

### Example 2: Payment Integration (Razorpay)

**server/controllers/paymentController.js**
```javascript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  const { amount, bookingId } = req.body;
  
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
    });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: 'Payment order creation failed' });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  // Verify signature
  // Update booking with payment info
  // Return success
};
```

### Example 3: React Seat Selector

**client/src/components/BookingComponents/SeatSelector.jsx**
```jsx
import React, { useState, useEffect } from 'react';

export const SeatSelector = ({ showId, onSelectSeats }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  useEffect(() => {
    // Fetch seats from /api/bookings/seats/:showId
    fetchSeats();
  }, [showId]);
  
  const toggleSeat = (seatId) => {
    // Toggle seat selection
  };
  
  return (
    <div className="seat-selector">
      {/* Render seat grid */}
      {/* Show seat prices */}
      {/* Display total */}
    </div>
  );
};
```

---

## Database Checks ✅

Your database already has:
- ✅ users table
- ✅ movies table
- ✅ theaters table
- ✅ halls table
- ✅ shows table
- ✅ seats table
- ✅ bookings table
- ✅ booking_seats table
- ✅ prices table

No migrations needed!

---

## Environment Variables Needed

**.env file should have:**
```
JWT_SECRET=your_secret_key
ADMIN_SECRET=your_admin_secret

# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=FLIM_FLEX
DB_PASSWORD=your_password
DB_PORT=5432

# Payment Gateway (Add these)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Email Service (Add these)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail

# Optional: SMS Service
TWILIO_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=your_phone
```

---

## NPM Packages to Add

```bash
# Server packages
npm install razorpay                  # Payment gateway
npm install nodemailer                # Email (already have)
npm install twilio                    # SMS (optional)
npm install socket.io                 # Real-time updates (already have)

# Client packages
npm install react-icons               # Icons for UI
npm install react-hot-toast           # Notifications
npm install axios                     # HTTP client
```

---

## Testing Checklist

### API Testing (Postman/Thunderclient)
- [ ] GET /api/bookings/shows - Works
- [ ] GET /api/bookings/seats/:showId - Works
- [ ] POST /api/bookings/validate - Works (with token)
- [ ] POST /api/bookings/create - Works (with payment)
- [ ] GET /api/bookings/my-bookings - Works (with token)
- [ ] GET /api/bookings/:bookingId - Works (with token)
- [ ] PUT /api/bookings/:bookingId/cancel - Works (with token)

### Frontend Testing
- [ ] Booking page loads
- [ ] Shows display correctly
- [ ] Seat selector works
- [ ] Booking validation works
- [ ] Payment gateway integrates
- [ ] Booking confirmation shows
- [ ] Booking history displays
- [ ] Cancel booking works
- [ ] Responsive on mobile

---

## Priority Recommendation

**IMMEDIATE (Next 30 minutes):**
1. Mount ticket booking routes in server/index.js
2. Test API with Postman

**THIS WEEK (Next 2-3 days):**
1. Integrate Razorpay payment gateway
2. Create seat selector component
3. Create booking flow page

**NEXT WEEK (Next 1-2 weeks):**
1. Email notifications
2. Admin dashboard enhancements
3. Customer profile enhancements

**LATER (Next 1-2 months):**
1. SMS notifications
2. Advanced features (reviews, ratings, wishlists)
3. Mobile app

---

## Resources & Documentation

Already provided:
- ✅ `server/TICKET_BOOKING_API.md` - Full API docs
- ✅ `server/TICKET_BOOKING_GUIDE.md` - Implementation guide
- ✅ `REACT_COMPONENTS_EXAMPLES.md` - React examples
- ✅ `TICKET_BOOKING_SUMMARY.md` - Quick overview

External:
- [Razorpay Documentation](https://razorpay.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Nodemailer Guide](https://nodemailer.com)
- [React Router Guide](https://reactrouter.com)

---

## Next Steps

1. **Reply with which payment gateway you prefer** (Razorpay/Stripe)
2. I'll provide complete payment integration code
3. Then we'll build the React components
4. Finally, email notifications

Ready to proceed! 🚀
