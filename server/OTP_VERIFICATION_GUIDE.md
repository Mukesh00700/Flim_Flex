# 🔐 OTP-Based Email Verification API Guide

## ✅ Changes Made

The email verification system has been updated to use **6-digit OTP** instead of verification links.

### Key Changes:
- ✅ Database now stores `verification_otp` (6-digit code) instead of long tokens
- ✅ OTP expires in **10 minutes** (instead of 24 hours)
- ✅ Verification endpoint changed from GET to POST
- ✅ Email contains prominent OTP code instead of verification link
- ✅ More secure and user-friendly

---

## 📡 Updated API Endpoints

### 1. Register Customer (Sends OTP)

**Endpoint:** `POST /auth/register`

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

**What Happens:**
- User receives email with 6-digit OTP
- OTP valid for 10 minutes
- User cannot login until verified

---

### 2. Verify Email with OTP ⭐ NEW

**Endpoint:** `POST /auth/verify-email`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response:**
```json
{
  "msg": "Email verified successfully! You can now log in.",
  "success": true
}
```

**Error Responses:**

**Invalid OTP:**
```json
{
  "msg": "Invalid OTP"
}
```

**Expired OTP:**
```json
{
  "msg": "OTP has expired. Please request a new one."
}
```

**Already Verified:**
```json
{
  "msg": "Email is already verified"
}
```

---

### 3. Resend Verification OTP

**Endpoint:** `POST /auth/resend-verification`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "msg": "Verification OTP sent successfully! Please check your inbox.",
  "success": true
}
```

**What Happens:**
- Generates new 6-digit OTP
- Invalidates previous OTP
- Sends new email with OTP
- New OTP valid for 10 minutes

---

### 4. Login (Checks Verification Status)

**Endpoint:** `POST /auth/login`

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
  "msg": "Please verify your email before logging in. Check your inbox for the verification OTP.",
  "isVerified": false,
  "email": "john@example.com"
}
```

---

## 🧪 Complete Testing Workflow

### Scenario 1: New User Registration & Verification

```bash
# Step 1: Register new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Response: User created, OTP sent to email
# Check email for 6-digit OTP (e.g., 456789)

# Step 2: Verify email with OTP
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "456789"
  }'

# Response: Email verified successfully!

# Step 3: Login (now allowed)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Response: Login successful with token
```

---

### Scenario 2: OTP Expired - Resend

```bash
# Step 1: Try to verify with expired OTP
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'

# Response: OTP has expired. Please request a new one.

# Step 2: Request new OTP
curl -X POST http://localhost:3000/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Response: Verification OTP sent successfully!
# Check email for new OTP

# Step 3: Verify with new OTP
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "789012"
  }'

# Response: Email verified successfully!
```

---

### Scenario 3: Unverified User Tries to Login

```bash
# Step 1: Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unverified User",
    "email": "unverified@example.com",
    "password": "password123"
  }'

# Step 2: Try to login WITHOUT verifying
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "unverified@example.com",
    "password": "password123"
  }'

# Response: 403 Forbidden
# {
#   "msg": "Please verify your email before logging in...",
#   "isVerified": false,
#   "email": "unverified@example.com"
# }
```

---

## 📧 Email Format

Users will receive an email like this:

```
Subject: Verify Your Email - FilmFlex

Welcome, John Doe! 👋

To complete your registration, please use the following One-Time Password (OTP):

┌─────────────────┐
│   4 5 6 7 8 9   │
└─────────────────┘

⏰ Important: This OTP will expire in 10 minutes.

How to verify:
1. Go to the email verification page
2. Enter your email address
3. Enter the OTP shown above
4. Click "Verify"

🔒 Security Note:
• Never share this OTP with anyone
• FilmFlex will never ask for your OTP via phone or email
• If you didn't create an account, please ignore this email
```

---

## 🗄️ Database Schema Changes

The migration file has been updated:

**Old columns (removed):**
- `verification_token VARCHAR(255)`
- `verification_token_expires TIMESTAMPTZ`

