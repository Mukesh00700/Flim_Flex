import pool from "../config/db.js";
import { validateTheaterData, validateTheaterName } from '../utils/validation.js';


export const createTheater = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    
    // Validate theater data
    const validation = validateTheaterData({ name, city });
    if (!validation.isValid) {
      return res.status(400).json({ msg: "Validation failed", errors: validation.errors });
    }
    
    const adminId = req.user.role === "admin" ? req.user.id : null;

    const result = await pool.query(
      `INSERT INTO theaters (name, city, address, admin_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, city, address, adminId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getTheaters = async (req, res) => {
  try {
    let result;
    if (req.user.role === "admin") {
      result = await pool.query("SELECT * FROM theaters WHERE admin_id = $1", [req.user.id]);
    } else {
      result = await pool.query("SELECT * FROM theaters");
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const updateTheater = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, address } = req.body;

    // Validate theater data
    const validation = validateTheaterData({ name, city });
    if (!validation.isValid) {
      return res.status(400).json({ msg: "Validation failed", errors: validation.errors });
    }

    if (req.user.role === "admin") {
      const check = await pool.query("SELECT * FROM theaters WHERE id = $1 AND admin_id = $2", [id, req.user.id]);
      if (check.rowCount === 0) return res.status(403).json({ msg: "Not authorized" });
    }

    const result = await pool.query(
      `UPDATE theaters SET name=$1, city=$2, address=$3 WHERE id=$4 RETURNING *`,
      [name, city, address, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const deleteTheater = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === "admin") {
      const check = await pool.query("SELECT * FROM theaters WHERE id = $1 AND admin_id = $2", [id, req.user.id]);
      if (check.rowCount === 0) return res.status(403).json({ msg: "Not authorized" });
    }

    await pool.query("DELETE FROM theaters WHERE id = $1", [id]);
    res.json({ msg: "Theater deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Add seats to a hall (for a theater)
export const addSeatsToHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    const { seats } = req.body; // seats: array of { row_label, seat_number, seat_type }

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ msg: "Seats array required" });
    }

    // Build bulk insert query
    let values = [];
    let params = [];
    seats.forEach((s, i) => {
      values.push(`($1, $${i * 3 + 2}, $${i * 3 + 3}, $${i * 3 + 4})`);
      params.push(s.row_label, s.seat_number, s.seat_type || "basic");
    });
    const query = `INSERT INTO seats (hall_id, row_label, seat_number, seat_type) VALUES ${values.join(", ")} RETURNING *`;
    const result = await pool.query(query, [hallId, ...params]);
    res.status(201).json({ added: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get distinct cities where theaters exist
export const getCities = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT DISTINCT city FROM theaters WHERE city IS NOT NULL ORDER BY city`);
    res.status(200).json({ cities: rows.map(r => r.city) });
  } catch (err) {
    console.error('Error fetching cities:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new hall for a theater with customizable seats
export const createHall = async (req, res) => {
  const client = await pool.connect();
  try {
    const { theaterId } = req.params;
    const { name, capacity, seatConfiguration } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'Hall name is required' });
    }

    // Validate hall name
    const nameValidation = validateTheaterName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({ msg: nameValidation.message });
    }

    // Check if theater exists and user has permission
    if (req.user.role === "admin") {
      const theaterCheck = await client.query(
        "SELECT * FROM theaters WHERE id = $1 AND admin_id = $2",
        [theaterId, req.user.id]
      );
      if (theaterCheck.rowCount === 0) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
    }

    await client.query('BEGIN');

    // Create the hall
    const hallResult = await client.query(
      `INSERT INTO halls (theater_id, name, capacity)
       VALUES ($1, $2, $3) RETURNING *`,
      [theaterId, name, capacity || null]
    );

    const hall = hallResult.rows[0];

    // Generate seats if seatConfiguration is provided
    if (seatConfiguration) {
      const { rows, seatsPerRow, vipRows, reclinerRows } = seatConfiguration;

      if (!rows || !seatsPerRow) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          msg: 'seatConfiguration must include rows (array of row labels) and seatsPerRow (number)' 
        });
      }

      const vipRowSet = new Set(vipRows || []);
      const reclinerRowSet = new Set(reclinerRows || []);
      const seats = [];

      // Generate seats for each row
      for (const rowLabel of rows) {
        let seatType = 'basic';
        if (vipRowSet.has(rowLabel)) {
          seatType = 'vip';
        } else if (reclinerRowSet.has(rowLabel)) {
          seatType = 'recliner';
        }

        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
          seats.push([hall.id, rowLabel, seatNum, seatType]);
        }
      }

      // Bulk insert seats
      if (seats.length > 0) {
        const placeholders = seats.map((_, idx) => 
          `($${idx * 4 + 1}, $${idx * 4 + 2}, $${idx * 4 + 3}, $${idx * 4 + 4})`
        ).join(', ');
        
        const flatParams = seats.flat();
        await client.query(
          `INSERT INTO seats (hall_id, row_label, seat_number, seat_type) 
           VALUES ${placeholders}`,
          flatParams
        );

        // Update capacity if not provided
        if (!capacity) {
          await client.query(
            'UPDATE halls SET capacity = $1 WHERE id = $2',
            [seats.length, hall.id]
          );
          hall.capacity = seats.length;
        }
      }
    }

    await client.query('COMMIT');

    // Fetch seat count
    const seatCount = await client.query(
      'SELECT COUNT(*) as seat_count FROM seats WHERE hall_id = $1',
      [hall.id]
    );

    res.status(201).json({
      ...hall,
      seat_count: parseInt(seatCount.rows[0].seat_count)
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  } finally {
    client.release();
  }
};

// Get halls for a specific theater
export const getHallsByTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;

    const result = await pool.query(
      `SELECT h.id, h.name, h.capacity, h.theater_id, 
              COUNT(s.id) as seat_count
       FROM halls h
       LEFT JOIN seats s ON h.id = s.hall_id
       WHERE h.theater_id = $1
       GROUP BY h.id, h.name, h.capacity, h.theater_id
       ORDER BY h.name`,
      [theaterId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a hall
export const updateHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    const { name, capacity } = req.body;

    // Validate hall name if provided
    if (name) {
      const nameValidation = validateTheaterName(name);
      if (!nameValidation.isValid) {
        return res.status(400).json({ msg: nameValidation.message });
      }
    }

    // Check authorization
    if (req.user.role === "admin") {
      const hallCheck = await pool.query(
        `SELECT h.id FROM halls h
         JOIN theaters t ON h.theater_id = t.id
         WHERE h.id = $1 AND t.admin_id = $2`,
        [hallId, req.user.id]
      );
      if (hallCheck.rowCount === 0) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
    }

    const result = await pool.query(
      `UPDATE halls SET name = $1, capacity = $2 WHERE id = $3 RETURNING *`,
      [name, capacity || null, hallId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a hall
export const deleteHall = async (req, res) => {
  try {
    const { hallId } = req.params;

    // Check authorization
    if (req.user.role === "admin") {
      const hallCheck = await pool.query(
        `SELECT h.id FROM halls h
         JOIN theaters t ON h.theater_id = t.id
         WHERE h.id = $1 AND t.admin_id = $2`,
        [hallId, req.user.id]
      );
      if (hallCheck.rowCount === 0) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
    }

    await pool.query("DELETE FROM halls WHERE id = $1", [hallId]);
    res.json({ msg: "Hall deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
