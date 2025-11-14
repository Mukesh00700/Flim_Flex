# 🎭 Customizable Hall & Seat Configuration API

## Overview

The hall creation system now supports **customizable seat configuration**. When creating a hall, you can specify:
- Custom number of rows
- Custom seats per row
- VIP rows designation
- Recliner rows designation
- Automatic capacity calculation

---

## 📡 API Endpoint

### Create Hall with Custom Seats

**Endpoint:** `POST /theater/:theaterId/halls`

**Authorization:** Required (Admin/Super Admin only)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 🎯 Request Body Options

### Option 1: Basic Hall (No Seats)

Create a hall without seats. Seats can be added later using the `/halls/:hallId/seats` endpoint.

```json
{
  "name": "Screen 1",
  "capacity": 100
}
```

---

### Option 2: Hall with Auto-Generated Seats ⭐ NEW

Create a hall with automatic seat generation based on configuration.

```json
{
  "name": "Screen 1",
  "capacity": 150,
  "seatConfiguration": {
    "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    "seatsPerRow": 15,
    "vipRows": ["A", "B", "C"],
    "reclinerRows": ["I", "J"]
  }
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rows` | Array of Strings | Yes | Array of row labels (e.g., ["A", "B", "C"]) |
| `seatsPerRow` | Number | Yes | Number of seats in each row |
| `vipRows` | Array of Strings | No | Row labels that should be VIP type |
| `reclinerRows` | Array of Strings | No | Row labels that should be recliner type |

**Seat Type Priority:**
1. If row is in `vipRows` → seat type = `vip`
2. Else if row is in `reclinerRows` → seat type = `recliner`
3. Else → seat type = `basic`

---

## 📝 Examples

### Example 1: Small Hall (50 Seats)

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mini Screen",
    "seatConfiguration": {
      "rows": ["A", "B", "C", "D", "E"],
      "seatsPerRow": 10,
      "vipRows": ["A", "B"]
    }
  }'
```

**Result:**
- 5 rows (A-E)
- 10 seats per row
- Total: 50 seats
- Rows A, B: VIP (20 seats)
- Rows C, D, E: Basic (30 seats)

---

### Example 2: Medium Hall (120 Seats)

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Screen 2",
    "seatConfiguration": {
      "rows": ["A", "B", "C", "D", "E", "F", "G", "H"],
      "seatsPerRow": 15,
      "vipRows": ["A", "B"],
      "reclinerRows": ["G", "H"]
    }
  }'
```

**Result:**
- 8 rows (A-H)
- 15 seats per row
- Total: 120 seats
- Rows A, B: VIP (30 seats)
- Rows C, D, E, F: Basic (60 seats)
- Rows G, H: Recliner (30 seats)

---

### Example 3: Large IMAX Hall (300 Seats)

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IMAX Screen",
    "capacity": 300,
    "seatConfiguration": {
      "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
      "seatsPerRow": 20,
      "vipRows": ["A", "B", "C", "D", "E"],
      "reclinerRows": ["M", "N", "O"]
    }
  }'
```

**Result:**
- 15 rows (A-O)
- 20 seats per row
- Total: 300 seats
- Rows A-E: VIP (100 seats)
- Rows F-L: Basic (140 seats)
- Rows M-O: Recliner (60 seats)

---

### Example 4: Custom Row Labels

```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Hall",
    "seatConfiguration": {
      "rows": ["VIP1", "VIP2", "STD1", "STD2", "STD3", "REC1", "REC2"],
      "seatsPerRow": 12,
      "vipRows": ["VIP1", "VIP2"],
      "reclinerRows": ["REC1", "REC2"]
    }
  }'
```

**Result:**
- 7 custom rows
- 12 seats per row
- Total: 84 seats
- Custom row naming

---

## ✅ Success Response

**Status:** `201 Created`

```json
{
  "id": 5,
  "theater_id": 1,
  "name": "Screen 2",
  "capacity": 120,
  "created_at": "2025-11-14T10:30:00.000Z",
  "seat_count": 120
}
```

---

## ❌ Error Responses

### Missing Required Fields

**Status:** `400 Bad Request`

```json
{
  "msg": "seatConfiguration must include rows (array of row labels) and seatsPerRow (number)"
}
```

### Unauthorized

**Status:** `403 Forbidden`

```json
{
  "msg": "Not authorized"
}
```

### Theater Not Found

**Status:** `500 Internal Server Error`

```json
{
  "msg": "Server error"
}
```

---

## 🔄 Update Existing Hall Seats

You can still add seats to existing halls using the existing endpoint:

**Endpoint:** `POST /theater/halls/:hallId/seats`

```json
{
  "seats": [
    { "row_label": "K", "seat_number": 1, "seat_type": "basic" },
    { "row_label": "K", "seat_number": 2, "seat_type": "basic" },
    { "row_label": "K", "seat_number": 3, "seat_type": "vip" }
  ]
}
```

---

## 🎨 Frontend Implementation Example

### React Component

```javascript
import { useState } from 'react';

