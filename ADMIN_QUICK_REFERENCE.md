# 🎬 Film Flex Admin - Quick Reference Guide

## 🔐 Admin Access

**Admin Login:** `/loginAdmin` or `/registerAdmin`  
**Admin Panel:** `/admin`

---

## 📍 Admin Panel Navigation

```
/admin/                    → Dashboard (real-time stats)
/admin/movies              → Movie Management (Add/Edit/Delete)
/admin/theaters            → Theater & Hall Management
/admin/shows               → Show Scheduler
/admin/pricing             → Pricing Setup (PRICING SYSTEM)
/admin/bookings            → Booking Management
/admin/users               → User Management
```

---

## 🎯 Complete Admin Workflow

### **Week 1: Setup**

```
1. Login as Admin
   ↓
2. Go to /admin/theaters
   - Create Theater: "PVR Cinemas, Mumbai"
   - Add Halls: "Screen 1", "Screen 2"
   ↓
3. Go to /admin/movies
   - Add Movie: "Pushpa 2"
   - Add Movie: "Kalki 2898 AD"
```

### **Week 2: Schedule & Price**

```
1. Go to /admin/shows
   - Schedule "Pushpa 2" @ Screen 1, 6 PM
   - Schedule "Pushpa 2" @ Screen 1, 9 PM
   - Schedule "Kalki" @ Screen 2, 6 PM
   ↓
2. Go to /admin/pricing
   - Set prices for 6 PM show: ₹250/₹400/₹600
   - Set prices for 9 PM show: ₹300/₹500/₹700
```

### **Week 3+: Monitor**

```
1. Go to /admin (Dashboard)
   - Check revenue
   - See bookings
   ↓
2. Go to /admin/bookings
   - View all bookings
   - Search and filter
   - Cancel if needed
   ↓
3. Go to /admin/users
   - See recent customers
```

---

## 💰 Pricing - 3 Simple Steps

### **Step 1: Schedule Show**
```
/admin/shows
├─ Select Theater
├─ Select Hall
├─ Click "Schedule Show"
└─ Fill: Movie, Date/Time, Language
```

### **Step 2: Check Pricing Page**
```
/admin/pricing
└─ Your show appears in the list
```

### **Step 3: Set Prices**
```
Click expand on your show
├─ Basic Seats: ₹250
├─ Recliner: ₹400
└─ VIP: ₹600
Click "Save Prices" ✅
```

---

## 📊 Pricing Examples

### **3-Tier Pricing Model** (Most Popular)
```
SHOW: Movie @ 6 PM
├─ Basic:    ₹200 (Front rows, simple seats)
├─ Recliner: ₹350 (Middle rows, reclining seats)
└─ VIP:      ₹550 (Back rows, best view + recliners)
```

### **Time-Based Pricing**
```
Morning (11 AM):    ₹150 / ₹250 / ₹350
Afternoon (3 PM):   ₹200 / ₹300 / ₹450
Evening (6 PM):     ₹250 / ₹400 / ₹600  ⭐ PEAK
Night (9 PM):       ₹300 / ₹500 / ₹700  ⭐ PEAK
```

### **Movie Popularity**
```
Blockbuster:        ₹300 / ₹500 / ₹800
Regular:            ₹200 / ₹350 / ₹500
Old/Weekday:        ₹150 / ₹250 / ₹350
```

---

## 📱 What Customers See

```
HOME PAGE
    ↓
MOVIE DETAIL
├─ Shows for movie
├─ Theater, Time, Language
├─ Available seats
└─ Prices shown
    ↓
SEAT SELECTOR
├─ Seat layout
├─ PRICE PER SEAT (from pricing table)
├─ Shows ₹250 for Basic, ₹400 for Recliner, etc.
└─ Real-time total calculation
    ↓
BOOKING CONFIRMATION
├─ Movie, Theater, Time
├─ Selected seats with prices
├─ Total amount
└─ Payment
```

---

## 🔑 Key Features

### **Movies**
- ✅ Add with: Title, Genre, Languages, Release Date, Description, Poster
- ✅ Edit existing movies anytime
- ✅ Delete (removes associated shows)

### **Theaters & Halls**
- ✅ Create theater with City + Address
- ✅ Add multiple halls per theater
- ✅ Edit/Delete
- ✅ See seat count per hall

### **Shows**
- ✅ Schedule movie to specific hall
- ✅ Set date, time, language
- ✅ Edit time/language
- ✅ Delete (if no bookings)

