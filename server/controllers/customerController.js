import pool from '../config/db.js'; 

export const getAllUsers = async (req, res) => {
  const { search = '', role = 'all' } = req.query;
  
  try {
    let query = 'SELECT id, name, email, role, created_at FROM users';
    const values = [];
    const whereClauses = [];
    let paramIndex = 1;

    if (search) {
      whereClauses.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (role !== 'all') {
      whereClauses.push(`role = $${paramIndex}`);
      values.push(role);
      paramIndex++;
    }
    
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(query, values);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
export const getRecentCustomersByTheater = async (req, res) => {
  const adminId = req.user.id; 

  try {
    const query = `
      SELECT
        u.id as user_id,
        u.name,
        u.email,
        b.booking_time,
        m.title as movie_title,
        h.name as hall_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN shows s ON b.show_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN halls h ON s.hall_id = h.id
      JOIN theaters t ON h.theater_id = t.id
      WHERE t.admin_id = $1 AND b.payment_status = 'paid'
      ORDER BY b.booking_time DESC
      LIMIT 10;
    `;
    
    const { rows } = await pool.query(query, [adminId]);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error fetching recent customers:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};