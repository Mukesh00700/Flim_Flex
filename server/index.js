import express from 'express';
import pool from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
const app = express();
const PORT = 3000;

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

try{
    console.log("loading auth route");
    app.use("/api/auth", authRoutes);
}catch(e){
    console.log("Couldn't connect to auth route");
}
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});