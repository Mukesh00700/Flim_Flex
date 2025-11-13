# 🧪 Demo Data & API Testing Guide

## 🚀 Quick Start

### 1. Run Demo Data Script

```bash
cd server
node seed-demo-data.js
```

This will create:
- 8 Users (5 customers + 3 admins)
- 8 Popular movies
- 4 Theaters with halls
- 6000+ seats
- 100+ shows
- Pricing rules
- 3 sample bookings

---

## 👤 Demo Login Credentials

### Customer Accounts
```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123

Email: mike@example.com
Password: password123
```

### Admin Accounts
```
Email: admin@filmflex.com
Password: password123

Email: manager@filmflex.com
Password: password123
```

### Super Admin
```
Email: superadmin@filmflex.com
Password: password123
```

---

## 📡 API Test Calls

### 1. Authentication

#### Login as Customer
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isVerified": true
  }
}
```

**Save the token** - You'll need it for authenticated requests!

---

#### Login as Admin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@filmflex.com",
    "password": "password123"
  }'
```

---

### 2. Browse Movies

#### Get All Movies
```bash
curl http://localhost:3000/movies/all
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Inception",
    "description": "A thief who steals corporate secrets...",
    "languages": ["English", "Hindi"],
    "genre": "Sci-Fi",
    "release_date": "2010-07-16",
    "poster_url": "https://image.tmdb.org/t/p/w500/..."
  },
  // More movies...
]
```

---

#### Get Movie by ID
```bash
curl http://localhost:3000/movies/1
```

---

### 3. Browse Theaters

#### Get All Theaters (Requires Auth)
```bash
curl http://localhost:3000/theater/getTheaters \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "PVR Cinemas",
    "city": "Mumbai",
    "address": "Phoenix Marketcity, Kurla West, Mumbai",
    "admin_id": 1
  },
  // More theaters...
]
```

---

### 4. View Shows

#### Get All Shows for a Date
```bash
curl "http://localhost:3000/api/bookings/shows/all?date=2025-11-13"
```

**Response:**
```json
[
  {
    "id": 1,
    "movie_id": 1,
    "movie_title": "Inception",
    "hall_id": 1,
    "hall_name": "Screen 1",
    "theater_name": "PVR Cinemas",
    "show_time": "2025-11-13T10:30:00Z",
    "language": "English",
    "available_seats": 147
  },
  // More shows...
]
```

---

#### Get Shows for a Movie
```bash
curl "http://localhost:3000/api/bookings/shows?movieId=1"
```

---

### 5. Check Available Seats

#### Get Seats for a Show
```bash
curl http://localhost:3000/api/bookings/seats/1
```

**Response:**
```json
{
  "show": {
    "id": 1,
    "movieTitle": "Inception",
    "theaterName": "PVR Cinemas",
    "hallName": "Screen 1",
    "showTime": "2025-11-13T10:30:00Z",
    "language": "English"
  },
  "seats": [
    {
      "id": 1,
      "row": "A",
      "number": 1,
      "type": "vip",
      "isBooked": false,
      "price": 250.00
    },
    // More seats...
  ]
}
```

---

### 6. Create Booking

#### Make a Booking (Requires Auth)
```bash
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "showId": 1,
    "seatIds": [76, 77, 78],
    "paymentDetails": {
      "transactionId": "TXN_TEST_12345",
      "status": "paid",
      "method": "card"
    }
  }'
```

**Response:**
```json
{
  "msg": "Booking created successfully",
  "booking": {
    "id": 4,
    "movieTitle": "Inception",
    "theaterName": "PVR Cinemas",
    "hallName": "Screen 1",
    "showTime": "2025-11-13T10:30:00Z",
    "seats": ["F1", "F2", "F3"],
    "totalAmount": 450.00,
    "paymentStatus": "paid",
    "bookingTime": "2025-11-13T10:30:00Z",
    "ticketSent": true
  },
  "ticket": {
    "ticketId": "FLX-20251113-4-A3B2",
    "verificationCode": "7F4E2A",
    "qrCode": "data:image/png;base64,..."
  }
}
```

**✅ Ticket automatically generated and emailed!**

---

### 7. View Your Bookings

