import pool from "../config/db.js";

// ✅ Get all prices for a show
export const getPricesForShow = async (req, res) => {
  try {
    const { showId } = req.params;

    const result = await pool.query(
      `SELECT id, show_id, seat_type, price FROM prices WHERE show_id = $1 ORDER BY seat_type`,
      [showId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Create/Update price for a show and seat type
export const upsertPrice = async (req, res) => {
  try {
    const { showId, seatType, price } = req.body;

    if (!showId || !seatType || price === undefined) {
      return res.status(400).json({ msg: "showId, seatType, and price are required" });
    }

    // Check if price exists
    const existing = await pool.query(
      `SELECT id FROM prices WHERE show_id = $1 AND seat_type = $2`,
      [showId, seatType]
    );

    let result;
    if (existing.rowCount > 0) {
      // Update
      result = await pool.query(
        `UPDATE prices SET price = $1 WHERE show_id = $2 AND seat_type = $3 RETURNING *`,
        [price, showId, seatType]
      );
    } else {
      // Insert
      result = await pool.query(
        `INSERT INTO prices (show_id, seat_type, price) VALUES ($1, $2, $3) RETURNING *`,
        [showId, seatType, price]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Set prices for multiple seat types in one show
export const setPricesForShow = async (req, res) => {
  try {
    const { showId, prices } = req.body; // prices: [{ seatType: 'basic', price: 250 }, ...]

    if (!showId || !Array.isArray(prices) || prices.length === 0) {
      return res.status(400).json({ msg: "showId and prices array are required" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Delete existing prices for this show
      await client.query("DELETE FROM prices WHERE show_id = $1", [showId]);

      // Insert new prices
      const results = [];
      for (const { seatType, price } of prices) {
        const result = await client.query(
          `INSERT INTO prices (show_id, seat_type, price) VALUES ($1, $2, $3) RETURNING *`,
          [showId, seatType, price]
        );
        results.push(result.rows[0]);
      }

      await client.query("COMMIT");
      res.status(201).json({ msg: "Prices set successfully", prices: results });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Delete a price
export const deletePrice = async (req, res) => {
  try {
    const { priceId } = req.params;

    const result = await pool.query("DELETE FROM prices WHERE id = $1 RETURNING *", [priceId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "Price not found" });
    }

    res.json({ msg: "Price deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Get all shows that need pricing
export const getShowsForPricing = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.show_time, m.title as movie_title, h.name as hall_name, 
              t.name as theater_name, COUNT(DISTINCT p.id) as price_count
       FROM shows s
       JOIN movies m ON s.movie_id = m.id
       JOIN halls h ON s.hall_id = h.id
       JOIN theaters t ON h.theater_id = t.id
       LEFT JOIN prices p ON s.id = p.show_id
       GROUP BY s.id, s.show_time, m.title, h.name, t.name
       ORDER BY s.show_time DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
