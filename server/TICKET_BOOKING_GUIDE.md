# Ticket Booking Controllers - Implementation Guide

## Overview

The ticket booking controller system provides a complete solution for user ticket booking with features including:
- Browse shows for movies
- View available seats
- Validate bookings before payment
- Create bookings with transaction support
- View booking history with pagination
- Get detailed booking information
- Cancel bookings
- Double-booking prevention

---

## Installation

### 1. Add Route to Main Server File

Update your `server/src/index.js` (or `server/index.js`):

```javascript
import ticketBookingRoutes from '../routes/ticketBookingRoutes.js';

// ... other imports and setup ...

// Mount the ticket booking routes
app.use('/api/bookings', ticketBookingRoutes);
```

### 2. Ensure Required Dependencies

The ticket booking controller uses only dependencies already in your `package.json`:
- `pg` - PostgreSQL client (already installed)
- `express` - Web framework (already installed)
- `jsonwebtoken` - For authentication (already installed)

No additional packages needed!

---

## Controller Functions

### 1. `getShowsForMovie(req, res)`

**Purpose:** Get all shows for a specific movie on a specific date

**Parameters:**
- `movieId` (query): Movie ID
- `date` (query): Date in YYYY-MM-DD format

**Returns:**
- Array of shows with available/booked seat counts
- Theater and city information

**Example Usage:**
```javascript
// Frontend fetch
const shows = await fetch('/api/bookings/shows?movieId=1&date=2025-11-12')
  .then(r => r.json());
```

---

### 2. `getAvailableSeats(req, res)`

**Purpose:** Get all seats in a show with their booking status and prices

**Parameters:**
- `showId` (param): Show ID

**Returns:**
- Show details
- All seats with booking status and pricing

**Example Usage:**
```javascript
const seatsData = await fetch('/api/bookings/seats/1')
  .then(r => r.json());

// Display seat map
seatsData.seats.forEach(seat => {
  console.log(`${seat.row}${seat.number} - ${seat.type} - $${seat.price} - ${seat.isBooked ? 'Booked' : 'Available'}`);
});
```

---

### 3. `validateBooking(req, res)`

**Purpose:** Validate that selected seats are available and calculate total price

**Parameters:**
- `showId` (body): Show ID
- `seatIds` (body): Array of seat IDs

**Returns:**
- Seat details with prices
- Total amount to pay
- Validates availability

**Example Usage:**
```javascript
const validation = await fetch('/api/bookings/validate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    showId: 1,
    seatIds: [1, 3, 5]
  })
}).then(r => r.json());

console.log('Total Amount:', validation.totalAmount); // 500
console.log('Seats:', validation.seatDetails);
```

---

### 4. `createBooking(req, res)`

**Purpose:** Create a new booking with atomic transaction

**Parameters:**
- `showId` (body): Show ID
- `seatIds` (body): Array of seat IDs to book
- `paymentDetails` (body, optional): Payment information
  - `status`: Payment status (default: 'pending')
  - `transactionId`: Payment gateway transaction ID

**Returns:**
- Complete booking details
- Confirmation with seats and total amount

**Key Features:**
- Atomic transaction - prevents double-booking
- Locks seats during transaction
- Associates payment with booking

**Example Usage:**
```javascript
// After payment successful
const booking = await fetch('/api/bookings/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    showId: 1,
    seatIds: [1, 3, 5],
    paymentDetails: {
      status: 'paid',
      transactionId: 'TXN_STRIPE_12345'
    }
  })
}).then(r => r.json());

console.log(`Booking confirmed! ID: ${booking.booking.id}`);
console.log(`Your seats: ${booking.booking.seats.join(', ')}`);
console.log(`Total paid: $${booking.booking.totalAmount}`);
```

---

### 5. `getUserBookings(req, res)`

**Purpose:** Get all bookings for the logged-in user with pagination and filtering

**Parameters:**
- `status` (query, optional): Filter by payment status (default: 'all')
  - Possible values: 'all', 'pending', 'paid', 'failed', 'refunded', 'cancelled'
- `limit` (query, optional): Results per page (default: 10)
- `offset` (query, optional): Number of results to skip (default: 0)

**Returns:**
- Array of user bookings
- Pagination information
- Movie and theater details for each booking

**Example Usage:**
```javascript
// Get paid bookings
const bookings = await fetch('/api/bookings/my-bookings?status=paid&limit=5&offset=0', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json());

console.log(`Total bookings: ${bookings.pagination.total}`);
console.log(`Page ${bookings.pagination.pages} pages`);

bookings.bookings.forEach(booking => {
  console.log(`${booking.movieTitle} - ${booking.paymentStatus}`);
});
```

---

### 6. `getBookingDetails(req, res)`

**Purpose:** Get detailed information about a specific booking

**Parameters:**
- `bookingId` (param): Booking ID

**Returns:**
- Complete booking information
- Movie details
- Theater and hall information
- Individual seat details with prices
- Payment information

