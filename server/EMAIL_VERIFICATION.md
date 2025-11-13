# Email Verification System Documentation

## 📧 Overview

FilmFlex now includes a complete email verification system using Nodemailer. This ensures that users provide valid email addresses during registration and adds an extra layer of security.

---

## 🎯 Features

- ✅ **Email Verification**: Send verification emails upon registration
- ✅ **Resend Verification**: Allow users to request new verification emails
- ✅ **Password Reset**: Send password reset links via email
- ✅ **Token Expiration**: Verification tokens expire after 24 hours, reset tokens after 1 hour
- ✅ **Beautiful HTML Emails**: Professional, responsive email templates
- ✅ **Secure**: Uses crypto for generating random tokens

---

## 🛠 Setup Instructions

### 1. Database Migration

Run the migration to add email verification fields to the users table:

```bash
# From the server directory
psql -U postgres -d filmflex -f migrations/add_email_verification.sql
```

Or manually run the SQL commands in your PostgreSQL client.

### 2. Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Client URL (for email links)
CLIENT_URL=http://localhost:5174
```

### 3. Gmail Setup (Recommended)

If using Gmail, you need to generate an App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not already enabled)
3. Security → App passwords: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)" → Name it "FilmFlex"
5. Copy the 16-character password
6. Use this as `EMAIL_PASSWORD` in your `.env` file

**Note**: Regular Gmail passwords won't work. You MUST use an App Password.

### 4. Alternative Email Services

#### Outlook
```env
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_outlook_password
```
Update `nodemailer.js`: Change `service: 'gmail'` to `service: 'outlook'`

#### Custom SMTP
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

---

## 📡 API Endpoints

### 1. Register User (Updated)
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "is_verified": false
  },
  "message": "Registration successful! Please check your email to verify your account."
}
```

**Email Sent**: Verification email with token

---

### 2. Login (Updated)
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (Verified User):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isVerified": true
  }
}
```

**Error Response (Unverified User):**
```json
{
  "msg": "Please verify your email before logging in. Check your inbox for the verification link.",
  "isVerified": false
}
```

---

### 3. Verify Email
**GET** `/auth/verify-email?token=VERIFICATION_TOKEN`

**Query Parameters:**
- `token`: The verification token from the email

**Success Response:**
```json
{
  "msg": "Email verified successfully! You can now log in.",
  "success": true
}
```

**Error Responses:**
```json
// Invalid token
{
  "msg": "Invalid verification token"
}

// Expired token
{
  "msg": "Verification token has expired. Please request a new one."
}

// Already verified
{
  "msg": "Email is already verified"
}
```

---

### 4. Resend Verification Email
**POST** `/auth/resend-verification`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response:**
```json
{
  "msg": "Verification email sent successfully! Please check your inbox.",
  "success": true
}
```

**Error Responses:**
```json
// User not found
{
  "msg": "User not found"
}

// Already verified
{
  "msg": "Email is already verified"
}
```

---

### 5. Request Password Reset
**POST** `/auth/request-password-reset`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "msg": "If an account exists with this email, a password reset link has been sent.",
  "success": true
}
```

**Note**: Returns same response whether user exists or not (security measure)

**Email Sent**: Password reset email with token

---

### 6. Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "token": "RESET_TOKEN_FROM_EMAIL",
  "newPassword": "newpassword123"
}
```

**Success Response:**
```json
{
  "msg": "Password reset successfully! You can now log in with your new password.",
  "success": true
}
```

**Error Responses:**
```json
// Invalid/expired token
{
  "msg": "Invalid or expired reset token"
}

// Token expired
{
  "msg": "Reset token has expired. Please request a new one."
}

// Weak password
{
  "msg": "Password must be at least 6 characters long"
}
```

---

## 🎨 Email Templates

### Verification Email Preview

```
╔══════════════════════════════════════╗
║        🎬 FilmFlex                   ║
╠══════════════════════════════════════╣
║                                      ║
║  Welcome, John Doe! 👋               ║
║                                      ║
║  Thank you for registering with      ║
║  FilmFlex. Please verify your email: ║
║                                      ║
║  ┌────────────────────────────────┐  ║
║  │   Verify Email Address         │  ║
║  └────────────────────────────────┘  ║
║                                      ║
║  Link expires in 24 hours            ║
║                                      ║
╚══════════════════════════════════════╝
```

### Password Reset Email Preview

```
╔══════════════════════════════════════╗
║        🎬 FilmFlex                   ║
╠══════════════════════════════════════╣
║                                      ║
║  Password Reset Request 🔒           ║
║                                      ║
║  Hi John Doe,                        ║
║                                      ║
║  We received a password reset        ║
║  request for your account.           ║
║                                      ║
║  ┌────────────────────────────────┐  ║
║  │   Reset Password               │  ║
║  └────────────────────────────────┘  ║
║                                      ║
║  Link expires in 1 hour              ║
║                                      ║
╚══════════════════════════════════════╝
```

---

## 📋 Database Schema Changes

### New Columns in `users` Table

```sql
is_verified                      BOOLEAN NOT NULL DEFAULT FALSE
verification_token               VARCHAR(255)
verification_token_expires       TIMESTAMPTZ
password_reset_token             VARCHAR(255)
password_reset_token_expires     TIMESTAMPTZ
```

### New Indexes

```sql
idx_users_verification_token     (verification_token)
idx_users_password_reset_token   (password_reset_token)
idx_users_email                  (email)
```

---

## 🔄 User Flow Diagrams

### Registration Flow

```
User Registration
      ↓
Generate Token
      ↓
