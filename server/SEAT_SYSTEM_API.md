# Seat Management API - New Type-Based System

## Overview
The seat management system has been updated to use a simpler, type-based configuration approach. Instead of manually creating individual seats, you now specify counts for each seat type and the system auto-generates the seats with proper distribution.

## Seat Types
- **Normal**: Standard seating (formerly "basic")
- **Executive**: Premium comfort seating (formerly "recliner")
- **VIP**: Luxury experience seating

## Seat Distribution Logic
Seats are automatically distributed in this order:
1. **VIP seats** - Front rows (closest to screen)
2. **Executive seats** - Middle rows
3. **Normal seats** - Back rows

## API Endpoints

### 1. Create Hall with Auto-Generated Seats

**Endpoint**: `POST /theater/:theaterId/halls`

**Request Body**:
```json
{
  "name": "Main Hall",
  "capacity": 100,
  "seatConfiguration": {
    "totalSeats": 100,
    "seatsPerRow": 10,
    "normalSeats": 50,
    "executiveSeats": 30,
    "vipSeats": 20
  }
}
```

**Field Descriptions**:
- `name`: Hall name (required, 2-100 characters)
- `capacity`: Total capacity (optional, will be auto-calculated if not provided)
- `seatConfiguration`: Optional configuration for auto-generating seats
  - `totalSeats`: Total number of seats to create (required)
  - `seatsPerRow`: Number of seats per row (required)
  - `normalSeats`: Number of normal seats
  - `executiveSeats`: Number of executive seats
  - `vipSeats`: Number of VIP seats
  - **Note**: `normalSeats + executiveSeats + vipSeats` must equal `totalSeats`

**Response** (201 Created):
```json
{
  "id": 1,
  "theater_id": 1,
  "name": "Main Hall",
  "capacity": 100,
  "seat_count": 100
}
```

**Example Layout** (100 seats, 10 per row):
```
Row A: [VIP] [VIP] [VIP] [VIP] [VIP] [VIP] [VIP] [VIP] [VIP] [VIP]
Row B: [VIP] [VIP] [VIP] [VIP] [VIP] [VIP] [VIP] [VIP] [VIP] [VIP]
Row C: [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC]
Row D: [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC]
Row E: [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC] [EXEC]
Row F: [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM]
Row G: [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM]
Row H: [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM]
Row I: [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM]
Row J: [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM] [NORM]
```

---

### 2. Add Seats to Existing Hall

**Endpoint**: `POST /theater/halls/:hallId/seats`

**Request Body**:
```json
{
  "seatConfiguration": {
    "totalSeats": 150,
    "seatsPerRow": 15,
    "normalSeats": 75,
    "executiveSeats": 45,
    "vipSeats": 30
  }
}
```

**Response** (201 Created):
```json
{
  "msg": "Seats added successfully",
  "added": 150,
  "breakdown": {
    "total": 150,
    "normal": 75,
    "executive": 45,
    "vip": 30
  },
  "seats": [
    {
      "id": 1,
      "hall_id": 1,
      "row_label": "A",
      "seat_number": 1,
      "seat_type": "vip",
      "is_available": true
    },
    // ... more seats
  ]
}
```

---

## Validation Rules

### Seat Configuration Validation
- `totalSeats` must be a positive integer
- `seatsPerRow` must be a positive integer
- `normalSeats + executiveSeats + vipSeats` must equal `totalSeats`
- At least one seat type must have a count > 0

### Row Label Generation
- First 26 rows: A-Z
- Next 26 rows: AA-AZ
- Next 26 rows: BA-BZ
- And so on...

---

## Error Responses

### 400 Bad Request - Invalid Seat Configuration
```json
{
  "msg": "Sum of seat types (80) must equal totalSeats (100)"
}
```

### 400 Bad Request - Missing Required Fields
```json
{
  "msg": "seatConfiguration must include totalSeats and seatsPerRow"
}
```

### 403 Forbidden - Not Authorized
```json
{
  "msg": "Not authorized"
}
```

