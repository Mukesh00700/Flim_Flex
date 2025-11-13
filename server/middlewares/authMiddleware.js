import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import asyncHandler from "express-async-handler";
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Authenticate middleware
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch latest user details (important for role-based logic)
    const result = await pool.query(
      "SELECT id, email, role FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ msg: "User no longer exists" });
    }

    req.user = result.rows[0]; // { id, email, role }
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};


export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("No token, authorization denied");
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  console.log(decoded);
  const result = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = $1",
    [decoded.id]
  );

  if (result.rowCount === 0) {
    res.status(401);
    throw new Error("User associated with this token no longer exists");
  }

  req.user = result.rows[0];
  next();
});

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403); 
    throw new Error("Not authorized as an admin");
  }
};
