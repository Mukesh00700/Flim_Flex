import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

/**
 * Send verification email with OTP
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} verificationOTP - 6-digit OTP
 */
export const sendVerificationEmail = async (email, name, verificationOTP) => {
  const mailOptions = {
    from: `"FilmFlex" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - FilmFlex',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #3b82f6;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .otp-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            margin: 30px 0;
            font-family: 'Courier New', monospace;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
          .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            margin: 15px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 FilmFlex</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${name}! 👋</h2>
            <p>Thank you for registering with FilmFlex. We're excited to have you on board!</p>
            <p>To complete your registration and start booking your favorite movies, please use the following One-Time Password (OTP):</p>
            
            <div class="otp-box">
              ${verificationOTP}
            </div>

            <div class="warning">
              <strong>⏰ Important:</strong> This OTP will expire in <strong>10 minutes</strong>.
            </div>

            <p><strong>How to verify:</strong></p>
            <ol>
              <li>Go to the email verification page</li>
              <li>Enter your email address</li>
              <li>Enter the OTP shown above</li>
              <li>Click "Verify"</li>
            </ol>
            
            <p style="color: #dc2626; font-weight: bold;">🔒 Security Note:</p>
            <ul>
              <li>Never share this OTP with anyone</li>
              <li>FilmFlex will never ask for your OTP via phone or email</li>
              <li>If you didn't create an account, please ignore this email</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2025 FilmFlex. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST, 'EMAIL_PORT:', process.env.EMAIL_PORT, 'EMAIL_USER:', !!process.env.EMAIL_USER);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} resetToken - Password reset token
 */
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"FilmFlex" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password - FilmFlex',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #3b82f6;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #ef4444;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background-color: #dc2626;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
          .token {
            background-color: #f3f4f6;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            word-break: break-all;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 FilmFlex</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request 🔒</h2>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password for your FilmFlex account.</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>

            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <div class="token">${resetUrl}</div>

            <p><strong>Note:</strong> This reset link will expire in 1 hour.</p>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>© 2025 FilmFlex. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send ticket email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} ticketHTML - HTML content of the ticket
 * @param {string} ticketId - Ticket ID for subject line
 */
export const sendTicketEmail = async (email, name, ticketHTML, ticketId) => {
  const mailOptions = {
    from: `"FilmFlex" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎬 Your Movie Ticket - ${ticketId}`,
    html: ticketHTML,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Ticket email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending ticket email:', error);
    throw error;
  }
};

export default transporter;