### 404 Not Found - Hall Not Found
```json
{
  "msg": "Hall not found"
}
```

---

## Migration from Old System

If you have existing seats with old types (`basic`, `recliner`), run the migration:

```bash
psql -U postgres -d FLIM_FLEX -f server/migrations/update_seat_types.sql
```

**Migration mapping**:
- `basic` → `normal`
- `recliner` → `executive`
- `vip` → `vip` (unchanged)

---

## Example Use Cases

### Small Theater (50 seats)
```json
{
  "totalSeats": 50,
  "seatsPerRow": 10,
  "normalSeats": 30,
  "executiveSeats": 15,
  "vipSeats": 5
}
```
Result: 5 rows, VIP in row A, Executive in row B, Normal in rows C-E

### Large Multiplex (300 seats)
```json
{
  "totalSeats": 300,
  "seatsPerRow": 20,
  "normalSeats": 180,
  "executiveSeats": 80,
  "vipSeats": 40
}
```
Result: 15 rows, VIP in rows A-B, Executive in rows C-F, Normal in rows G-O

### Premium Hall (All VIP)
```json
{
  "totalSeats": 40,
  "seatsPerRow": 8,
  "normalSeats": 0,
  "executiveSeats": 0,
  "vipSeats": 40
}
```
Result: 5 rows, all VIP seating

---

## Frontend Integration

### React Component Example
```jsx
const SeatConfiguration = () => {
  const [config, setConfig] = useState({
    totalSeats: 100,
    seatsPerRow: 10,
    normalSeats: 50,
    executiveSeats: 30,
    vipSeats: 20
  });

  const handleSubmit = async () => {
    const response = await fetch(`/theater/halls/${hallId}/seats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatConfiguration: config })
    });
    const data = await response.json();
    console.log(data.breakdown); // { total: 100, normal: 50, executive: 30, vip: 20 }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        value={config.totalSeats}
        onChange={(e) => setConfig({...config, totalSeats: +e.target.value})}
        placeholder="Total Seats"
      />
      <input 
        type="number" 
        value={config.seatsPerRow}
        onChange={(e) => setConfig({...config, seatsPerRow: +e.target.value})}
        placeholder="Seats per Row"
      />
      <input 
        type="number" 
        value={config.normalSeats}
        onChange={(e) => setConfig({...config, normalSeats: +e.target.value})}
        placeholder="Normal Seats"
      />
      <input 
        type="number" 
        value={config.executiveSeats}
        onChange={(e) => setConfig({...config, executiveSeats: +e.target.value})}
        placeholder="Executive Seats"
      />
      <input 
        type="number" 
        value={config.vipSeats}
        onChange={(e) => setConfig({...config, vipSeats: +e.target.value})}
        placeholder="VIP Seats"
      />
      <button type="submit">Create Seats</button>
    </form>
  );
};
```

---

## Testing with cURL

### Create hall with seats
```bash
curl -X POST http://localhost:3000/theater/1/halls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "IMAX Hall",
    "seatConfiguration": {
      "totalSeats": 120,
      "seatsPerRow": 12,
      "normalSeats": 60,
      "executiveSeats": 40,
      "vipSeats": 20
    }
  }'
```

### Add seats to existing hall
```bash
curl -X POST http://localhost:3000/theater/halls/1/seats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "seatConfiguration": {
      "totalSeats": 80,
      "seatsPerRow": 10,
      "normalSeats": 40,
      "executiveSeats": 25,
      "vipSeats": 15
    }
  }'
```

---

## Benefits of New System

✅ **Simpler**: Specify counts instead of individual seat coordinates
✅ **Faster**: Bulk insert with automatic row/seat numbering
✅ **Consistent**: Standard distribution pattern (VIP front, Normal back)
✅ **Flexible**: Easy to adjust seat type ratios
✅ **Validated**: Automatic validation ensures counts add up
✅ **Transaction-safe**: Uses database transactions for data integrity
