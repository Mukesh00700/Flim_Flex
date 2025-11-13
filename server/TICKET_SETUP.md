# 🎫 Ticket Generation - Quick Setup Guide

## ✅ What's Implemented

Automated ticket generation system that:
- Generates beautiful HTML tickets with QR codes
- Emails tickets automatically after payment
- Allows ticket verification at theaters
- Supports ticket resending

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies

The `qrcode` package has already been installed for you.

### Step 2: Run Database Migration

Add the tickets table to your database:

**Using psql:**
```bash
psql -U postgres -d filmflex -f server/migrations/add_tickets_table.sql
```

**Using pgAdmin:**
1. Open pgAdmin
2. Connect to `filmflex` database
3. Open Query Tool
4. Copy contents of `server/migrations/add_tickets_table.sql`
5. Execute

**Manual SQL:**
```sql
-- Run this in your PostgreSQL database
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    show_id INT REFERENCES shows(id) ON DELETE CASCADE,
    verification_code VARCHAR(10) NOT NULL,
    qr_code_data TEXT NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_ticket_id ON tickets(ticket_id);
CREATE INDEX idx_tickets_booking_id ON tickets(booking_id);

ALTER TABLE bookings ADD COLUMN ticket_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE bookings ADD COLUMN ticket_sent_at TIMESTAMPTZ;
```

### Step 3: Configure Email (If Not Already Done)

Make sure your `server/.env` has:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CLIENT_URL=http://localhost:5174
```

---

## 🎯 How It Works

### Automatic Flow

```
Payment Successful
    ↓
Booking Created
    ↓
Ticket Generated (unique ID + QR code)
    ↓
Ticket Emailed to User
    ↓
User Arrives at Theater
    ↓
Staff Scans QR Code
    ↓
Entry Granted
```

### What Gets Generated

**1. Ticket ID**: `FLX-20251113-15-A3B2`
   - Format: FLX-{Date}-{BookingID}-{Random}

**2. QR Code**: Contains all ticket data
   - Can be scanned at theater
   - Includes verification code

**3. Verification Code**: `7F4E2A`
   - 6-digit backup code
   - For manual entry if QR fails

**4. Beautiful Email**: Professional HTML ticket
   - Movie details
   - Theater & seat info
   - QR code for scanning
   - Instructions

---

## 📡 New API Endpoints

### Customer Endpoints

**Get Ticket**
```
GET /api/bookings/ticket/:bookingId
Authorization: Bearer {token}
```

**Resend Ticket**
```
POST /api/bookings/ticket/:bookingId/resend
Authorization: Bearer {token}
```

### Staff/Admin Endpoint

**Verify Ticket**
```
POST /api/bookings/ticket/verify
Authorization: Bearer {admin_token}
Body: {
  "ticketId": "FLX-20251113-15-A3B2",
  "verificationCode": "7F4E2A"
}
```

---

## 🧪 Testing

### Test Ticket Generation

1. **Make a booking with payment:**
```bash
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "showId": 1,
    "seatIds": [10, 11],
    "paymentDetails": {
      "transactionId": "TEST123",
      "status": "paid"
    }
  }'
```

2. **Check your email** - You should receive a beautiful ticket!

3. **View ticket via API:**
```bash
curl http://localhost:3000/api/bookings/ticket/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

