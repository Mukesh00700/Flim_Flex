# Complete Testing Guide - Flim Flex

## Routes to Test

### Frontend Routes (React)
- [ ] / (HomePage)
- [ ] /movies (MoviesPage)
- [ ] /movies/:movieId (MovieDetail)
- [ ] /shows/:movieId (ShowSelectorPage)  
- [ ] /seats/:showId (SeatsPage)
- [ ] /payment (PaymentPage)
- [ ] /booking-confirmation (BookingConfirmationPage)
- [ ] /my-bookings (MyBookingsPage)
- [ ] /loginUser (LoginPageUser)
- [ ] /registerUser (RegisterPageUser)
- [ ] /loginAdmin (LoginPageAdmin)
- [ ] /registerAdmin (RegisterPageAdmin)
- [ ] /admin/* (AdminDashboard)

### API Endpoints (Backend)
- [ ] GET /movies/getMovies - List all movies
- [ ] GET /shows - Get shows by movieId
- [ ] POST /bookings/seats/:showId - Get available seats
- [ ] POST /bookings/create - Create new booking
- [ ] POST /payments/create-order - Create Razorpay order
- [ ] POST /payments/verify-payment - Verify payment
- [ ] GET /payments/booking/:bookingId - Get booking details
- [ ] GET /bookings/user - Get user's bookings
- [ ] DELETE /payments/booking/:bookingId - Cancel booking

## Test Cases

### 1. Homepage & Navigation
- Load homepage
- Check if movies are displayed
- Verify navigation to other pages

### 2. Movie Selection
- Browse movies list
- Click on a movie
- Verify movie details load

### 3. Show Selection
- From movie detail, select show date
- Filter shows by date
- Select specific show

### 4. Seat Selection
- Load available seats
- Select multiple seats
- Verify seat highlights
- Check price calculation
- Proceed to payment

### 5. Payment Flow
- Open payment page
- Verify booking summary
- Click pay button
- Complete Razorpay test payment
- Verify payment success

### 6. Booking Confirmation
- View confirmation page
- Check booking details
- Verify all information displayed

### 7. My Bookings
- Access /my-bookings
- View upcoming bookings
- View past bookings
- Test cancellation

### 8. Authentication
- Test login (both user and admin)
- Test registration
- Verify token storage
- Test logout

### 9. UI/UX Testing
- Check responsive design on mobile/tablet
- Verify dark theme consistency
- Test all buttons and forms
- Check error messages

### 10. Performance
- Measure page load times
- Check API response times
- Verify no memory leaks

## Known Issues to Check

- [ ] PaymentPage syntax error - FIXED
- [ ] SeatsPage route parameter
- [ ] Missing API endpoints
- [ ] UI consistency across pages
- [ ] Error handling on all pages

## Notes

- Razorpay test credentials: 4111 1111 1111 1111
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Check browser console (F12) for errors
- Check terminal for backend errors
