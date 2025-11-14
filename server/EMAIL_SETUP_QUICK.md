# 📧 Quick Email Setup Guide for OTP Verification

## ⚠️ IMPORTANT: You need to configure email to receive OTP codes!

---

## 🚀 Quick Setup (5 minutes)

### Option 1: Gmail (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Under "Signing in to Google", click **2-Step Verification**
4. Click **Get Started** and follow the prompts
5. Complete the setup

#### Step 2: Generate App Password
1. Go back to: https://myaccount.google.com/security
2. Under "Signing in to Google", click **2-Step Verification**
3. Scroll down and click **App passwords**
4. In the dropdown:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Type: `FilmFlex Server`
5. Click **Generate**
6. You'll see a 16-character password like: `abcd efgh ijkl mnop`
7. **COPY THIS PASSWORD** (you won't see it again!)

#### Step 3: Update .env File
Open `server/.env` and update:

```env
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Note:** Remove all spaces from the password!

#### Step 4: Restart Server
```bash
# Stop your server (Ctrl+C)
# Then restart:
npm run dev
```

You should see:
```
✅ Email server is ready to send messages
```

---

## 🧪 Test Your Setup

### Test 1: Register a New User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your_real_email@gmail.com",
    "password": "TestPass123!"
  }'
```

### Test 2: Check Email
- Check your inbox for an email from FilmFlex
- You should receive a 6-digit OTP
- Email subject: "Verify Your Email - FilmFlex"

### Test 3: Check Server Logs
Look for:
```
✅ Verification OTP sent to your_email@gmail.com
✅ Verification OTP email sent: <message_id>
```

---

## ❌ Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution:** You're using your regular Gmail password instead of App Password.
- Go back to Step 2 and generate an App Password
- Use the 16-character App Password, not your Gmail password

---

### Error: "Connection timeout" or "ECONNREFUSED"

**Solution:** Gmail SMTP might be blocked by firewall/antivirus
- Check your firewall settings
- Try disabling antivirus temporarily
- Make sure you have internet connection

---

### Error: "self signed certificate in certificate chain"

**Solution:** SSL certificate issue (rare)
Add to `nodemailer.js`:
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: '...', pass: '...' },
  tls: { rejectUnauthorized: false } // Add this line
});
```

---

### Email goes to Spam folder

**Solution:**
1. Check your spam/junk folder
2. Mark the email as "Not Spam"
3. Add your email address to contacts
4. Future emails should arrive in inbox

---

### No email received at all

**Checklist:**
- [ ] `.env` file exists in `server/` directory
- [ ] `EMAIL_USER` is your actual Gmail address
- [ ] `EMAIL_PASSWORD` is the 16-character App Password
- [ ] Server restarted after changing `.env`
- [ ] Server logs show "✅ Email server is ready"
- [ ] Server logs show "✅ Verification OTP sent"
- [ ] Check spam folder
- [ ] Try with a different email address

---

## 📝 Current Configuration Status

Check your `.env` file:
```bash
cd server
cat .env | Select-String "EMAIL"
```

Should show:
```
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

If you see:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
```

👆 **These are placeholders! You need to replace them with real values.**

---

## 🔐 Security Notes

1. **Never commit `.env` to git**
   - `.env` is already in `.gitignore`
   - Contains sensitive credentials

2. **Use App Password, not regular password**
   - More secure
   - Can be revoked without changing Gmail password

3. **Keep `JWT_SECRET` and `ADMIN_SECRET` secure**
   - Change the default values in production

---

## 🎯 Quick Test Command

After setup, test with this complete flow:

```bash
# 1. Register (replace with your real email)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "YOUR_REAL_EMAIL@gmail.com",
    "password": "TestPass123!"
  }'

# 2. Check your email for OTP (6 digits)

# 3. Verify with OTP (replace 123456 with actual OTP)
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "YOUR_REAL_EMAIL@gmail.com",
    "otp": "123456"
  }'

# 4. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "YOUR_REAL_EMAIL@gmail.com",
    "password": "TestPass123!"
  }'
```

---

## 🆘 Still Not Working?

1. **Check server console** for error messages
2. **Verify email settings** are correct in `.env`
3. **Restart server** after any `.env` changes
4. **Try a different Gmail account** to rule out account-specific issues
5. **Check nodemailer docs**: https://nodemailer.com/

---

## ✅ Success Indicators

When everything is working:

**Server logs:**
```
✅ Email server is ready to send messages
Connection successful! Time: 2025-11-14...
✅ Verification OTP sent to user@example.com
✅ Verification OTP email sent: <1234567890.123456@smtp.gmail.com>
```

**Email received:**
- Subject: "Verify Your Email - FilmFlex"
- Contains 6-digit OTP in large font
- From: Your configured email address

**Registration response:**
```json
{
  "message": "Registration successful! Please check your email...",
  "email": "user@example.com",
  "requiresVerification": true
}
```

---

## 🚀 You're Ready!

Once you see the success indicators above, your email system is working!

Need help? Check the server console for detailed error messages.