Save User (is_verified: false)
      ↓
Send Verification Email
      ↓
User Receives Email
      ↓
Click Verification Link
      ↓
GET /auth/verify-email?token=...
      ↓
Update User (is_verified: true)
      ↓
User Can Now Login
```

### Login Flow (With Verification)

```
User Login Attempt
      ↓
Check Email & Password
      ↓
  Valid? ──No──→ Return Error
      ↓
     Yes
      ↓
Check is_verified
      ↓
  Verified? ──No──→ Return "Please verify email"
      ↓
     Yes
      ↓
Generate JWT Token
      ↓
Return Token & User Data
```

### Password Reset Flow

```
Forgot Password
      ↓
POST /auth/request-password-reset
      ↓
Generate Reset Token
      ↓
Send Reset Email
      ↓
User Clicks Reset Link
      ↓
User Enters New Password
      ↓
POST /auth/reset-password
      ↓
Validate Token & Expiration
      ↓
Hash & Update Password
      ↓
Clear Reset Token
      ↓
User Logs In With New Password
```

---

## 🧪 Testing

### Test Verification Email Manually

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# 2. Check your email inbox for verification link
# 3. Click the link or visit:
http://localhost:5174/verify-email?token=VERIFICATION_TOKEN

# 4. Try logging in before verification (should fail)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 5. Verify email, then login again (should succeed)
```

### Test Resend Verification

```bash
curl -X POST http://localhost:3000/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Test Password Reset

```bash
# 1. Request password reset
curl -X POST http://localhost:3000/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# 2. Check email for reset link
# 3. Reset password
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "RESET_TOKEN_FROM_EMAIL",
    "newPassword": "newpassword123"
  }'
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid credentials" when using Gmail

**Solution**: You must use an App Password, not your regular Gmail password.

1. Enable 2-Step Verification
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Use the 16-character App Password in `.env`

---

### Issue 2: "Email transporter error"

**Solution**: Check your credentials and service configuration.

```bash
# Test email configuration
node -e "import('./config/nodemailer.js')"
```

Look for the ✅ or ❌ message in console.

---

### Issue 3: Emails going to spam

**Solution**: 
1. Use a professional email service (SendGrid, Mailgun)
2. Set up SPF, DKIM, and DMARC records
3. Use a custom domain email
4. Ask users to whitelist your email

---

### Issue 4: Verification token not found

**Solution**: Token might have expired (24 hours). Use resend verification endpoint.

---

### Issue 5: Cannot auto-verify existing users

**Solution**: Run this SQL to verify all existing users:

```sql
UPDATE users SET is_verified = TRUE WHERE is_verified = FALSE;
```

---

## 🔒 Security Best Practices

1. **Token Generation**: Using `crypto.randomBytes(32)` for secure random tokens
2. **Token Expiration**: Verification tokens expire in 24h, reset tokens in 1h
3. **One-Time Use**: Tokens are cleared after successful verification/reset
4. **Email Privacy**: Password reset doesn't reveal if email exists
5. **HTTPS Required**: Use HTTPS in production for secure email links
6. **Rate Limiting**: Consider adding rate limiting to prevent email spam

---

## 🎯 Frontend Integration

### Client-Side Route Structure

Create these pages in your React app:

1. **`/verify-email`** - Verification page
2. **`/resend-verification`** - Resend verification page
3. **`/forgot-password`** - Request reset page
4. **`/reset-password`** - Reset password page

### Example: Verification Page Component

```jsx
// client/src/pages/VerifyEmailPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/auth/verify-email?token=${token}`
        );
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.msg);
          setTimeout(() => navigate('/loginUser'), 3000);
        } else {
          setStatus('error');
          setMessage(data.msg);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        {status === 'verifying' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Verifying your email...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
            <p className="text-gray-300">{message}</p>
            <p className="text-sm text-gray-400 mt-4">Redirecting to login...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-gray-300 mb-4">{message}</p>
            <button
              onClick={() => navigate('/resend-verification')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Resend Verification Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
```

### Add Route to App.jsx

```jsx
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResendVerificationPage from './pages/ResendVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// In your Routes
<Route path="/verify-email" element={<VerifyEmailPage />} />
<Route path="/resend-verification" element={<ResendVerificationPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
```

---

## 📊 Monitoring & Logs

The system logs important events:

```
✅ Email server is ready to send messages
✅ Verification email sent to john@example.com
✅ Verification email sent: <message-id>
❌ Email transporter error: [error details]
❌ Failed to send verification email: [error]
```

Monitor these logs to ensure email delivery is working correctly.

---

## 🚀 Production Deployment

### Recommended Email Services

1. **SendGrid** (12,000 free emails/month)
2. **Mailgun** (5,000 free emails/month)
3. **AWS SES** (Pay-as-you-go, very cheap)
4. **Postmark** (Professional, reliable)

### SendGrid Setup Example

```javascript
// config/nodemailer.js
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

---

## 📝 Checklist

Before going live:

- [ ] Database migration completed
- [ ] Environment variables configured
- [ ] Email service working (test emails received)
- [ ] Frontend pages created (verify, reset password)
- [ ] Email templates customized with your branding
- [ ] HTTPS enabled for production
- [ ] Verification links point to production CLIENT_URL
- [ ] Rate limiting implemented
- [ ] Monitoring/logging configured
- [ ] Error handling tested
- [ ] Email deliverability tested (not going to spam)

---

## 📚 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [SendGrid Integration](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
- [Email Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Last Updated**: November 13, 2025  
**Version**: 1.0.0  
**Maintained By**: FilmFlex Development Team
