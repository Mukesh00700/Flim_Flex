# 🧪 WHAT TO TEST NEXT - Manual Testing Guide

**Updated**: 26-Jan-2026  
**Status**: ✅ All errors fixed, ready for manual testing

---

## 🎯 Test These Routes FIRST (Critical Path)

### 1️⃣ HOMEPAGE TEST
**Go to**: http://localhost:5173/
- [ ] Page loads without errors (check F12 console)
- [ ] Dark theme is applied (black background)
- [ ] Navbar shows at top with "FilmFlex" logo
- [ ] Search bar is visible and functional
- [ ] Movies display in grid (if any exist in database)
- [ ] Navigation links work

**Expected**: Clean homepage with dark theme, no console errors

---

### 2️⃣ MOVIE DETAIL TEST
**Go to**: http://localhost:5173/movies/1 (or any movie ID)
- [ ] Movie details load correctly
- [ ] Movie poster/image displays
- [ ] Movie title, genre, duration show
- [ ] Yellow "Select Shows & Book Tickets" button is visible
- [ ] Clicking button takes you to /shows/1

**Expected**: Beautiful dark-themed movie detail page with functional button

---

### 3️⃣ SHOW SELECTOR TEST  
**Precondition**: Click on a movie, then click "Select Shows & Book Tickets"
**URL**: http://localhost:5173/shows/:movieId

- [ ] Page loads (should show date picker)
- [ ] Calendar with next 7 days visible
- [ ] Can click different dates
- [ ] Shows list updates when date changes
- [ ] Shows display: Time, Theater, Language, Format
- [ ] Click a show → goes to /seats/:showId

**Expected**: Calendar interface with date filtering working

---

### 4️⃣ SEATS PAGE TEST
**Precondition**: Select a show from ShowSelectorPage
**URL**: http://localhost:5173/seats/:showId