**New columns (added):**
- `verification_otp VARCHAR(6)` - Stores 6-digit OTP
- `verification_otp_expires TIMESTAMPTZ` - OTP expiration (10 minutes)

**To apply changes:**
```bash
# If you already ran the old migration, you need to alter the table:
psql -U postgres -d FLIM_FLEX -c "
  ALTER TABLE users DROP COLUMN IF EXISTS verification_token;
  ALTER TABLE users DROP COLUMN IF EXISTS verification_token_expires;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_otp VARCHAR(6);
  ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_otp_expires TIMESTAMPTZ;
  DROP INDEX IF EXISTS idx_users_verification_token;
  CREATE INDEX IF NOT EXISTS idx_users_verification_otp ON users(verification_otp);
"

# Or run the updated migration file:
psql -U postgres -d FLIM_FLEX -f migrations/add_email_verification.sql
```

---

## 🎯 Frontend Implementation Guide

### Registration Page

```javascript
// After successful registration
const handleRegister = async (formData) => {
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Store email for verification page
    localStorage.setItem('pendingVerificationEmail', formData.email);
    
    // Redirect to verification page
    navigate('/verify-email');
    
    toast.success('Registration successful! Check your email for OTP.');
  }
};
```

### Email Verification Page

```javascript
const VerifyEmailPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get email from registration
    const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    if (pendingEmail) setEmail(pendingEmail);
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    
    const response = await fetch('/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.removeItem('pendingVerificationEmail');
      toast.success('Email verified! You can now login.');
      navigate('/login');
    } else {
      toast.error(data.msg);
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    const response = await fetch('/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    toast.info(data.msg);
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <p>Enter the 6-digit OTP sent to {email}</p>
      
      <input
        type="text"
        maxLength="6"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
      />
      
      <button onClick={handleVerify} disabled={loading}>
        Verify Email
      </button>
      
      <button onClick={handleResendOTP}>
        Resend OTP
      </button>
    </div>
  );
};
```

### Login Page - Handle Unverified Users

```javascript
const handleLogin = async (formData) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const data = await response.json();
  
  if (response.status === 403 && !data.isVerified) {
    // User not verified
    toast.error('Please verify your email first');
    
    // Store email and redirect to verification
    localStorage.setItem('pendingVerificationEmail', data.email);
    navigate('/verify-email');
  } else if (response.ok) {
    // Login successful
    localStorage.setItem('token', data.token);
    toast.success('Login successful!');
    navigate('/');
  }
};
```

---

## ✅ Testing Checklist

- [ ] Register new user - OTP email received
- [ ] OTP format is 6 digits
- [ ] Verify with correct OTP - success
- [ ] Verify with wrong OTP - error
- [ ] Wait 10 minutes - OTP expires
- [ ] Resend OTP - new OTP received
- [ ] Login before verification - blocked
- [ ] Login after verification - success
- [ ] Already verified user - shows verified message

---

## 🔒 Security Features

1. **Short expiration** - 10 minutes instead of 24 hours
2. **6-digit numeric OTP** - Easy to read, hard to guess (1 million combinations)
3. **One-time use** - OTP deleted after successful verification
4. **No URL exposure** - No risk of token leaking in browser history
5. **Email-based** - User must have access to their email account

---

## 💡 Advantages of OTP over Links

| Feature | OTP | Verification Link |
|---------|-----|-------------------|
| **User Experience** | Copy 6 digits | Click link (can break) |
| **Security** | Shorter validity (10 min) | Longer validity (24 hrs) |
| **Mobile Friendly** | Easy to type on mobile | May open wrong browser |
| **No URL Sharing** | Can't accidentally share | Can be forwarded |
| **Visibility** | See OTP in email | Hidden in URL |

---

## 🚀 Ready to Test!

The OTP-based email verification system is now fully implemented and ready for testing. Make sure PostgreSQL is running, then start your server and test the new flow!

```bash
# Start PostgreSQL (if not running)
# Then start your server:
cd server
npm run dev
```

Test the complete flow using the examples above! 🎉