### **Pricing** 💰
- ✅ Set price per seat type per show
- ✅ Three types: Basic, Recliner, VIP
- ✅ Edit prices anytime
- ✅ Bulk set for all 3 types at once

### **Bookings**
- ✅ View all bookings
- ✅ Search by ID/Customer/Movie
- ✅ Filter by status
- ✅ Cancel bookings

### **Users**
- ✅ See recent customers
- ✅ Track their bookings

---

## 🚨 Common Issues & Solutions

### **Problem: Show not appearing in pricing**
```
Solution:
1. Go to /admin/shows
2. Check if show is scheduled
3. Shows created within last hour might not appear
4. Try refreshing page
```

### **Problem: Customer can't see prices in booking**
```
Solution:
1. Go to /admin/pricing
2. Check if prices are set for that show
3. Must have prices before booking opens
4. Ensure all 3 seat types have prices
```

### **Problem: Can't delete show**
```
Solution:
1. Check /admin/bookings
2. If there are bookings for that show
3. Cancel bookings first
4. Then delete show
```

### **Problem: Theater not showing**
```
Solution:
1. Ensure you're logged in as admin
2. Admins see only their theaters
3. Super admins see all theaters
4. Try refreshing the page
```

---

## 📊 Dashboard Metrics

Your `/admin` dashboard shows:

- **Total Movies** - All movies in system
- **Total Users** - Registered customers
- **Total Bookings** - All bookings made
- **Total Revenue** - Sum of all booking amounts
- **Average Booking** - Revenue ÷ Bookings
- **Occupancy Rate** - % of seats booked
- **Recent Bookings** - Last 5 bookings

---

## 🔐 Permissions

### **Admin Role**
- Manage own theaters only
- Can't see other admins' theaters
- Can schedule shows in own theaters
- Can set prices for own shows

### **Super Admin Role**
- Manage all theaters
- See all shows
- See all bookings
- Create other admins

---

## ⚡ Pro Tips

1. **Set prices immediately after scheduling** - Don't wait, prices enable bookings
2. **Use peak hour pricing** - Higher prices for evening/weekend shows
3. **Bulk pricing** - Set all 3 seat types at once for efficiency
4. **Regular backups** - Backup your database regularly
5. **Monitor revenue** - Check dashboard daily to track performance
6. **Manage inventory** - Monitor available seats per show
7. **Customer follow-up** - See recent customers and their bookings

---

## 📋 Checklist Before Launch

- [ ] Create theater
- [ ] Add halls to theater
- [ ] Add movies
- [ ] Schedule shows
- [ ] Set prices for all shows
- [ ] Test booking as customer
- [ ] Verify prices shown correctly
- [ ] Check revenue calculation
- [ ] Test cancellation
- [ ] Monitor dashboard

---

## 🎬 Example: Complete Setup in 10 Minutes

```
1. LOGIN (1 min)
   Admin dashboard opens
   
2. ADD THEATER (2 min)
   /admin/theaters
   → Create "PVR Cinemas"
   → Add "Screen 1"
   
3. ADD MOVIE (1 min)
   /admin/movies
   → Add "Pushpa 2"
   
4. SCHEDULE SHOW (2 min)
   /admin/shows
   → Select "PVR Cinemas" → "Screen 1"
   → Schedule "Pushpa 2" @ 6 PM
   
5. SET PRICES (2 min)
   /admin/pricing
   → Find show
   → Set ₹250/₹400/₹600
   → Save

✅ DONE! Ready for bookings!
```

---

## 📞 API Endpoints (For Reference)

**Movies**
```
POST /movies/addMovies
PUT /movies/updateMovies/:id
DELETE /movies/deleteMovies/:id
GET /movies/getMovies
```

**Theaters**
```
POST /theaters/createTheater
GET /theaters/getTheaters
PUT /theaters/updateTheater/:id
DELETE /theaters/deleteTheater/:id
```

**Halls**
```
POST /theaters/:theaterId/halls
GET /theaters/:theaterId/halls
DELETE /theaters/halls/:hallId
```

**Shows**
```
POST /api/bookings/schedule/create
PUT /api/bookings/schedule/:showId
DELETE /api/bookings/schedule/:showId
GET /api/bookings/hall/:hallId/shows
```

**Pricing** 💰
```
POST /api/prices/upsert
POST /api/prices/show/:showId/set
GET /api/prices/show/:showId
DELETE /api/prices/:priceId
```

---

## 🎉 You're All Set!

Your Film Flex admin panel is ready to manage theaters like a pro! 🚀

**Start with:** `/admin` → Dashboard  
**Then visit:** Each section to set up your theater operations

Good luck! 🍿🎬
