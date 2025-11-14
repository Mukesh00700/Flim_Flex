# 🧪 Quick Test: Customizable Hall Creation

## Test the new customizable seat feature

### 1. Login as Admin

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@filmflex.com",
    "password": "password123"
  }'
```

Save the token from response:
```bash
TOKEN="your_token_here"
```

---

### 2. Create Theater (if needed)

```bash
curl -X POST http://localhost:3000/theater/createTheater \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "PVR Phoenix",
    "city": "Mumbai",
    "address": "Phoenix Market City, Kurla"
  }'
```

Note the theater ID from response (e.g., `id: 1`)

---

### 3. Create Hall with Custom Seats ⭐ NEW

#### Test 1: Small Hall (50 seats)

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Screen 1",
    "seatConfiguration": {
      "rows": ["A", "B", "C", "D", "E"],
      "seatsPerRow": 10,
      "vipRows": ["A", "B"]
    }
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "theater_id": 1,
  "name": "Screen 1",
  "capacity": 50,
  "created_at": "2025-11-14T...",
  "seat_count": 50
}
```

**Seat Breakdown:**
- Row A: 10 VIP seats (A1-A10)
- Row B: 10 VIP seats (B1-B10)
- Row C: 10 Basic seats (C1-C10)
- Row D: 10 Basic seats (D1-D10)
- Row E: 10 Basic seats (E1-E10)
- **Total: 50 seats**

---

#### Test 2: Medium Hall with Recliners (150 seats)

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Screen 2",
    "seatConfiguration": {
      "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      "seatsPerRow": 15,
      "vipRows": ["A", "B", "C"],
      "reclinerRows": ["I", "J"]
    }
  }'
```

**Expected Response:**
```json
{
  "id": 2,
  "theater_id": 1,
  "name": "Screen 2",
  "capacity": 150,
  "created_at": "2025-11-14T...",
  "seat_count": 150
}
```

**Seat Breakdown:**
- Rows A-C: 45 VIP seats (15 seats × 3 rows)
- Rows D-H: 75 Basic seats (15 seats × 5 rows)
- Rows I-J: 30 Recliner seats (15 seats × 2 rows)
- **Total: 150 seats**

---

#### Test 3: Large IMAX Hall (300 seats)

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "IMAX",
    "capacity": 300,
    "seatConfiguration": {
      "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
      "seatsPerRow": 20,
      "vipRows": ["A", "B", "C", "D", "E"],
      "reclinerRows": ["M", "N", "O"]
    }
  }'
```

**Expected Response:**
```json
{
  "id": 3,
  "theater_id": 1,
  "name": "IMAX",
  "capacity": 300,
  "created_at": "2025-11-14T...",
  "seat_count": 300
}
```

**Seat Breakdown:**
- Rows A-E: 100 VIP seats (20 × 5)
- Rows F-L: 140 Basic seats (20 × 7)
- Rows M-O: 60 Recliner seats (20 × 3)
- **Total: 300 seats**

---

#### Test 4: Custom Row Labels

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Premium Lounge",
    "seatConfiguration": {
      "rows": ["GOLD1", "GOLD2", "SILVER1", "SILVER2", "SILVER3"],
      "seatsPerRow": 8,
      "vipRows": ["GOLD1", "GOLD2"]
    }
  }'
```

**Expected Response:**
```json
{
  "id": 4,
  "theater_id": 1,
  "name": "Premium Lounge",
  "capacity": 40,
  "created_at": "2025-11-14T...",
  "seat_count": 40
}
```

**Seat Breakdown:**
- GOLD1: 8 VIP seats
- GOLD2: 8 VIP seats
- SILVER1-3: 24 Basic seats
- **Total: 40 seats**

---

### 4. Verify Created Seats

#### Get All Halls for Theater

```bash
curl http://localhost:3000/theater/1/halls \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Screen 1",
    "capacity": 50,
    "theater_id": 1,
    "seat_count": "50"
  },
  {
    "id": 2,
    "name": "Screen 2",
    "capacity": 150,
    "theater_id": 1,
    "seat_count": "150"
  },
  {
    "id": 3,
    "name": "IMAX",
    "capacity": 300,
    "theater_id": 1,
    "seat_count": "300"
  }
]
```

---

#### Get Seats for a Specific Hall

```bash
# Get seats for Screen 2 (hall_id = 2)
curl http://localhost:3000/api/bookings/seats/2 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (partial):**
```json
{
  "show": null,
  "seats": [
    {
      "id": 51,
      "hall_id": 2,
      "row": "A",
      "number": 1,
      "type": "vip",
      "isBooked": false
    },
    {
      "id": 52,
      "hall_id": 2,
      "row": "A",
      "number": 2,
      "type": "vip",
      "isBooked": false
    },
    // ... more seats
    {
      "id": 185,
      "hall_id": 2,
      "row": "I",
      "number": 1,
      "type": "recliner",
      "isBooked": false
    }
    // ... 150 total seats
  ]
}
```