const CreateHallForm = ({ theaterId, onSuccess }) => {
  const [hallData, setHallData] = useState({
    name: '',
    rows: '',
    seatsPerRow: '',
    vipRows: '',
    reclinerRows: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: hallData.name,
      seatConfiguration: {
        rows: hallData.rows.split(',').map(r => r.trim()),
        seatsPerRow: parseInt(hallData.seatsPerRow),
        vipRows: hallData.vipRows ? 
          hallData.vipRows.split(',').map(r => r.trim()) : [],
        reclinerRows: hallData.reclinerRows ? 
          hallData.reclinerRows.split(',').map(r => r.trim()) : []
      }
    };

    const response = await fetch(`/theater/${theaterId}/halls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      onSuccess(data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Hall Name:</label>
        <input
          type="text"
          value={hallData.name}
          onChange={(e) => setHallData({...hallData, name: e.target.value})}
          placeholder="e.g., Screen 1"
          required
        />
      </div>

      <div>
        <label>Rows (comma-separated):</label>
        <input
          type="text"
          value={hallData.rows}
          onChange={(e) => setHallData({...hallData, rows: e.target.value})}
          placeholder="e.g., A,B,C,D,E,F,G,H,I,J"
          required
        />
      </div>

      <div>
        <label>Seats Per Row:</label>
        <input
          type="number"
          value={hallData.seatsPerRow}
          onChange={(e) => setHallData({...hallData, seatsPerRow: e.target.value})}
          placeholder="e.g., 15"
          min="1"
          required
        />
      </div>

      <div>
        <label>VIP Rows (comma-separated, optional):</label>
        <input
          type="text"
          value={hallData.vipRows}
          onChange={(e) => setHallData({...hallData, vipRows: e.target.value})}
          placeholder="e.g., A,B,C"
        />
      </div>

      <div>
        <label>Recliner Rows (comma-separated, optional):</label>
        <input
          type="text"
          value={hallData.reclinerRows}
          onChange={(e) => setHallData({...hallData, reclinerRows: e.target.value})}
          placeholder="e.g., I,J"
        />
      </div>

      <div>
        <p>
          Total Seats: {
            hallData.rows && hallData.seatsPerRow ?
              hallData.rows.split(',').length * parseInt(hallData.seatsPerRow || 0) :
              0
          }
        </p>
      </div>

      <button type="submit">Create Hall with Seats</button>
    </form>
  );
};

export default CreateHallForm;
```

---

## 🎯 Common Seat Configurations

### Small Cinema (5 halls)

```javascript
const configurations = {
  screen1: {
    rows: ['A', 'B', 'C', 'D', 'E'],
    seatsPerRow: 10,
    vipRows: ['A', 'B']
  },
  screen2: {
    rows: ['A', 'B', 'C', 'D', 'E', 'F'],
    seatsPerRow: 12,
    vipRows: ['A', 'B', 'C']
  },
  screen3: {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: 15,
    vipRows: ['A', 'B'],
    reclinerRows: ['G', 'H']
  }
};
```

### Multiplex (10+ halls)

```javascript
const configurations = {
  regular: {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: 14,
    vipRows: ['A', 'B', 'C']
  },
  premium: {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    seatsPerRow: 16,
    vipRows: ['A', 'B', 'C', 'D'],
    reclinerRows: ['I', 'J']
  },
  imax: {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    seatsPerRow: 20,
    vipRows: ['A', 'B', 'C', 'D', 'E'],
    reclinerRows: ['K', 'L']
  }
};
```

---

## 💡 Best Practices

1. **Row Naming:**
   - Use alphabetical order: A, B, C, ...
   - For more rows: AA, AB, AC, ... or A1, A2, A3, ...
   - Keep labels short (max 5 characters)

2. **Seat Types:**
   - VIP rows typically at the front or middle
   - Recliner rows typically at the back
   - Basic rows fill the remaining space

3. **Capacity Planning:**
   - Small halls: 50-80 seats (5-8 rows, 10-12 seats/row)
   - Medium halls: 100-150 seats (8-12 rows, 12-15 seats/row)
   - Large halls: 200-300 seats (12-20 rows, 15-20 seats/row)

4. **Transaction Safety:**
   - The system uses database transactions
   - If seat creation fails, hall creation is rolled back
   - Ensures data consistency

---

## 🔍 Verify Created Seats

After creating a hall, you can verify the seats:

```bash
# Get all halls for a theater
GET /theater/:theaterId/halls

# Get seats for a specific hall
GET /api/bookings/seats/:hallId
```

---

## ✅ Features

- ✅ **Customizable rows** - Any number, any labels
- ✅ **Customizable seats per row** - Flexible capacity
- ✅ **VIP designation** - Premium front/middle seats
- ✅ **Recliner designation** - Luxury back seats
- ✅ **Auto capacity calculation** - Automatic if not specified
- ✅ **Transaction safety** - All-or-nothing creation
- ✅ **Bulk insert** - Efficient seat generation
- ✅ **Backward compatible** - Old API still works

---

## 🚀 Migration Guide

If you have existing halls without seats, you can add seats using:

```bash
POST /theater/halls/:hallId/seats
```

Or recreate the hall with the new seat configuration feature.

---

## 🎉 Summary

The customizable hall creation feature allows theater admins to:
1. Define custom row layouts
2. Specify seats per row
3. Designate VIP and recliner rows
4. Automatically generate all seats in one API call
5. Get accurate seat counts immediately

This makes theater setup faster and more flexible! 🎬
