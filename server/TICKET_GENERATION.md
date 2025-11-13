# 🎫 Ticket Generation System Documentation

## Overview

FilmFlex now includes an automated ticket generation and delivery system that creates beautiful, scannable movie tickets after successful payment.

---

## ✨ Features

- ✅ **Automatic Ticket Generation**: Tickets generated immediately after successful payment
- ✅ **QR Code Integration**: Each ticket has a unique QR code for verification
- ✅ **Email Delivery**: Professional HTML tickets sent via email
- ✅ **Verification System**: Theater staff can verify tickets with QR codes
- ✅ **Resend Functionality**: Users can request ticket resends
- ✅ **Beautiful Design**: Professional, responsive ticket design
- ✅ **Unique Ticket IDs**: Format: FLX-YYYYMMDD-{bookingId}-{random}
- ✅ **6-Digit Verification Code**: Backup verification method
- ✅ **One-Time Use**: Tickets marked as used after entry

---

## 🗄️ Database Setup

### Run Migration

```bash
cd server
psql -U postgres -d filmflex -f migrations/add_tickets_table.sql
```

Or using Node.js:

```javascript
import pool from './config/db.js';
import fs from 'fs';

const sql = fs.readFileSync('migrations/add_tickets_table.sql', 'utf8');
await pool.query(sql);
```

### New Tables

**tickets**
```sql
id                  SERIAL PRIMARY KEY
ticket_id           VARCHAR(50) UNIQUE
booking_id          INT REFERENCES bookings(id)
user_id             INT REFERENCES users(id)
show_id             INT REFERENCES shows(id)
verification_code   VARCHAR(10)
qr_code_data        TEXT (base64 QR code image)
is_used             BOOLEAN DEFAULT FALSE
used_at             TIMESTAMPTZ
created_at          TIMESTAMPTZ DEFAULT NOW()
```

**bookings (updated)**
```sql
ticket_sent         BOOLEAN DEFAULT FALSE
ticket_sent_at      TIMESTAMPTZ
```

---

## 📡 API Endpoints

### 1. Create Booking (Updated)

**POST** `/api/bookings/create`

**Request:**
```json
{
  "showId": 1,
  "seatIds": [10, 11, 12],
  "paymentDetails": {
    "transactionId": "TXN123456789",
    "status": "paid",
    "method": "card"
  }
}
```

**Response:**
```json
{
  "msg": "Booking created successfully",
  "booking": {
    "id": 15,
    "movieTitle": "Inception",
    "theaterName": "PVR Cinemas",
    "hallName": "Screen 1",
    "showTime": "2025-11-14T19:00:00Z",
    "seats": ["A1", "A2", "A3"],
    "totalAmount": 750.00,
    "paymentStatus": "paid",
    "bookingTime": "2025-11-13T10:30:00Z",
    "ticketSent": true
  },
  "ticket": {
    "ticketId": "FLX-20251113-15-A3B2",
    "verificationCode": "7F4E2A",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS..."
  }
}
```

**Ticket Email**: Automatically sent to user's email

---

### 2. Get Ticket by Booking ID

**GET** `/api/bookings/ticket/:bookingId`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "ticketId": "FLX-20251113-15-A3B2",
  "verificationCode": "7F4E2A",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "isUsed": false,
  "usedAt": null,
  "booking": {
    "id": 15,
    "totalAmount": 750.00,
    "paymentStatus": "paid",
    "bookingTime": "2025-11-13T10:30:00Z"
  },
  "show": {
    "movieTitle": "Inception",
    "posterUrl": "https://image.url/inception.jpg",
    "showTime": "2025-11-14T19:00:00Z",
    "hallName": "Screen 1",
    "theaterName": "PVR Cinemas",
    "theaterAddress": "123 Main Street, Mumbai",
    "seats": ["A1", "A2", "A3"]
  },
  "createdAt": "2025-11-13T10:30:15Z"
}
```

---

### 3. Resend Ticket Email

**POST** `/api/bookings/ticket/:bookingId/resend`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "msg": "Ticket email sent successfully",
  "success": true
}
```