---

### 5. Error Cases to Test

#### Missing Required Fields

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Incomplete Hall",
    "seatConfiguration": {
      "rows": ["A", "B", "C"]
    }
  }'
```

**Expected Error:**
```json
{
  "msg": "seatConfiguration must include rows (array of row labels) and seatsPerRow (number)"
}
```

---

#### Hall Without Seats (Old Method Still Works)

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Empty Hall",
    "capacity": 100
  }'
```

**Expected Response:**
```json
{
  "id": 5,
  "theater_id": 1,
  "name": "Empty Hall",
  "capacity": 100,
  "created_at": "2025-11-14T...",
  "seat_count": 0
}
```

---

## 📊 Quick Calculation Reference

| Rows | Seats/Row | Total Seats |
|------|-----------|-------------|
| 5    | 10        | 50          |
| 8    | 12        | 96          |
| 10   | 15        | 150         |
| 12   | 16        | 192         |
| 15   | 20        | 300         |
| 20   | 20        | 400         |

---

## ✅ Validation Checklist

After running tests, verify:

- [ ] Hall created with correct name
- [ ] Capacity matches seat count (if not manually specified)
- [ ] `seat_count` matches expected total
- [ ] VIP seats created in correct rows
- [ ] Recliner seats created in correct rows
- [ ] Basic seats fill remaining rows
- [ ] Row labels match input
- [ ] Seat numbers start at 1 for each row
- [ ] Can query seats via `/api/bookings/seats/:hallId`
- [ ] Old API (without seatConfiguration) still works

---

## 🎯 Real-World Scenario Test

### Create a Complete Theater

```bash
# 1. Create Theater
THEATER_ID=$(curl -X POST http://localhost:3000/theater/createTheater \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "CineMax Multiplex",
    "city": "Delhi",
    "address": "Connaught Place"
  }' | jq -r '.id')

# 2. Create Multiple Halls
# Hall 1: Small
curl -X POST http://localhost:3000/theater/$THEATER_ID/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Screen 1",
    "seatConfiguration": {
      "rows": ["A", "B", "C", "D", "E"],
      "seatsPerRow": 10,
      "vipRows": ["A", "B"]
    }
  }'

# Hall 2: Medium
curl -X POST http://localhost:3000/theater/$THEATER_ID/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Screen 2",
    "seatConfiguration": {
      "rows": ["A", "B", "C", "D", "E", "F", "G", "H"],
      "seatsPerRow": 15,
      "vipRows": ["A", "B", "C"],
      "reclinerRows": ["G", "H"]
    }
  }'

# Hall 3: IMAX
curl -X POST http://localhost:3000/theater/$THEATER_ID/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "IMAX",
    "seatConfiguration": {
      "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
      "seatsPerRow": 20,
      "vipRows": ["A", "B", "C", "D", "E"],
      "reclinerRows": ["K", "L"]
    }
  }'

# 3. Verify All Halls
curl http://localhost:3000/theater/$THEATER_ID/halls \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Result:**
- Theater created
- 3 halls created
- Hall 1: 50 seats
- Hall 2: 120 seats  
- Hall 3: 240 seats
- **Total: 410 seats across 3 halls**

---

## 🚀 You're Ready!

The customizable hall & seat system is fully implemented. Use the examples above to test and integrate into your frontend! 🎬