**Most Important Tests:**
- [ ] Seats render in a grid layout with rows
- [ ] Seats have different colors:
  - ✅ Red seats = Booked (can't click)
  - ✅ Green/Yellow seats = Available (can click)
- [ ] Click a seat → highlights in yellow
- [ ] Select multiple seats (try 2-3 seats)
- [ ] Price calculation updates in real-time
- [ ] Booking summary shows on right side:
  - Selected seats count
  - Total amount (₹)
- [ ] "Proceed to Payment" button enabled when seats selected

**Expected**: Dynamic seat selection with real-time price calculation

---

### 5️⃣ PAYMENT TEST
**Precondition**: Select seats and click "Proceed to Payment"
**URL**: http://localhost:5173/payment

**WITHOUT Razorpay Keys:**
- [ ] Page loads
- [ ] Shows booking summary on left
- [ ] Shows "Pay ₹XXX" button (where XXX is total amount)
- [ ] Clicking button shows error: "Payment service not configured"
- [ ] Message tells you to add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET

**WITH Razorpay Keys (After setup):**
- [ ] "Pay ₹XXX" button is clickable
- [ ] Clicking opens Razorpay payment modal
- [ ] Test card: 4111 1111 1111 1111
- [ ] Expiry: 12/25 (any future month/year)
- [ ] CVV: 123 (any 3 digits)
- [ ] OTP: 123456
- [ ] Payment completes successfully
- [ ] Redirected to /booking-confirmation

**Expected**: Payment page with Razorpay integration ready (pending API keys)

---

### 6️⃣ BOOKING CONFIRMATION TEST
**Precondition**: Complete payment successfully
**URL**: http://localhost:5173/booking-confirmation

- [ ] Confirmation page shows
- [ ] Green checkmark ✅ icon visible
- [ ] "Payment Successful!" message
- [ ] Shows booking details:
  - Booking ID
  - Movie title
  - Theater name
  - Date & Time
  - Seats booked
  - Total amount paid
  - Transaction ID
- [ ] "Download Tickets" button (currently placeholder)
- [ ] "Back to Home" button works

**Expected**: Clean confirmation page with all booking details

---

### 7️⃣ MY BOOKINGS TEST
**Go to**: http://localhost:5173/my-bookings
- [ ] Page loads
- [ ] Shows tabs: "Upcoming Shows" and "Past Shows"
- [ ] Lists bookings (if any exist)
- [ ] Each booking shows:
  - Movie title
  - Theater name
  - Date & time
  - Seats
  - Status badge (Confirmed, Cancelled, etc.)
- [ ] "Cancel Booking" button on upcoming bookings
- [ ] Click cancel → asks for confirmation
- [ ] After cancel → status changes to "Cancelled"
- [ ] Cancelled bookings move to "Past Shows" tab

**Expected**: Booking management page working properly

---

## 🔌 API TESTS (Using Browser Dev Tools)

### Test 1: GET Movies
```
URL: http://localhost:3000/movies/getMovies
Method: GET
Expected: JSON array of movies (or empty array if no data)
Status: 200
```

**How to test**:
- Open browser console
- Paste: `fetch('http://localhost:3000/movies/getMovies').then(r => r.json()).then(console.log)`
- Should see array of movie objects

---

### Test 2: GET Available Seats
```
URL: http://localhost:3000/bookings/seats/:showId
Method: GET
Expected: JSON with seats array and show details
Status: 200
```

**How to test**:
- Use a valid showId (e.g., 1)
- Replace :showId with actual ID
- Check response structure

---

### Test 3: Create Payment Order (requires authentication)
```
URL: http://localhost:3000/payments/create-order
Method: POST
Headers: Authorization: Bearer {token}
Body: {
  "seats": [1, 2, 3],
  "totalAmount": 750,
  "showId": 1
}
Expected: { success: true, orderId, bookingId }
Status: 200
```

---

## 🎨 UI/UX TESTS

### Theme & Design
- [ ] Dark background (#1e293b) on all pages ✅
- [ ] Yellow buttons (#facc15) for CTAs ✅
- [ ] Text is white on dark background ✅
- [ ] Proper spacing and padding ✅
- [ ] Hover effects work on buttons ✅
- [ ] Consistent border styling ✅

### Responsiveness
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on Mobile (375px)
- [ ] Test on Tablet (768px)
- [ ] Test on Desktop (1920px)
- [ ] All pages look good on each size

### Loading & Error States
- [ ] Pages show spinner while loading ✅
- [ ] Error messages appear in red boxes ✅
- [ ] Disable buttons while loading ✅
- [ ] Clear error messages shown ✅
- [ ] Back buttons work from error states ✅

---

## 📝 Testing Checklist

### Critical Functionality
- [ ] Complete booking flow works start to finish
- [ ] Can select different dates and shows
- [ ] Seats display correctly with real data
- [ ] Price calculation is accurate
- [ ] Booking details saved correctly
- [ ] Can view bookings in MyBookings
- [ ] Can cancel bookings

### Error Handling
- [ ] Page load errors handled gracefully
- [ ] API errors show clear messages
- [ ] No unhandled console errors
- [ ] Missing data doesn't crash app
- [ ] Back buttons work from any page

### Visual/UX
- [ ] All text readable (good contrast)
- [ ] All buttons clearly clickable
- [ ] Forms show validation messages
- [ ] Loading states are obvious
- [ ] Success/error messages clear
- [ ] Mobile friendly layout

---

## 🐛 Debugging Tips

### If something doesn't work:

1. **Check Browser Console** (F12 → Console tab)
   - Any red errors?
   - Any warnings?
   - Copy error message

2. **Check Network Tab** (F12 → Network)
   - Did API call happen?
   - What's the response status (200, 404, 500)?
   - What's the response body?

3. **Check Server Terminal**
   - Any errors printed?
   - Routes loading properly?
   - Database connected?

4. **Clear Cache**
   - Close dev server (Ctrl+C)
   - Hard refresh browser (Ctrl+Shift+R)
   - Restart server

5. **Check .env Files**
   - Server .env has JWT_SECRET?
   - Client .env.local correct path?
   - Razorpay keys set (if testing payments)?

---

## 🎯 What Each Page Should Look Like

### HomePage
```
[Navbar with FilmFlex logo]
[Search bar with blue/purple gradient]
[Grid of movie cards in dark theme]
[Footer]
```

### MovieDetail
```
[Back button]
[Movie poster on left]
[Movie title, description on right]
[Yellow "Select Shows & Book Tickets" button]
```

### ShowSelectorPage
```
[7-day calendar picker]
[Movies grouped by theater]
[Shows with time, language, format]
```

### SeatsPage
```
[Rows of seats with different colors]
[Left: seat grid] [Right: booking summary]
[Bottom: Proceed to Payment button]
```

### PaymentPage
```
[Left: Booking summary card]
[Right: Payment form]
[Yellow "Pay ₹XXX" button]
[Security info badge]
```

### BookingConfirmationPage
```
[Green checkmark]
["Payment Successful!" message]
[All booking details]
[Download Tickets button]
```

### MyBookingsPage
```
[Tabs: Upcoming | Past]
[List of bookings with details]
[Cancel buttons for upcoming]
```

---

## ✅ Success Criteria

Project is **successfully tested** when:

1. ✅ Can browse from HomePage to MovieDetail
2. ✅ Can select show date and theater
3. ✅ Can select seats and see price calculate
4. ✅ Can navigate to payment page
5. ✅ Razorpay modal opens (or configured message)
6. ✅ Booking saves to database (after payment)
7. ✅ Can view booking in MyBookings
8. ✅ Can cancel booking
9. ✅ No console errors on any page
10. ✅ Dark theme applied consistently
11. ✅ All buttons are clickable and functional
12. ✅ Mobile view works on small screens

---

## 📞 Common Issues & Solutions

### "Cannot GET /movies/getMovies"
**Problem**: API endpoint not working  
**Solutions**:
1. Check if server is running (should see "Server running on http://localhost:3000")
2. Restart server: Close terminal, run `npm run dev` again
3. Check if correct route file exists

### "Razorpay is not defined"
**Problem**: Razorpay script didn't load  
**Solutions**:
1. Check Network tab (F12) - see if script loaded?
2. Refresh page (Ctrl+R)
3. Check if using http (not https) for localhost

### Seats not rendering
**Problem**: Seats page shows error  
**Solutions**:
1. Make sure showId in URL is valid
2. Check if show exists in database
3. Check browser console for API error
4. Try different showId

### Payment button doesn't open modal
**Problem**: Razorpay not initialized  
**Solutions**:
1. Set RAZORPAY_KEY_ID in client/.env.local
2. Refresh page after adding env var
3. Check if Razorpay script loaded (Network tab)

---

## 🚀 Next After Testing

Once testing is complete and working:

1. **Create test data**
   - Add 5-10 movies
   - Add 2-3 theaters
   - Add shows for different dates
   - Set seat prices

2. **Complete remaining features**
   - Implement email notifications
   - Add PDF ticket generation
   - Implement seat locking
   - Admin booking management

3. **Performance & optimization**
   - Optimize images
   - Reduce bundle size
   - Cache API responses
   - Database query optimization

4. **Security audit**
   - Review JWT implementation
   - Check CORS settings
   - Input validation everywhere
   - SQL injection prevention

5. **Deployment**
   - Set up production database
   - Configure environment variables
   - Deploy to hosting service
   - Set up SSL certificate

---

## 📋 Keep This Checklist Handy

**Before Testing:**
- [ ] Server running on port 3000?
- [ ] Client running on port 5173?
- [ ] Checked .env files?
- [ ] Database connected?

**During Testing:**
- [ ] Opening F12 console to check errors?
- [ ] Testing on mobile view?
- [ ] Testing each route?
- [ ] Checking API responses?

**After Testing:**
- [ ] Document any issues found
- [ ] Note which features work
- [ ] List which features need fixes
- [ ] Plan next steps

---

**Happy Testing! 🎬**

If you find any issues not listed here, check the browser console (F12) and the server terminal for detailed error messages.

Good luck! 🚀
