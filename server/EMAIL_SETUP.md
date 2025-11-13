# 📧 Email Verification Setup Guide

## Quick Start

### 1. Run Database Migration

```bash
cd server
node run-migration.js
```

This will add email verification fields to your database.

### 2. Configure Environment Variables

Add these to your `server/.env` file:

```env
# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password

# Client URL
CLIENT_URL=http://localhost:5174
```

### 3. Get Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)" → Name it "FilmFlex"
5. Copy the 16-character password
6. Paste it as `EMAIL_PASSWORD` in your `.env` file

### 4. Test the System

```bash
# Start server
npm run dev

# In another terminal, test registration
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your_test_email@gmail.com",
    "password": "password123"
  }'
```

Check your email inbox for the verification link!

---

## 📡 New API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/verify-email?token=...` | Verify email address |
| POST | `/auth/resend-verification` | Resend verification email |
| POST | `/auth/request-password-reset` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

---

## 🎨 Frontend Pages to Create

You need to create these pages in your React app:

1. **`/verify-email`** - Email verification page
2. **`/resend-verification`** - Resend verification form
3. **`/forgot-password`** - Request password reset form
4. **`/reset-password`** - Reset password form

---

## 📁 Files Added/Modified

### New Files
- ✅ `server/config/nodemailer.js` - Email configuration
- ✅ `server/migrations/add_email_verification.sql` - Database migration
- ✅ `server/run-migration.js` - Migration runner script
- ✅ `server/EMAIL_VERIFICATION.md` - Complete documentation
- ✅ `server/.env.example` - Environment variables template

### Modified Files
- ✅ `server/controllers/authControllers.js` - Added email verification logic
- ✅ `server/routes/authRoutes.js` - Added new endpoints

---

## 🔍 What Changed?

### Database
- Added `is_verified` column (users must verify email before login)
- Added `verification_token` and expiry columns
- Added `password_reset_token` and expiry columns
- Added indexes for faster lookups

### Registration Flow
1. User registers → Account created with `is_verified: false`
2. Verification email sent automatically
3. User clicks link in email
4. Account verified → `is_verified: true`
5. User can now log in

### Login Flow
1. User attempts login
2. System checks if `is_verified: true`
3. If not verified → Error: "Please verify your email"
4. If verified → Login successful

---

## 🚨 Important Notes

- **Gmail Users**: MUST use App Password (not regular password)
- **Verification Links**: Expire after 24 hours
- **Reset Links**: Expire after 1 hour
- **Existing Users**: Not affected (auto-verified or run SQL update)
- **Google OAuth**: Users are auto-verified (no email needed)

---

## 📖 Full Documentation

For complete documentation, see: `server/EMAIL_VERIFICATION.md`

Includes:
- Detailed setup instructions
- Email template customization
- Frontend integration examples
- Production deployment guide
- Troubleshooting tips
- Security best practices

---

## ✅ Checklist

- [ ] Run database migration: `node run-migration.js`
- [ ] Add EMAIL_USER to .env
- [ ] Add EMAIL_PASSWORD to .env (Gmail App Password)
- [ ] Add CLIENT_URL to .env
- [ ] Restart server
- [ ] Test registration (receive email)
- [ ] Test verification link
- [ ] Test login (before/after verification)
- [ ] Create frontend verification pages
- [ ] Update registration page to show verification message
- [ ] Update login page to handle unverified users

---

## 🆘 Quick Troubleshooting

**Problem**: Email not sending  
**Solution**: Check Gmail App Password is correct, 2FA is enabled

**Problem**: "Invalid credentials" when using Gmail  
**Solution**: You MUST use App Password, not regular password

**Problem**: Emails going to spam  
**Solution**: Normal for development. Use professional service in production

**Problem**: Token not found  
**Solution**: Token expired (24h). Use resend verification endpoint

---

## 💡 Next Steps

1. Run the migration: `node run-migration.js`
2. Configure `.env` with your Gmail credentials
3. Test the system with your own email
4. Create frontend pages for verification workflow
5. Update login/register pages to handle verification status
6. Consider using SendGrid or Mailgun for production

---

**Need Help?** Check `EMAIL_VERIFICATION.md` for detailed documentation!