**Example Usage:**
```javascript
const booking = await fetch('/api/bookings/42', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json());

console.log(`Movie: ${booking.booking.movieTitle}`);
console.log(`Theater: ${booking.booking.theaterName}`);
console.log(`Address: ${booking.booking.theaterAddress}`);
console.log(`Seats: ${booking.booking.seats.join(', ')}`);
console.log(`Total: $${booking.booking.totalAmount}`);
```

---

### 7. `cancelBooking(req, res)`

**Purpose:** Cancel an existing booking

**Parameters:**
- `bookingId` (param): Booking ID
- `reason` (body, optional): Cancellation reason

**Returns:**
- Updated booking status set to 'cancelled'
- Cancellation timestamp

**Example Usage:**
```javascript
const cancelled = await fetch('/api/bookings/42/cancel', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reason: 'Schedule conflict'
  })
}).then(r => r.json());

console.log(`Booking cancelled at: ${cancelled.booking.cancelledAt}`);
```

---

## Complete Workflow Example

Here's a complete booking workflow:

```javascript
// Step 1: User logs in and gets token
const loginRes = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});
const { token } = await loginRes.json();

// Step 2: Browse shows for a movie
const showsRes = await fetch('/api/bookings/shows?movieId=1&date=2025-11-12');
const { shows } = await showsRes.json();
const selectedShow = shows[0]; // User selects first show

// Step 3: View available seats
const seatsRes = await fetch(`/api/bookings/seats/${selectedShow.showId}`);
const { seats } = await seatsRes.json();

// Step 4: User selects seats and validates
const selectedSeatIds = [1, 3, 5]; // User clicks these seats
const validationRes = await fetch('/api/bookings/validate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    showId: selectedShow.showId,
    seatIds: selectedSeatIds
  })
});
const { totalAmount } = await validationRes.json();
console.log(`Total to pay: $${totalAmount}`);

// Step 5: Process payment (integrate with payment gateway)
const paymentResult = await processPayment(totalAmount);

// Step 6: Create booking after payment
const bookingRes = await fetch('/api/bookings/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    showId: selectedShow.showId,
    seatIds: selectedSeatIds,
    paymentDetails: {
      status: 'paid',
      transactionId: paymentResult.transactionId
    }
  })
});
const { booking } = await bookingRes.json();
console.log(`Booking confirmed! ID: ${booking.id}`);

// Step 7: Later, view booking history
const historyRes = await fetch('/api/bookings/my-bookings?status=paid', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { bookings } = await historyRes.json();

// Step 8: View detailed booking info
const detailRes = await fetch(`/api/bookings/${booking.id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const bookingDetail = await detailRes.json();

// Step 9: Cancel booking if needed
const cancelRes = await fetch(`/api/bookings/${booking.id}/cancel`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ reason: 'Cannot attend' })
});
```

---

## Security Features

1. **Authentication**: All user operations require valid JWT token
2. **Authorization**: Users can only access their own bookings
3. **Atomic Transactions**: Double-booking prevention using database transactions
4. **Seat Locking**: Seats are locked during transaction to prevent concurrent bookings
5. **Data Validation**: All inputs validated before database queries

---

## Database Considerations

### Indexes Used
- `idx_shows_show_time` - Shows table for efficient time-based queries
- `idx_booking_seats_show` - Booking seats for show lookups

### Constraints
- `UNIQUE (show_id, seat_id)` on booking_seats - Prevents double-booking
- `CHECK` constraints on amounts to prevent negative values
- Foreign key constraints maintain referential integrity

---

## Error Handling

All controllers implement comprehensive error handling:

```javascript
try {
  // Database operations
} catch (error) {
  console.error('Error description:', error);
  res.status(500).json({ msg: 'Server Error' });
}
```

Common error responses:
- 400: Invalid input or seat already booked
- 401: Missing or invalid authentication token
- 403: User not authorized for resource
- 404: Booking or show not found
- 500: Server error

---

## Performance Optimizations

1. **Pagination**: `getUserBookings` implements limit/offset for large datasets
2. **Aggregation**: Uses SQL aggregation for seat counts
3. **Indexing**: Strategic indexes on frequently queried fields
4. **Transactions**: Minimal lock duration for consistency without performance impact

---

## Next Steps

1. Mount routes in your main server file
2. Test endpoints using Postman or similar tool
3. Integrate with frontend React components
4. Add payment gateway integration for `createBooking`
5. Implement notification system for booking confirmations
6. Add email/SMS notifications for booking updates

---

## Troubleshooting

**Issue:** "User associated with this token no longer exists"
- **Solution:** Token is invalid or user was deleted. Re-login required.

**Issue:** "Seats are already booked"
- **Solution:** Seats were booked by another user. Refresh seat availability and try different seats.

**Issue:** Database transaction rollback
- **Solution:** Ensure all required fields are provided and valid. Check server logs for details.

**Issue:** CORS errors
- **Solution:** Ensure CORS middleware is configured in your main server file.

