import express from 'express';
import pool from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import theaterRoutes from "./routes/theaterRoutes.js";
import movieRoutes from "./routes/movieRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import ticketBookingRoutes from "./routes/ticketBookingRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());
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
    app.use("/auth", authRoutes);
}catch(e){
    console.log("Couldn't connect to auth route");
}
try{
    console.log("loading theater route");
    app.use("/theater", theaterRoutes);
}catch(e){
    console.log("Couldn't connect to auth route");
}
try{
    console.log("loading movies route");
    app.use("/movies", movieRoutes);
}catch(e){
    console.log("Couldn't connect to auth route");
}
try{
    console.log("loading user route");
    app.use("/user", userRoutes);
}catch(e){
    console.log("Couldn't connect to auth route");
}
try{
    console.log("loading ticket booking route");
    app.use("/api/bookings", ticketBookingRoutes);
}catch(e){
    console.log("Couldn't connect to ticket booking route", e);
}
try{
    console.log("loading price route");
    app.use("/api/prices", priceRoutes);
}catch(e){
    console.log("Couldn't connect to price route", e);
}
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});