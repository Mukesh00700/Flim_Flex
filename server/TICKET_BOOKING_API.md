# Ticket Booking Controller - API Documentation

## Overview
This document provides complete API documentation for the ticket booking system. These endpoints handle user ticket booking, seat selection, booking history, and booking cancellation.

---

## Base URL
```
/api/bookings
```

---

## Endpoints

### 1. Get Shows for a Movie

**Endpoint:** `GET /shows`

**Authentication:** Not required

**Query Parameters:**
- `movieId` (required): The ID of the movie
- `date` (required): Date in format `YYYY-MM-DD`

**Example Request:**
```bash
GET /api/bookings/shows?movieId=1&date=2025-11-12
```

**Response (200 OK):**
```json
{
  "shows": [
    {
      "showId": 1,
      "showTime": "2025-11-12T10:00:00+00:00",
      "language": "English",
      "hallName": "Screen 1",
      "theaterName": "PVR Cinemas",
      "city": "Delhi",
      "availableSeats": 45,
      "bookedSeats": 35
    }
  ]
}
```

**Error Response (404):**
```json
{
  "msg": "No shows available for this movie on the given date"
}
```

---

### 2. Get Available Seats for a Show

**Endpoint:** `GET /seats/:showId`

**Authentication:** Not required

**URL Parameters:**
- `showId` (required): The ID of the show

**Example Request:**
```bash
GET /api/bookings/seats/1
```

**Response (200 OK):**
```json
{
  "show": {
    "id": 1,
    "movieTitle": "The Matrix",
    "theaterName": "PVR Cinemas",
    "hallName": "Screen 1",
    "showTime": "2025-11-12T10:00:00+00:00",
    "language": "English"
  },
  "seats": [
    {
      "id": 1,
      "row": "A",
      "number": 1,
      "type": "basic",
      "isBooked": false,
      "price": 150
    },
    {
      "id": 2,
      "row": "A",
      "number": 2,
      "type": "basic",
      "isBooked": true,
      "price": 150
    },
    {
      "id": 3,
      "row": "A",
      "number": 3,
      "type": "recliner",
      "isBooked": false,
      "price": 200
    }
  ]
}
```

---

### 3. Validate Booking

**Endpoint:** `POST /validate`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "showId": 1,
  "seatIds": [1, 3, 5]
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/bookings/validate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "showId": 1,
    "seatIds": [1, 3, 5]
  }'
```

**Response (200 OK):**
```json
{
  "valid": true,
  "seatDetails": [
    {
      "id": 1,
      "seat": "A1",
      "price": 150
    },
    {
      "id": 3,
      "seat": "A3",
      "price": 200
    },
    {
      "id": 5,
      "seat": "A5",
      "price": 150
    }
  ],
  "totalAmount": 500
}
```

**Error Response (400):**
```json
{
  "msg": "Some seats are already booked",
  "bookedSeats": ["A2", "B1"]
}
```

---

### 4. Create Booking

**Endpoint:** `POST /create`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "showId": 1,
  "seatIds": [1, 3, 5],
  "paymentDetails": {
    "status": "paid",
    "transactionId": "TXN123456789"
  }
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/bookings/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "showId": 1,
    "seatIds": [1, 3, 5],
    "paymentDetails": {
      "status": "paid",
      "transactionId": "TXN123456789"
    }
  }'
```

**Response (201 Created):**
```json
{
  "msg": "Booking created successfully",
  "booking": {
    "id": 42,
    "movieTitle": "The Matrix",
    "theaterName": "PVR Cinemas",
    "hallName": "Screen 1",
    "showTime": "2025-11-12T10:00:00+00:00",
    "seats": ["A1", "A3", "A5"],
    "totalAmount": 500,
    "paymentStatus": "paid",
    "bookingTime": "2025-11-12T09:15:00+00:00"
  }
}
```

**Error Response (400):**
```json
{
  "msg": "Some seats are already booked"
}
```

---

### 5. Get User's Booking History

**Endpoint:** `GET /my-bookings`

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `status` (optional): Filter by payment status - `all`, `pending`, `paid`, `failed`, `refunded`, `cancelled`. Default: `all`
- `limit` (optional): Number of bookings per page. Default: `10`
- `offset` (optional): Number of bookings to skip. Default: `0`

