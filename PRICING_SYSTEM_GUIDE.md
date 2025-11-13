# 💰 Pricing System - Complete Implementation Guide

## Overview

The Film Flex pricing system allows **different movies to have different seat prices** and **different seat types to have different prices** within the same movie show. This is a powerful dynamic pricing system.

---

## 📊 Database Schema - Prices Table

```sql
CREATE TABLE IF NOT EXISTS prices (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    show_id INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    seat_type seat_type NOT NULL DEFAULT 'basic',
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (show_id, seat_type)
);
```

### Key Points:
- **One price per seat type per show** (enforced by unique constraint)
- **Prices are show-specific**, not movie-specific
- **Three seat types supported**: `basic`, `recliner`, `vip`
- Deleting a show automatically deletes its prices (CASCADE)

---

## 🎯 How Pricing Works

### Scenario Example:

**Movie:** Pushpa 2  
**Theater:** PVR Cinemas  
**Hall:** Screen 1

**Show 1** (11:00 AM - Matinee):
- Basic Seats: ₹150
- Recliner: ₹250
- VIP: ₹350

**Show 2** (6:00 PM - Evening):
- Basic Seats: ₹250
- Recliner: ₹400
- VIP: ₹600

**Show 3** (9:00 PM - Night):
- Basic Seats: ₹300
- Recliner: ₹500
- VIP: ₹700

This allows for **peak hour pricing** where evening and night shows cost more!

---

## 🛠️ Admin Panel - Pricing Management

### Access Location
```
/admin/pricing
```

### Features

#### 1. **View All Shows**
- Lists all scheduled shows with pricing status
- Shows how many seat types have pricing (e.g., "2/3 prices set")
- Click to expand and edit

#### 2. **Set Prices**
- For each show, set prices for all 3 seat types:
  - **Basic Seats**: Economy/standard seats
  - **Recliner**: Comfortable recliners
  - **VIP**: Premium seats with best view

#### 3. **Save Prices**
- Click "Save Prices" to update all seat types at once
- Old prices are replaced with new ones

#### 4. **Delete Prices**
- Delete individual seat type prices if needed
- Useful if you don't offer a particular seat type in a hall

---

## 💻 Backend API Endpoints

### 1. **Get Prices for a Show**
```
GET /api/prices/show/:showId
```

**Response:**
```json
[
  {
    "id": 1,
    "show_id": 101,
    "seat_type": "basic",
    "price": 250.00
  },
  {
    "id": 2,
    "show_id": 101,
    "seat_type": "recliner",
    "price": 400.00
  },
  {
    "id": 3,
    "show_id": 101,
    "seat_type": "vip",
    "price": 600.00
  }
]
```

---

### 2. **Get All Shows for Pricing**
```
GET /api/prices/shows/list
Headers: Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 101,
    "show_time": "2025-11-15T18:00:00Z",
    "movie_title": "Pushpa 2",
    "theater_name": "PVR Cinemas",
    "hall_name": "Screen 1",
    "price_count": 3
  }
]
```

---

### 3. **Set/Update Price for Show & Seat Type**
```
POST /api/prices/upsert
Headers: Authorization: Bearer {token}

Body:
{
  "showId": 101,
  "seatType": "basic",
  "price": 250.00
}
```

---

### 4. **Set Multiple Prices for a Show (Bulk)**
```
POST /api/prices/show/:showId/set
Headers: Authorization: Bearer {token}

Body:
{
  "prices": [
    { "seatType": "basic", "price": 250 },
    { "seatType": "recliner", "price": 400 },
    { "seatType": "vip", "price": 600 }
  ]
}
```

---

### 5. **Delete a Price**
```
DELETE /api/prices/:priceId
Headers: Authorization: Bearer {token}
```

---

## 🎬 How Customers See Prices

### On Seat Selector Page

When a customer books tickets:

1. **Select Movie** → Movie Detail page shows shows
2. **Select Show** → Show Scheduler shows available times
3. **Click Show** → Takes to seat selection page
4. **Each seat displays its price** based on seat type and show

