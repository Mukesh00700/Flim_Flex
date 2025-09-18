import pool from "../config/db.js";

// Create theater (admin or super_admin)
export const createTheater = async (req, res) => {
  try {
    const { name, city, address } = req.body;
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

// Get all theaters (customers see all, admin sees only theirs)
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

// Update theater (only owner admin or super_admin)
export const updateTheater = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, address } = req.body;

    // If admin, ensure ownership
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

// Delete theater
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