#### Get User Bookings (Requires Auth)
```bash
curl http://localhost:3000/api/bookings/my-bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "bookings": [
    {
      "id": 4,
      "movie_title": "Inception",
      "poster_url": "https://...",
      "show_time": "2025-11-13T10:30:00Z",
      "hall_name": "Screen 1",
      "theater_name": "PVR Cinemas",
      "seats": "F1, F2, F3",
      "total_amount": 450.00,
      "payment_status": "paid",
      "booking_time": "2025-11-13T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

### 8. Get Ticket

#### View Ticket (Requires Auth)
```bash
curl http://localhost:3000/api/bookings/ticket/4 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "ticketId": "FLX-20251113-4-A3B2",
  "verificationCode": "7F4E2A",
  "qrCode": "data:image/png;base64,iVBORw0KGgo...",
  "isUsed": false,
  "usedAt": null,
  "booking": {
    "id": 4,
    "totalAmount": 450.00,
    "paymentStatus": "paid",
    "bookingTime": "2025-11-13T10:30:00Z"
  },
  "show": {
    "movieTitle": "Inception",
    "posterUrl": "https://...",
    "showTime": "2025-11-13T10:30:00Z",
    "hallName": "Screen 1",
    "theaterName": "PVR Cinemas",
    "theaterAddress": "Phoenix Marketcity...",
    "seats": ["F1", "F2", "F3"]
  }
}
```

---

### 9. Resend Ticket

#### Resend Ticket Email (Requires Auth)
```bash
curl -X POST http://localhost:3000/api/bookings/ticket/4/resend \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "msg": "Ticket email sent successfully",
  "success": true
}
```

---

### 10. Verify Ticket (Admin/Staff)

#### Verify Ticket at Theater (Requires Admin Auth)
```bash
curl -X POST http://localhost:3000/api/bookings/ticket/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "ticketId": "FLX-20251113-4-A3B2",
    "verificationCode": "7F4E2A"
  }'
```

**Success Response:**
```json
{
  "msg": "Ticket verified successfully",
  "success": true,
  "ticket": {
    "ticketId": "FLX-20251113-4-A3B2",
    "movieTitle": "Inception",
    "theaterName": "PVR Cinemas",
    "hallName": "Screen 1",
    "showTime": "2025-11-13T10:30:00Z",
    "seats": ["F1", "F2", "F3"]
  }
}
```

---

## 🎯 Complete Test Workflow

### Step-by-Step Booking Flow

```bash
# 1. Login as customer
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Browse movies
curl http://localhost:3000/movies/all

# 3. View shows for today
curl "http://localhost:3000/api/bookings/shows/all?date=2025-11-13"

# 4. Check available seats for a show
curl http://localhost:3000/api/bookings/seats/1

# 5. Make a booking
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "showId": 1,
    "seatIds": [76, 77, 78],
    "paymentDetails": {
      "transactionId": "TXN_TEST_12345",
      "status": "paid"
    }
  }'

# 6. View your bookings
curl http://localhost:3000/api/bookings/my-bookings \
  -H "Authorization: Bearer $TOKEN"

# 7. View your ticket
curl http://localhost:3000/api/bookings/ticket/4 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Demo Data Overview

### Movies (8)
- Inception
- The Dark Knight
- Interstellar
- Avengers: Endgame
- Jawan
- Pathaan
- The Shawshank Redemption
- Oppenheimer

### Theaters (4)
- PVR Cinemas (Mumbai)
- INOX Megaplex (Delhi)
- Cinepolis (Bangalore)
- Carnival Cinemas (Pune)

### Shows
- 100+ shows across 3 days
- Multiple timings: 10:30 AM, 2:00 PM, 6:30 PM, 9:45 PM
- Different languages available

### Pricing
- Basic Seats: ₹150
- VIP Seats: ₹250
- Recliner Seats: ₹350

---

## 🎨 Frontend Testing

Once you have the demo data, you can test:

1. **Homepage** - Browse movies
2. **Movie Details** - View specific movie info
3. **Show Selection** - Choose theater, time, and date
4. **Seat Selection** - Interactive seat picker
5. **Payment** - Process payment
6. **Ticket Display** - View generated ticket with QR code
7. **Booking History** - View past bookings

---

## 💡 Testing Tips

### Generate Multiple Bookings
```bash
# Login and save token
TOKEN="your_token_here"

# Make multiple bookings with different seats
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/bookings/create \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"showId\": $i,
      \"seatIds\": [76, 77],
      \"paymentDetails\": {
        \"transactionId\": \"TXN_TEST_$i\",
        \"status\": \"paid\"
      }
    }"
done
```

### Test Different User Scenarios
1. Customer without verification
2. Customer with bookings
3. Admin managing theaters
4. Theater staff verifying tickets

### Test Edge Cases
1. Double booking (should fail)
2. Booking more than 7 seats (should fail)
3. Using expired ticket
4. Invalid verification code
5. Ticket already used

---

## 🔧 Reset Demo Data

To clear and re-seed the data:

```bash
# Clear all data (WARNING: This deletes everything!)
psql -U postgres -d filmflex -c "
  TRUNCATE TABLE booking_seats, bookings, tickets, 
                 prices, shows, seats, halls, theaters, movies, users 
  RESTART IDENTITY CASCADE;
"

# Re-run seed script
node seed-demo-data.js
```

---

## ✅ Quick Verification Checklist

After seeding, verify:
- [ ] Can login with demo credentials
- [ ] Movies are visible
- [ ] Theaters are listed
- [ ] Shows are available
- [ ] Seats are displayed
- [ ] Can make a booking
- [ ] Ticket is generated
- [ ] Email is sent (check logs)
- [ ] Can view ticket
- [ ] Can verify ticket (as admin)

---

## 🎉 You're Ready!

Demo data is loaded. Start testing:
1. Run the seed script: `node seed-demo-data.js`
2. Start your server: `npm run dev`
3. Test APIs with the examples above
4. Build your frontend using these endpoints

**Happy Testing! 🚀**