4. **Resend ticket:**
```bash
curl -X POST http://localhost:3000/api/bookings/ticket/1/resend \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📧 Email Preview

Your users will receive an email like this:

```
┌────────────────────────────────────┐
│         🎬 FilmFlex                │
│      Your Movie Ticket             │
│      ✓ CONFIRMED                   │
├────────────────────────────────────┤
│                                    │
│   FLX-20251113-15-A3B2            │
│                                    │
│   Inception                        │
│                                    │
│   📅 Wednesday, Nov 14, 2025       │
│   🕐 7:00 PM                       │
│                                    │
│   🏢 PVR Cinemas                   │
│   🎬 Screen 1                      │
│                                    │
│   💺 YOUR SEATS                    │
│      A1, A2, A3                    │
│                                    │
│   [QR CODE IMAGE]                  │
│                                    │
│   Verification Code: 7F4E2A        │
│                                    │
│   Total Paid: ₹750.00              │
│                                    │
│   📋 Instructions:                 │
│   • Arrive 15 mins early           │
│   • Show this QR code at entrance  │
│   • Carry valid ID                 │
│                                    │
└────────────────────────────────────┘
```

---

## 💻 Frontend Integration

### Display Ticket Page

```jsx
// pages/TicketPage.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const TicketPage = () => {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/bookings/ticket/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => setTicket(data));
  }, [bookingId]);

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="ticket-container">
      <h1>{ticket.ticketId}</h1>
      <h2>{ticket.show.movieTitle}</h2>
      <p>{new Date(ticket.show.showTime).toLocaleString()}</p>
      <p>{ticket.show.theaterName}</p>
      <p>Seats: {ticket.show.seats.join(', ')}</p>
      
      {/* QR Code */}
      <img src={ticket.qrCode} alt="QR Code" />
      <p>Code: {ticket.verificationCode}</p>

      {/* Resend Button */}
      <button onClick={() => {
        fetch(`http://localhost:3000/api/bookings/ticket/${bookingId}/resend`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(() => alert('Ticket sent to your email!'));
      }}>
        Resend to Email
      </button>
    </div>
  );
};
```

### Add Route to App.jsx

```jsx
import TicketPage from './pages/TicketPage';

// In Routes
<Route path="/ticket/:bookingId" element={<TicketPage />} />
```

### Update Payment Success Flow

```jsx
// After successful payment
const response = await fetch('/api/bookings/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    showId,
    seatIds,
    paymentDetails: {
      transactionId: paymentId,
      status: 'paid'
    }
  })
});

const data = await response.json();

// Redirect to ticket page
navigate(`/ticket/${data.booking.id}`, {
  state: { message: 'Payment successful! Check your email for the ticket.' }
});
```

---

## 🎬 Theater Staff Scanner App

For theater staff to verify tickets, you can create a simple scanner:

```jsx
// pages/TicketScanner.jsx (Admin Page)
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const TicketScanner = () => {
  const [result, setResult] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      const ticketData = JSON.parse(data.text);
      
      const response = await fetch(
        'http://localhost:3000/api/bookings/ticket/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            ticketId: ticketData.ticketId,
            verificationCode: ticketData.verificationCode
          })
        }
      );

      const result = await response.json();
      setResult(result);
    }
  };

  return (
    <div>
      <h1>Scan Ticket</h1>
      <QrReader onResult={handleScan} />
      
      {result && (
        <div className={result.success ? 'success' : 'error'}>
          <h2>{result.msg}</h2>
          {result.success && (
            <div>
              <p>Movie: {result.ticket.movieTitle}</p>
              <p>Seats: {result.ticket.seats.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

---

## 📝 Files Modified

✅ **New Files:**
- `server/utils/ticketGenerator.js` - Ticket generation utilities
- `server/migrations/add_tickets_table.sql` - Database migration
- `server/TICKET_GENERATION.md` - Full documentation

✅ **Updated Files:**
- `server/controllers/ticketBookingControllers.js` - Added ticket generation
- `server/routes/ticketBookingRoutes.js` - Added ticket routes
- `server/config/nodemailer.js` - Added sendTicketEmail function

---

## ✨ What Happens Now

### When User Makes a Booking:

1. ✅ User selects seats and proceeds to payment
2. ✅ Payment successful → booking created
3. ✅ **Ticket automatically generated** with:
   - Unique ticket ID
   - QR code
   - Verification code
4. ✅ **Ticket emailed** to user with:
   - Beautiful HTML design
   - All show details
   - QR code to scan
   - Instructions
5. ✅ User can:
   - View ticket on website
   - Show QR code at theater
   - Resend ticket if needed

### At Theater:

1. ✅ User shows QR code
2. ✅ Staff scans code
3. ✅ System verifies:
   - Valid ticket ID
   - Correct verification code
   - Not used before
   - Payment confirmed
4. ✅ Entry granted
5. ✅ Ticket marked as used

---

## 🎉 Summary

You now have:
- ✅ Automatic ticket generation after payment
- ✅ Beautiful email tickets with QR codes
- ✅ Ticket viewing on website
- ✅ Resend ticket functionality
- ✅ QR code verification system
- ✅ One-time use security

**All you need to do:**
1. Run the database migration
2. Test with a booking
3. Create frontend ticket page
4. Optionally: Create scanner for theater staff

---

**Need help?** Check `TICKET_GENERATION.md` for complete documentation!

🚀 **Your ticket system is ready to use!**