---

### 4. Verify Ticket (Theater Staff)

**POST** `/api/bookings/ticket/verify`

**Headers:**
```
Authorization: Bearer {admin_jwt_token}
```

**Request:**
```json
{
  "ticketId": "FLX-20251113-15-A3B2",
  "verificationCode": "7F4E2A"
}
```

**Success Response:**
```json
{
  "msg": "Ticket verified successfully",
  "success": true,
  "ticket": {
    "ticketId": "FLX-20251113-15-A3B2",
    "movieTitle": "Inception",
    "theaterName": "PVR Cinemas",
    "hallName": "Screen 1",
    "showTime": "2025-11-14T19:00:00Z",
    "seats": ["A1", "A2", "A3"]
  }
}
```

**Error Responses:**
```json
// Invalid ticket
{
  "msg": "Invalid ticket"
}

// Wrong verification code
{
  "msg": "Invalid verification code"
}

// Already used
{
  "msg": "Ticket already used",
  "usedAt": "2025-11-14T18:45:00Z"
}

// Payment not confirmed
{
  "msg": "Payment not confirmed for this ticket"
}

// Too early
{
  "msg": "Too early. Please arrive closer to show time."
}
```

---

## 🎨 Ticket Design

The ticket includes:

### Header Section
- 🎬 FilmFlex logo
- "Your Movie Ticket" tagline
- ✓ CONFIRMED status badge

### Ticket Information
- **Ticket ID**: Unique identifier (FLX-YYYYMMDD-XXX-XXXX)
- **Movie Title**: Large, bold display
- **Date & Time**: Formatted show date and time
- **Theater & Screen**: Venue details
- **Seats**: Prominent display of seat numbers

### QR Code Section
- Large, scannable QR code (300x300px)
- 6-digit verification code (backup)
- "Scan at Theater" instructions

### Amount Section
- Total amount paid
- Green background for confirmed payment

### Instructions
- Arrival time (15 minutes early)
- QR code presentation
- ID proof requirement
- House rules

### Footer
- Booking ID reference
- Booking timestamp
- Support contact information

---

## 🔄 Workflow

### Booking to Ticket Flow

```
1. User selects seats
   ↓
2. Proceeds to payment
   ↓
3. Payment successful
   ↓
4. Booking created in database
   ↓
5. Ticket generated:
   - Generate unique ticket ID
   - Create 6-digit verification code
   - Generate QR code with ticket data
   - Store in tickets table
   ↓
6. Email sent:
   - Generate HTML ticket
   - Send via nodemailer
   - Mark ticket_sent = true
   ↓
7. User receives ticket email
   ↓
8. User arrives at theater
   ↓
9. Theater staff scans QR code
   ↓
10. System verifies:
   - Valid ticket ID
   - Correct verification code
   - Not already used
   - Payment confirmed
   - Within valid time window
   ↓
11. Entry granted
   ↓
12. Ticket marked as used
```

### Ticket Verification Flow

```
Theater Staff Scan QR Code
        ↓
Extract ticket data from QR
        ↓
POST /api/bookings/ticket/verify
        ↓
Backend Validation:
  ├─ Ticket exists?
  ├─ Verification code matches?
  ├─ Already used?
  ├─ Payment confirmed?
  └─ Valid time window?
        ↓
All checks pass?
  ├─ Yes → Mark as used, Grant entry
  └─ No  → Return error message
```

---

## 💻 Frontend Integration

### Display Ticket Page

