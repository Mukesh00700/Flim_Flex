import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../config/nodemailer.js';
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role,name:user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};




export const registerCustomerController = async (req, res) => {
  try {
    if(!req.body) return res.status(400).json({msg:"All fields are required"});
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({msg:"Must fill all the fields"});
    
    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role, verification_otp, verification_otp_expires, is_verified)
       VALUES ($1, $2, $3, 'customer', $4, $5, false)
       RETURNING id, name, email, role, is_verified`,
      [name, email, hashedPassword, verificationOTP, otpExpires]
    );

    // Send verification email with OTP
    try {
      await sendVerificationEmail(email, name, verificationOTP);
      console.log(`✅ Verification OTP sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError);
      // Continue registration even if email fails
    }

    const token = generateToken(newUser.rows[0]);

    return res.status(201).json({ 
      token, 
      user: newUser.rows[0],
      message: "Registration successful! Please check your email to verify your account."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};




export const registerAdminController = async (req, res) => {
  try {
    const { name, email, password, adminSecretKey } = req.body;

    
    console.log(adminSecretKey,process.env.ADMIN_SECRET);
    if (adminSecretKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ msg: "Unauthorized to register as admin" });
    }

    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id, name, email, role`,
      [name, email, hashedPassword,admin]
    );

    const token = generateToken(newAdmin.rows[0]);

    res.status(201).json({ token, user: newAdmin.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};




export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = userQuery.rows[0];
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({ 
        msg: "Please verify your email before logging in. Check your inbox for the verification OTP.",
        isVerified: false,
        email: user.email
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};




const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { sub, email, name, picture } = ticket.getPayload();

        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const existingUser = userQuery.rows[0];

        let userForToken;
        let statusCode;

        if (existingUser) {

            console.log(`Existing user logged in: ${existingUser.email}`);
            userForToken = existingUser;
            statusCode = 200; 
        } else {
            console.log(`Creating new user for: ${email}`);
            const newUserQuery = await pool.query(
                `INSERT INTO users (name, email, google_id, role)
                 VALUES ($1, $2, $3, 'customer')
                 RETURNING id, name, email, role`,
                [name, email, sub]
            );
            userForToken = newUserQuery.rows[0];
            statusCode = 201; 
        }

        const appToken = generateToken({
            id: userForToken.id,
            role: "customer"
        });

        return res.status(statusCode).json({
            token: appToken,
            user: userForToken
        });

    } catch (err) {
        console.error(`Google authentication error: ${err}`);
        return res.status(500).json({ msg: "Google Authentication failed" });
    }
};

/**
 * Verify Email with OTP
 */
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    // Find user with this email
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = userQuery.rows[0];

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check if already verified
    if (user.is_verified) {
      return res.status(200).json({ msg: "Email is already verified" });
    }

    // Check if OTP matches
    if (user.verification_otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (new Date() > new Date(user.verification_otp_expires)) {
      return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
    }

    // Update user as verified
    await pool.query(
      "UPDATE users SET is_verified = true, verification_otp = NULL, verification_otp_expires = NULL WHERE id = $1",
      [user.id]
    );

    res.status(200).json({ 
      msg: "Email verified successfully! You can now log in.",
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Resend Verification OTP
 */
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userQuery.rows[0];

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ msg: "Email is already verified" });
    }

    // Generate new 6-digit OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await pool.query(
      "UPDATE users SET verification_otp = $1, verification_otp_expires = $2 WHERE id = $3",
      [verificationOTP, otpExpires, user.id]
    );

    // Send verification email with OTP
    await sendVerificationEmail(email, user.name, verificationOTP);

    res.status(200).json({ 
      msg: "Verification OTP sent successfully! Please check your inbox.",
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Request Password Reset
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userQuery.rows[0];

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        msg: "If an account exists with this email, a password reset link has been sent.",
        success: true
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await pool.query(
      "UPDATE users SET password_reset_token = $1, password_reset_token_expires = $2 WHERE id = $3",
      [resetToken, resetTokenExpires, user.id]
    );

    // Send password reset email
    await sendPasswordResetEmail(email, user.name, resetToken);

    res.status(200).json({ 
      msg: "If an account exists with this email, a password reset link has been sent.",
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    }

    // Find user with this reset token
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE password_reset_token = $1",
      [token]
    );

    const user = userQuery.rows[0];

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    // Check if token is expired
    if (new Date() > new Date(user.password_reset_token_expires)) {
      return res.status(400).json({ msg: "Reset token has expired. Please request a new one." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await pool.query(
      "UPDATE users SET password = $1, password_reset_token = NULL, password_reset_token_expires = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    res.status(200).json({ 
      msg: "Password reset successfully! You can now log in with your new password.",
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};