**Example Display:**
```
Row A
[A1: ₹250] [A2: ₹250] [A3: ₹250] [A4: ₹250]

Row B
[B1: ₹400] [B2: ₹400] [B3: ₹400] [B4: ₹400]

Row C
[C1: ₹600] [C2: ₹600] [C3: ₹600] [C4: ₹600]

Total: ₹1,250 (1 basic + 1 recliner + 1 VIP)
```

---

## 📱 Frontend Integration

### 1. **Pricing Setup After Scheduling a Show**

```javascript
// Step 1: Admin schedules a show via /admin/shows
// Step 2: Show appears in /admin/pricing
// Step 3: Admin expands the show and sets prices
// Step 4: Prices are saved to database
```

### 2. **Pricing Used During Booking**

In `SeatSelector.jsx`:
```javascript
// Fetches seats with prices
const seatsQuery = await pool.query(
  `SELECT st.id, p.price
   FROM seats st
   LEFT JOIN prices p ON p.show_id = $1 AND p.seat_type = st.seat_type
   WHERE st.hall_id = $2`
);

// Each seat has its price from the prices table
```

---

## 🎯 Pricing Strategy Examples

### Strategy 1: Time-Based Pricing
```
Morning Show (11 AM):   ₹150 / ₹250 / ₹350
Afternoon Show (3 PM):  ₹200 / ₹300 / ₹450
Evening Show (6 PM):    ₹250 / ₹400 / ₹600
Night Show (9 PM):      ₹300 / ₹500 / ₹700
```

### Strategy 2: Movie Popularity Pricing
```
Blockbuster Movie:      ₹300 / ₹500 / ₹800
Regular Movie:          ₹200 / ₹350 / ₹500
Old Release:            ₹150 / ₹250 / ₹350
```

### Strategy 3: Day-Based Pricing
```
Weekday Show:           ₹150 / ₹250 / ₹350
Weekend Show:           ₹250 / ₹400 / ₹600
Holiday Show:           ₹300 / ₹500 / ₹700
```

---

## 🔍 Real-Time Pricing Verification

### Customer Booking Flow

1. **Customer selects 2 seats** (1 Basic @ ₹250, 1 VIP @ ₹600)
2. **System validates** prices in database
3. **Total calculated**: ₹850
4. **Payment gateway** processes ₹850
5. **Booking saved** with seat prices

---

## ⚠️ Important Notes

1. **Price must be set before booking** - Ensure prices are configured before show time
2. **Prices are per show** - Different shows have different prices
3. **Seat types must exist** - Hall must have seats of these types
4. **Unique constraint** - Only one price per seat type per show
5. **Cascade delete** - Deleting a show deletes all its prices

---

## 🚀 Quick Setup Guide

### For Admin

1. Navigate to `/admin/movies` → Add movies
2. Navigate to `/admin/theaters` → Add theaters → Add halls
3. Navigate to `/admin/shows` → Schedule shows to theaters/halls
4. Navigate to `/admin/pricing` → Set prices for each show and seat type
5. Shows are now ready for customer bookings!

### Example Complete Workflow

```
1. Add movie: "Pushpa 2"
   ↓
2. Add theater: "PVR Cinemas, Mumbai"
   ↓
3. Add hall: "Screen 1, 100 seats"
   ↓
4. Add seats to hall: 
   - Row A-E (25 seats): Basic
   - Row F-H (20 seats): Recliner
   - Row I-J (5 seats): VIP
   ↓
5. Schedule show: "Pushpa 2 @ PVR Screen 1, 6 PM"
   ↓
6. Set prices:
   - Basic: ₹250
   - Recliner: ₹400
   - VIP: ₹600
   ↓
7. Show is now live for customer bookings!
```

---

## 📞 Support

If prices aren't showing during booking:
1. Check if prices are set for the show in `/admin/pricing`
2. Verify seat types exist in the hall
3. Ensure show is scheduled with proper date/time
4. Clear browser cache and refresh

---

## 🎉 Summary

✅ **Dynamic pricing by show** - Each show has its own prices  
✅ **Flexible seat type pricing** - Basic, Recliner, VIP can have different prices  
✅ **Easy admin interface** - Set prices in minutes via `/admin/pricing`  
✅ **Real-time calculation** - Prices update instantly when customers book  
✅ **Scalable** - Works for multiple theaters, halls, and shows  

Happy pricing! 🎬