```jsx
// pages/TicketPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TicketPage = () => {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/bookings/ticket/${bookingId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [bookingId]);

  const handleResendTicket = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/bookings/ticket/${bookingId}/resend`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      alert(data.msg);
    } catch (error) {
      alert('Failed to resend ticket');
    }
  };

  if (loading) return <div>Loading ticket...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="ticket-page">
      <h1>Your Movie Ticket</h1>
      
      <div className="ticket-container">
        <div className="ticket-id">{ticket.ticketId}</div>
        
        <div className="movie-info">
          <h2>{ticket.show.movieTitle}</h2>
          <p>{new Date(ticket.show.showTime).toLocaleString()}</p>
          <p>{ticket.show.theaterName} - {ticket.show.hallName}</p>
        </div>

        <div className="seats">
          <h3>Seats:</h3>
          <p>{ticket.show.seats.join(', ')}</p>
        </div>

        <div className="qr-code">
          <img src={ticket.qrCode} alt="QR Code" />
          <p>Verification Code: <strong>{ticket.verificationCode}</strong></p>
        </div>

        <div className="amount">
          <p>Amount Paid: ₹{ticket.booking.totalAmount}</p>
        </div>

        {ticket.isUsed && (
          <div className="used-badge">
            ✓ Used on {new Date(ticket.usedAt).toLocaleString()}
          </div>
        )}

        <button onClick={handleResendTicket}>
          📧 Resend Ticket to Email
        </button>
      </div>
    </div>
  );
};

