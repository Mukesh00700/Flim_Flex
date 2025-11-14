# 🎫 Seat Type Pricing System - Usage Guide

## ✅ Feature Already Implemented!

Your FilmFlex application **already has** a complete seat type pricing system that allows you to set different prices for Basic, Recliner, and VIP seats.

---

## 📍 How to Access

### For Admins:
1. **Login** as an admin user
2. Navigate to **Admin Dashboard**
3. Click on **"Pricing"** tab in the sidebar
4. You'll see the **Pricing Management** page

**Direct URL:** `http://localhost:5174/admin/pricing`

---

## 🎯 Features Available

### 1. **Per-Show Pricing**
- Set different prices for each show individually
- Allows flexible pricing based on:
  - Time of day (matinee vs evening)
  - Day of week (weekday vs weekend)
  - Movie popularity (new releases vs regular)

### 2. **Three Seat Types**
- **Basic Seats** - Standard seating (e.g., ₹150-250)
- **Recliner Seats** - Comfortable recliners (e.g., ₹250-400)
- **VIP Seats** - Premium experience (e.g., ₹350-600)

### 3. **Easy Management**
- View all shows in a list
- Expand any show to set prices
- See how many prices are set (e.g., "2/3 prices set")
- Update prices anytime
- Delete individual seat type prices

---

## 🖥️ User Interface

### Pricing Page Layout:
```
┌─────────────────────────────────────────────┐
│  💰 Pricing Management                      │
├─────────────────────────────────────────────┤
│  [Show 1] Movie Name - Theater - Hall      │
│  Date & Time                        [2/3]  ▼│
│  ┌─────────────────────────────────────────┐│
│  │ Basic Seat: ₹ [200]              [🗑️]   ││
│  │ Recliner:   ₹ [350]              [🗑️]   ││
│  │ VIP:        ₹ [500]              [🗑️]   ││
│  │                                          ││
│  │        [💾 Save Prices]                  ││
│  └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│  [Show 2] ...                               │
└─────────────────────────────────────────────┘
```

---

## 🔧 Backend API Endpoints

All endpoints are ready and working:

### Get Prices for a Show
```http
GET /prices/show/:showId
```

### Set Multiple Prices for a Show
```http
POST /prices/show/:showId/set
Content-Type: application/json

{
  "prices": [
    { "seatType": "basic", "price": 200 },
    { "seatType": "recliner", "price": 350 },
    { "seatType": "vip", "price": 500 }
  ]
}
```

### Update Single Price
```http
POST /prices/upsert
Content-Type: application/json

{
  "showId": 1,
  "seatType": "basic",
  "price": 250
}
```

### Delete Price
```http
DELETE /prices/:priceId
```

### Get All Shows for Pricing
```http
GET /prices/shows/list
```

---

## 💾 Database Structure

### Prices Table:
```sql
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    show_id INT NOT NULL REFERENCES shows(id),
    seat_type seat_type NOT NULL,  -- 'basic', 'recliner', 'vip'
    price NUMERIC(10,2) NOT NULL,
    valid_from TIMESTAMPTZ,
    valid_to TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (show_id, seat_type)  -- One price per seat type per show
);
```

---

## 📝 How to Use - Step by Step

### Setting Prices for a New Show:

1. **Create a show first** (in Shows Management)
   - Select movie, theater, hall, and time

2. **Go to Pricing page** (`/admin/pricing`)
   - You'll see all shows listed

3. **Expand the show** you want to price
   - Click on the show row

4. **Enter prices** for each seat type:
   - Basic: Enter amount (e.g., 200)
   - Recliner: Enter amount (e.g., 350)
   - VIP: Enter amount (e.g., 500)

5. **Click "Save Prices"**
   - Prices are saved to database
   - Shows "2/3 prices set" indicator

6. **Edit anytime**:
   - Change any price and click Save again
   - Use 🗑️ icon to delete a specific seat type price

---

## 🎬 How Customers See It

When customers book tickets:
1. They select a show
2. Choose seats from the seat map
3. **Each seat shows its price based on type:**
   - Basic seats: ₹200
   - Recliner seats: ₹350
   - VIP seats: ₹500
4. Total amount calculates automatically
5. Different prices for different seat types!

---

## 💡 Pricing Strategy Tips

### Recommended Price Ranges (Indian Market):

**Weekday Matinee (Morning Shows):**
- Basic: ₹120 - ₹180
- Recliner: ₹200 - ₹300
- VIP: ₹250 - ₹400

**Weekday Evening:**
- Basic: ₹150 - ₹250
- Recliner: ₹250 - ₹400
- VIP: ₹350 - ₹550

**Weekend / Holidays:**
- Basic: ₹200 - ₹300
- Recliner: ₹300 - ₹450
- VIP: ₹400 - ₹650

**New Releases / Blockbusters:**
- Add ₹50-100 premium to all categories

**Special Shows (IMAX, 3D, etc.):**
- Add ₹100-150 premium

---

## 🔍 Example Scenarios

### Scenario 1: Regular Movie, Tuesday Evening
```
Show: "Normal Drama Film"
Time: Tuesday, 7:00 PM
Basic: ₹180
Recliner: ₹280
VIP: ₹380
```

### Scenario 2: Blockbuster, Saturday Night
```
Show: "Big Action Movie"
Time: Saturday, 9:00 PM
Basic: ₹250
Recliner: ₹400
VIP: ₹550
```

### Scenario 3: Family Movie, Sunday Matinee
```
Show: "Family Comedy"
Time: Sunday, 11:00 AM
Basic: ₹150
Recliner: ₹250
VIP: ₹350
```

---

## ✅ Current Status

- ✅ Database table created
- ✅ Backend API endpoints working
- ✅ Frontend UI implemented
- ✅ Admin access configured
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Integration with booking system
- ✅ Real-time price calculation

---

## 🚀 Ready to Use!

**You can start setting prices right now:**
1. Start your server: `cd server && npm run dev`
2. Start your client: `cd client && npm run dev`
3. Login as admin
4. Go to `/admin/pricing`
5. Set prices for your shows!

---

## 📞 Need Help?

If you encounter any issues:
1. Check if shows are created first
2. Verify admin authentication
3. Check browser console for errors
4. Verify backend is running on port 3000

**The feature is fully functional and ready to use!** 🎉