**Example Request:**
```bash
GET /api/bookings/my-bookings?status=paid&limit=10&offset=0
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "bookings": [
    {
      "id": 42,
      "movieTitle": "The Matrix",
      "posterUrl": "https://example.com/poster.jpg",
      "theaterName": "PVR Cinemas",
      "hallName": "Screen 1",
      "showTime": "2025-11-12T10:00:00+00:00",
      "seats": ["A1", "A3", "A5"],
      "totalAmount": 500,
      "paymentStatus": "paid",
      "bookingTime": "2025-11-12T09:15:00+00:00",
      "cancelledAt": null
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "pages": 1
  }
}
```

---

### 6. Get Booking Details

**Endpoint:** `GET /:bookingId`

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `bookingId` (required): The ID of the booking

**Example Request:**
```bash
GET /api/bookings/42
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "booking": {
    "id": 42,
    "movieTitle": "The Matrix",
    "movieDescription": "A computer hacker learns...",
    "posterUrl": "https://example.com/poster.jpg",
    "theaterName": "PVR Cinemas",
    "theaterAddress": "123 Main Street",
    "theaterCity": "Delhi",
    "hallName": "Screen 1",
    "showTime": "2025-11-12T10:00:00+00:00",
    "language": "English",
    "seats": ["A1", "A3", "A5"],
    "seatDetails": [
      {
        "seat": "A1",
        "type": "basic",
        "price": "150.00"
      },
      {
        "seat": "A3",
        "type": "recliner",
        "price": "200.00"
      },
      {
        "seat": "A5",
        "type": "basic",
        "price": "150.00"
      }
    ],
    "totalAmount": 500,
    "paymentStatus": "paid",
    "paymentReference": "TXN123456789",
    "bookingTime": "2025-11-12T09:15:00+00:00",
    "cancelledAt": null
  }
}
```

**Error Response (404):**
```json
{
  "msg": "Booking not found"
}
```

---

### 7. Cancel Booking

**Endpoint:** `PUT /:bookingId/cancel`

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `bookingId` (required): The ID of the booking

**Request Body (optional):**
```json
{
  "reason": "Change of plans"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/bookings/42/cancel \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Change of plans"
  }'
```

**Response (200 OK):**
```json
{
  "msg": "Booking cancelled successfully",
  "booking": {
    "id": 42,
    "paymentStatus": "cancelled",
    "cancelledAt": "2025-11-12T10:30:00+00:00"
  }
}
```

**Error Responses:**

404 Not Found:
```json
{
  "msg": "Booking not found"
}
```

400 Bad Request:
```json
{
  "msg": "Booking is already cancelled"
}
```

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained from the authentication endpoints:
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with credentials
- `POST /auth/google` - Login with Google

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

Error responses follow this format:
```json
{
  "msg": "Error message describing what went wrong"
}
```

---

## Data Types

### Payment Status
- `pending`: Payment not yet completed
- `paid`: Payment successful
- `failed`: Payment failed
- `refunded`: Payment refunded
- `cancelled`: Booking cancelled

### Seat Type
- `basic`: Standard seat
- `recliner`: Recliner seat
- `vip`: VIP seat

---

## Usage Examples

### Complete Booking Flow

1. **Browse Shows**
   ```bash
   GET /api/bookings/shows?movieId=1&date=2025-11-12
   ```

2. **View Available Seats**
   ```bash
   GET /api/bookings/seats/1
   ```

3. **Validate Booking**
   ```bash
   POST /api/bookings/validate
   Authorization: Bearer <token>
   Body: { "showId": 1, "seatIds": [1, 3] }
   ```

4. **Create Booking**
   ```bash
   POST /api/bookings/create
   Authorization: Bearer <token>
   Body: { 
     "showId": 1, 
     "seatIds": [1, 3],
     "paymentDetails": { "status": "paid", "transactionId": "TXN123" }
   }
   ```

5. **View Booking History**
   ```bash
   GET /api/bookings/my-bookings?status=paid
   Authorization: Bearer <token>
   ```

6. **Get Booking Details**
   ```bash
   GET /api/bookings/42
   Authorization: Bearer <token>
   ```

---

## Integration Notes

- All datetime values are returned in ISO 8601 format with timezone information
- Prices are returned as decimal numbers (e.g., 150.00)
- Seat availability is checked in real-time during booking creation
- Transactions are atomic - either all seats are booked or none
- Double-booking prevention is implemented at the database level with unique constraints

