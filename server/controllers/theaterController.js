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

// Add seats to a hall with configurable seat types
export const addSeatsToHall = async (req, res) => {
  const client = await pool.connect();
  try {
    const { hallId } = req.params;
    const { seatConfiguration } = req.body;

    if (!seatConfiguration) {
      return res.status(400).json({ 
        msg: "Seat configuration is required",
        example: {
          seatConfiguration: {
            totalSeats: 100,
            seatsPerRow: 10,
            normalSeats: 50,
            executiveSeats: 30,
            vipSeats: 20
          }
        }
      });
    }

    const { totalSeats, seatsPerRow, normalSeats, executiveSeats, vipSeats } = seatConfiguration;

    // Validation
    if (!totalSeats || !seatsPerRow) {
      return res.status(400).json({ msg: "totalSeats and seatsPerRow are required" });
    }

    const typeSum = (normalSeats || 0) + (executiveSeats || 0) + (vipSeats || 0);
    if (typeSum !== totalSeats) {
      return res.status(400).json({ 
        msg: "Sum of seat types must equal total seats",
        provided: { normalSeats, executiveSeats, vipSeats, sum: typeSum },
        expected: totalSeats
      });
    }

    // Check if hall exists and user has permission
    if (req.user.role === "admin") {
      const hallCheck = await client.query(
        `SELECT h.id FROM halls h
         JOIN theaters t ON h.theater_id = t.id
         WHERE h.id = $1 AND t.admin_id = $2`,
        [hallId, req.user.id]
      );
      if (hallCheck.rowCount === 0) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
    }

    await client.query('BEGIN');

    // Update hall with default prices if provided
    const { defaultPrices } = req.body;
    if (defaultPrices) {
      await client.query(
        `UPDATE halls 
         SET default_basic_price = $1, 
             default_recliner_price = $2, 
             default_vip_price = $3
         WHERE id = $4`,
        [
          defaultPrices.basicPrice || 200,
          defaultPrices.reclinerPrice || 350,
          defaultPrices.vipPrice || 500,
          hallId
        ]
      );
    }

    // Generate seats with proper distribution
    const seats = [];
    const rows = Math.ceil(totalSeats / seatsPerRow);
    const rowLabels = [];
    
    // Generate row labels (A-Z, then AA-AZ, etc.)
    for (let i = 0; i < rows; i++) {
      if (i < 26) {
        rowLabels.push(String.fromCharCode(65 + i)); // A-Z
      } else {
        const first = String.fromCharCode(65 + Math.floor(i / 26) - 1);
        const second = String.fromCharCode(65 + (i % 26));
        rowLabels.push(first + second); // AA, AB, etc.
      }
    }

    let seatCounter = 0;
    let basicRemaining = basicSeats || 0;
    let reclinerRemaining = reclinerSeats || 0;
    let vipRemaining = vipSeats || 0;

    // Distribute seats: VIP at front, Recliner in middle, Basic at back
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const rowLabel = rowLabels[rowIndex];
      const seatsInThisRow = Math.min(seatsPerRow, totalSeats - seatCounter);

      for (let seatNum = 1; seatNum <= seatsInThisRow; seatNum++) {
        let seatType = 'basic';
        
        // Assign seat type based on remaining counts
        if (vipRemaining > 0) {
          seatType = 'vip';
          vipRemaining--;
        } else if (reclinerRemaining > 0) {
          seatType = 'recliner';
          reclinerRemaining--;
        } else if (basicRemaining > 0) {
          seatType = 'basic';
          basicRemaining--;
        }

        seats.push([hallId, rowLabel, seatNum, seatType]);
        seatCounter++;
      }
    }

    // Bulk insert seats
    if (seats.length > 0) {
      const placeholders = seats.map((_, idx) => 
        `($${idx * 4 + 1}, $${idx * 4 + 2}, $${idx * 4 + 3}, $${idx * 4 + 4})`
      ).join(', ');
      
      const flatParams = seats.flat();
      const result = await client.query(
        `INSERT INTO seats (hall_id, row_label, seat_number, seat_type) 
         VALUES ${placeholders} RETURNING *`,
        flatParams
      );

      // Update hall capacity
      await client.query(
        'UPDATE halls SET capacity = capacity + $1 WHERE id = $2',
        [seats.length, hallId]
      );

      await client.query('COMMIT');

      res.status(201).json({ 
        msg: 'Seats added successfully',
        added: result.rows.length,
        breakdown: {
          total: result.rows.length,
          normal: normalSeats || 0,
          executive: executiveSeats || 0,
          vip: vipSeats || 0
        },
        seats: result.rows
      });
    } else {
      await client.query('ROLLBACK');
      res.status(400).json({ msg: 'No seats to add' });
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  } finally {
    client.release();
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
      const { totalSeats, seatsPerRow, basicSeats, reclinerSeats, vipSeats } = seatConfiguration;

      if (!totalSeats || !seatsPerRow) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          msg: 'seatConfiguration must include totalSeats and seatsPerRow' 
        });
      }

      // Validate seat type counts sum to totalSeats
      const basicCount = basicSeats || 0;
      const reclinerCount = reclinerSeats || 0;
      const vipCount = vipSeats || 0;
      const sumOfTypes = basicCount + reclinerCount + vipCount;

      if (sumOfTypes !== totalSeats) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          msg: `Sum of seat types (${sumOfTypes}) must equal totalSeats (${totalSeats})`
        });
      }

      const seats = [];
      const rows = Math.ceil(totalSeats / seatsPerRow);
      const rowLabels = [];
      
      // Generate row labels (A-Z, then AA-AZ, etc.)
      for (let i = 0; i < rows; i++) {
        if (i < 26) {
          rowLabels.push(String.fromCharCode(65 + i));
        } else {
          const first = String.fromCharCode(65 + Math.floor(i / 26) - 1);
          const second = String.fromCharCode(65 + (i % 26));
          rowLabels.push(first + second);
        }
      }

      let seatCounter = 0;
      let basicRemaining = basicCount;
      let reclinerRemaining = reclinerCount;
      let vipRemaining = vipCount;

      // Distribute seats: VIP at front, Recliner in middle, Basic at back
      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const rowLabel = rowLabels[rowIndex];
        const seatsInThisRow = Math.min(seatsPerRow, totalSeats - seatCounter);

        for (let seatNum = 1; seatNum <= seatsInThisRow; seatNum++) {
          let seatType = 'basic';
          
          if (vipRemaining > 0) {
            seatType = 'vip';
            vipRemaining--;
          } else if (reclinerRemaining > 0) {
            seatType = 'recliner';
            reclinerRemaining--;
          } else if (basicRemaining > 0) {
            seatType = 'basic';
            basicRemaining--;
          }

          seats.push([hall.id, rowLabel, seatNum, seatType]);
          seatCounter++;
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

        // Update capacity
        await client.query(
          'UPDATE halls SET capacity = $1 WHERE id = $2',
          [seats.length, hall.id]
        );
        hall.capacity = seats.length;
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