export default TicketPage;
```

### Payment Success Page

```jsx
// After payment success
navigate(`/ticket/${bookingId}`, {
  state: { 
    message: 'Payment successful! Your ticket has been emailed to you.',
    ticketData: response.ticket
  }
});
```

### Booking History with Tickets

```jsx
// pages/BookingHistoryPage.jsx
{bookings.map(booking => (
  <div key={booking.id} className="booking-card">
    <h3>{booking.movieTitle}</h3>
    <p>{new Date(booking.showTime).toLocaleString()}</p>
    <p>Seats: {booking.seats.join(', ')}</p>
    <p>Amount: ₹{booking.totalAmount}</p>
    
    {booking.paymentStatus === 'paid' && (
      <button onClick={() => navigate(`/ticket/${booking.id}`)}>
        View Ticket
      </button>
    )}
  </div>
))}
```

---

## 📱 QR Code Scanner (Theater Staff App)

### Scanner Component

```jsx
// components/TicketScanner.jsx
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const TicketScanner = () => {
  const [result, setResult] = useState('');
  const [verification, setVerification] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      try {
        const ticketData = JSON.parse(data.text);
        
        // Verify ticket
        const response = await fetch(
          'http://localhost:3000/api/bookings/ticket/verify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({
              ticketId: ticketData.ticketId,
              verificationCode: ticketData.verificationCode
            })
          }
        );

        const result = await response.json();
        setVerification(result);

        if (result.success) {
          // Play success sound
          // Show green checkmark
        } else {
          // Play error sound
          // Show red X
        }
      } catch (error) {
        setVerification({ 
          success: false, 
          msg: 'Invalid QR code' 
        });
      }
    }
  };

  const handleError = (error) => {
    console.error('Scanner error:', error);
  };

  return (
    <div className="scanner-container">
      <h2>Scan Ticket</h2>
      
      <QrReader
        onResult={handleScan}
        onError={handleError}
        style={{ width: '100%' }}
      />

      {verification && (
        <div className={`result ${verification.success ? 'success' : 'error'}`}>
          <h3>{verification.msg}</h3>
          
          {verification.success && verification.ticket && (
            <div className="ticket-details">
              <p>Movie: {verification.ticket.movieTitle}</p>
              <p>Theater: {verification.ticket.theaterName}</p>
              <p>Screen: {verification.ticket.hallName}</p>
              <p>Seats: {verification.ticket.seats.join(', ')}</p>
              <p>Show Time: {new Date(verification.ticket.showTime).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketScanner;
```

---

## 🔒 Security Features

### Ticket Security
1. **Unique Ticket IDs**: Cryptographically generated random suffixes
2. **Verification Codes**: 6-digit hex codes for backup verification
3. **QR Code Data**: Includes all critical booking information
4. **One-Time Use**: Tickets marked as used after scanning
5. **Time Window**: Verification only allowed 30 minutes before show
6. **Payment Verification**: Only paid bookings get tickets
7. **User Authorization**: Users can only view their own tickets

### Database Security
- Foreign key constraints ensure data integrity
- Unique constraints prevent duplicate tickets
- Indexes for fast lookups
- Transaction locks prevent double-booking

---

## 🧪 Testing

### Test Ticket Generation

```bash
# 1. Create a booking with payment
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

# 2. Check email for ticket

# 3. Get ticket via API
curl http://localhost:3000/api/bookings/ticket/BOOKING_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Resend ticket
curl -X POST http://localhost:3000/api/bookings/ticket/BOOKING_ID/resend \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Verify ticket (as admin)
curl -X POST http://localhost:3000/api/bookings/ticket/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "ticketId": "FLX-20251113-1-A3B2",
    "verificationCode": "7F4E2A"
  }'
```

---

## 📊 Admin Features

### Ticket Statistics

```javascript
// Get total tickets issued
SELECT COUNT(*) FROM tickets;

// Get tickets used vs unused
SELECT 
  COUNT(*) FILTER (WHERE is_used = true) as used_tickets,
  COUNT(*) FILTER (WHERE is_used = false) as unused_tickets
FROM tickets;

// Get tickets for specific show
SELECT 
  t.ticket_id, 
  u.name, 
  u.email, 
  t.is_used,
  b.booking_time
FROM tickets t
JOIN bookings b ON t.booking_id = b.id
JOIN users u ON t.user_id = u.id
WHERE t.show_id = 1
ORDER BY b.booking_time DESC;
```

---

## 🎯 Best Practices

### For Users
1. Save the ticket email for reference
2. Arrive 15 minutes before showtime
3. Have QR code ready on phone or printout
4. Carry valid ID proof
5. Don't share ticket QR code with others

### For Developers
1. Always generate tickets after payment confirmation
2. Handle email failures gracefully
3. Log ticket generation events
4. Implement retry logic for email sending
5. Monitor ticket verification attempts

### For Theater Staff
1. Scan QR codes in good lighting
2. Verify customer identity if needed
3. Check show time before allowing entry
4. Report suspicious multiple scan attempts
5. Keep scanner app updated

---

## 🚨 Troubleshooting

### Ticket Not Received
1. Check spam folder
2. Verify email in user profile
3. Use resend ticket endpoint
4. Check server logs for email errors

### QR Code Won't Scan
1. Increase screen brightness
2. Ensure QR code is fully visible
3. Use backup verification code
4. Manually enter ticket ID

### Verification Failed
1. Check ticket hasn't been used already
2. Verify payment status is 'paid'
3. Check show time window
4. Ensure correct ticket ID and code

---

## 📈 Future Enhancements

- [ ] PDF ticket generation
- [ ] SMS ticket delivery
- [ ] Apple Wallet / Google Pay integration
- [ ] Multiple QR code formats
- [ ] Ticket transfer feature
- [ ] Group booking tickets
- [ ] Dynamic QR codes that refresh
- [ ] Offline verification capability
- [ ] Ticket analytics dashboard
- [ ] Promotional ticket templates

---

## 📝 Summary

The ticket generation system provides:
- ✅ Automated ticket creation after payment
- ✅ Beautiful HTML email tickets
- ✅ QR code verification
- ✅ Secure one-time use system
- ✅ Resend functionality
- ✅ Theater staff verification tools
- ✅ Complete audit trail

**Files Added:**
- `server/utils/ticketGenerator.js`
- `server/migrations/add_tickets_table.sql`
- Updated: `server/controllers/ticketBookingControllers.js`
- Updated: `server/routes/ticketBookingRoutes.js`
- Updated: `server/config/nodemailer.js`

**Ready to use!** Just run the migration and ensure email is configured.

---

**Last Updated**: November 13, 2025  
**Version**: 1.0.0  
**Maintained By**: FilmFlex Development Team
