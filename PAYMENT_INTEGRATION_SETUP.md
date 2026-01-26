# Flim Flex - Movie Ticket Booking Application

## Payment Setup Guide

### Razorpay Integration

To enable payment processing, you need to set up Razorpay payment gateway.

#### 1. Create Razorpay Account

1. Go to https://razorpay.com
2. Sign up for a free account
3. Complete KYC verification (can take 2-3 business days, but test mode works immediately)
4. Go to Dashboard → Settings → API Keys
5. Copy your **Key ID** and **Key Secret**

#### 2. Configure Environment Variables

Add these to your `.env` files:

**Server (.env)**
```
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Client (.env.local)**
```
REACT_APP_RAZORPAY_KEY_ID=your_key_id_here
```

#### 3. Install Dependencies

**Server:**
```bash
cd server
npm install razorpay
```

**Client:**
```bash
cd client
npm install (razorpay is loaded via CDN, no npm package needed)
```

#### 4. Test Payment Flow

**Razorpay Test Cards:**
- Card: 4111 1111 1111 1111
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- OTP: 123456

#### 5. Payment Flow in Application

1. User selects seats on SeatsPage
2. Clicks "Proceed to Pay" → navigates to PaymentPage with booking data
3. PaymentPage calls `/payments/create-order` to create Razorpay order
4. Razorpay checkout modal opens
5. User completes payment
6. PaymentPage calls `/payments/verify-payment` to verify signature
7. Backend creates booking records in database
8. User redirected to BookingConfirmationPage

#### 6. API Endpoints

- `POST /payments/create-order` - Create Razorpay order
  - Body: { seats: [], totalAmount: 0, showId: 1 }
  - Returns: { orderId, bookingId, amount, currency }

- `POST /payments/verify-payment` - Verify payment signature
  - Body: { orderId, paymentId, signature, bookingId, seats, totalAmount, showId }
  - Returns: { success, msg, bookingId }

- `GET /payments/booking/:bookingId` - Get booking details
  
- `DELETE /payments/booking/:bookingId` - Cancel booking

#### 7. Database Changes

The following migrations have been added:
- `add_razorpay_payment_fields.sql` - Adds payment-related fields to bookings and booking_seats tables

Run migrations before starting the server:
```bash
npm run migrate
```

#### 8. Production Setup

When going to production:
1. Complete KYC verification on Razorpay
2. Switch from test keys to live keys
3. Update environment variables with live keys
4. Ensure database backups are in place
5. Set up email notifications for booking confirmation

#### 9. Troubleshooting

**"Razorpay script not loaded"**
- Check browser console for CORS errors
- Ensure Razorpay CDN is accessible from client

**"Payment verification failed"**
- Check that RAZORPAY_KEY_SECRET matches in server
- Verify signature calculation is correct
- Check database connection for storing orders

**Test Payment Not Working**
- Ensure you're using test mode keys (not live keys)
- Clear browser cache and cookies
- Try different test card
- Check server logs for errors

For support: razorpay.com/support
