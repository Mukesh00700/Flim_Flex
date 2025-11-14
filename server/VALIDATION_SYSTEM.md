# 🔐 Input Validation System

## Overview

The application now includes comprehensive input validation using regex patterns for all user inputs. This ensures data integrity, security, and consistent formatting.

---

## 📋 Validation Rules

### 1. **Email Validation**

**Pattern:** `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`

**Rules:**
- Standard RFC 5322 compliant email format
- Must have @ symbol
- Valid domain with at least 2 letter TLD

**Valid Examples:**
```
✅ user@example.com
✅ john.doe@company.co.in
✅ test_user+tag@domain.org
```

**Invalid Examples:**
```
❌ plaintext
❌ @example.com
❌ user@domain
❌ user @example.com (space)
```

---

### 2. **Password Validation**

**Pattern:** `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/`

**Rules:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

**Valid Examples:**
```
✅ MyPass123!
✅ SecureP@ssw0rd
✅ Test$123Pass
```

**Invalid Examples:**
```
❌ password (no uppercase, number, special char)
❌ PASSWORD123 (no lowercase, special char)
❌ Pass123 (no special char, too short)
❌ MyPass! (no number)
```

---

### 3. **Name Validation**

**Pattern:** `/^[a-zA-Z\s'-]{2,50}$/`

**Rules:**
- 2-50 characters long
- Only letters (a-z, A-Z)
- Spaces allowed
- Hyphens (-) allowed
- Apostrophes (') allowed

**Valid Examples:**
```
✅ John Doe
✅ Mary-Jane
✅ O'Brien
✅ Jean-Pierre D'Arcy
```

**Invalid Examples:**
```
❌ A (too short)
❌ John123 (numbers not allowed)
❌ User@Name (special chars not allowed)
❌ [Name longer than 50 characters...]
```

---

### 4. **Theater/Hall Name Validation**

**Pattern:** `/^[a-zA-Z0-9\s.,'-]{2,100}$/`

**Rules:**
- 2-100 characters long
- Letters, numbers allowed
- Spaces allowed
- Common punctuation: . , ' - allowed

**Valid Examples:**
```
✅ PVR Cinemas
✅ Screen 1
✅ INOX - Phoenix Mall
✅ Hall 3.5
```

**Invalid Examples:**
```
❌ A (too short)
❌ Screen #1 (# not allowed)
❌ Hall@2 (@ not allowed)
```

---

### 5. **City Name Validation**

**Pattern:** `/^[a-zA-Z\s-]{2,50}$/`

**Rules:**
- 2-50 characters long
- Only letters (a-z, A-Z)
- Spaces allowed
- Hyphens (-) allowed

**Valid Examples:**
```
✅ Mumbai
✅ New Delhi
✅ Bangalore-North
```

**Invalid Examples:**
```
❌ City123 (numbers not allowed)
❌ M (too short)
```

---

### 6. **OTP Validation**

**Pattern:** `/^\d{6}$/`

**Rules:**
- Exactly 6 digits
- Only numbers (0-9)

**Valid Examples:**
```
✅ 123456
✅ 000000
✅ 999999
```

**Invalid Examples:**
```
❌ 12345 (too short)
❌ 1234567 (too long)
❌ ABC123 (letters not allowed)
```

---

## 🔧 API Error Responses

### Registration Validation Error

**Request:**
```bash
POST /auth/register
{
  "name": "A",
  "email": "invalid-email",
  "password": "weak"
}
```

**Response:** `400 Bad Request`
```json
{
  "msg": "Validation failed",
  "errors": {
    "name": "Name must be 2-50 characters long and can only contain letters, spaces, hyphens, and apostrophes.",
    "email": "Invalid email format. Please enter a valid email address.",
    "password": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
  }
}
```

---

### Login Email Validation Error

**Request:**
```bash
POST /auth/login
{
  "email": "not-an-email",
  "password": "MyPass123!"
}
```

**Response:** `400 Bad Request`
```json
{
  "msg": "Invalid email format. Please enter a valid email address."
}
```

---

### OTP Validation Error

**Request:**
```bash
POST /auth/verify-email
{
  "email": "user@example.com",
  "otp": "12345"
}
```

**Response:** `400 Bad Request`
```json
{
  "msg": "OTP must be exactly 6 digits."
}
```

---

### Theater Creation Validation Error

**Request:**
```bash
POST /theater/createTheater
{
  "name": "T",
  "city": "City123",
  "address": "123 Main St"
}
```

**Response:** `400 Bad Request`
```json
{
  "msg": "Validation failed",
  "errors": {
    "name": "Theater name must be 2-100 characters long and can contain letters, numbers, spaces, and basic punctuation.",
    "city": "City must be 2-50 characters long and can only contain letters, spaces, and hyphens."
  }
}
```

---

## 🎯 Validated Endpoints

### Authentication Endpoints

| Endpoint | Method | Validated Fields |
|----------|--------|------------------|
| `/auth/register` | POST | name, email, password |
| `/auth/register-admin` | POST | name, email, password |
| `/auth/login` | POST | email |
| `/auth/verify-email` | POST | email, otp |
| `/auth/resend-verification` | POST | email |
| `/auth/request-password-reset` | POST | email |
| `/auth/reset-password` | POST | password |

---

### Theater Endpoints

| Endpoint | Method | Validated Fields |
|----------|--------|------------------|
| `/theater/createTheater` | POST | name, city |
| `/theater/updateTheater/:id` | PUT | name, city |
| `/theater/:theaterId/halls` | POST | name (hall) |
| `/theater/halls/:hallId` | PUT | name (hall) |

---

## 💻 Frontend Integration

### React Form Validation Example

```javascript
import { useState } from 'react';

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const validateName = (name) => {
  const regex = /^[a-zA-Z\s'-]{2,50}$/;
  return regex.test(name);
};

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const newErrors = {};
    
    if (!validateName(formData.name)) {
      newErrors.name = 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes.';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit to API
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle server-side validation errors
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.msg });
        }
      } else {
        // Success
        console.log('Registration successful!');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      
      <button type="submit">Register</button>
    </form>
  );
};
```

---

### Real-time Validation Example

```javascript
const PasswordInput = ({ value, onChange }) => {
  const [strength, setStrength] = useState({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false
  });

  const checkStrength = (password) => {
    setStrength({
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password),
      hasLength: password.length >= 8
    });
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    checkStrength(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <input
        type="password"
        value={value}
        onChange={handleChange}
        placeholder="Password"
      />
      <div className="password-requirements">
        <div className={strength.hasLength ? 'valid' : 'invalid'}>
          {strength.hasLength ? '✓' : '✗'} At least 8 characters
        </div>
        <div className={strength.hasUpper ? 'valid' : 'invalid'}>
          {strength.hasUpper ? '✓' : '✗'} One uppercase letter
        </div>
        <div className={strength.hasLower ? 'valid' : 'invalid'}>
          {strength.hasLower ? '✓' : '✗'} One lowercase letter
        </div>
        <div className={strength.hasNumber ? 'valid' : 'invalid'}>
          {strength.hasNumber ? '✓' : '✗'} One number
        </div>
        <div className={strength.hasSpecial ? 'valid' : 'invalid'}>
          {strength.hasSpecial ? '✓' : '✗'} One special character (@$!%*?&)
        </div>
      </div>
    </div>
  );
};
```

---

## ✅ Benefits

1. **Security:** Prevents injection attacks and malformed data
2. **Consistency:** Uniform data format across the application
3. **User Experience:** Clear error messages guide users
4. **Data Quality:** Ensures valid data enters the database
5. **Maintainability:** Centralized validation logic

---

## 🔍 Testing Validation

### Valid Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "MyPass123!"
  }'
```
✅ **Success**

### Invalid Registration (Multiple Errors)
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J",
    "email": "invalid-email",
    "password": "weak"
  }'
```
❌ **Returns validation errors for all fields**

---

## 📚 Validation Utility Functions

The validation system is available in `server/utils/validation.js`:

```javascript
import { 
  validateEmail, 
  validatePassword, 
  validateName,
  validateTheaterName,
  validateCity,
  validateOTP,
  validateRegistration,
  validateTheaterData
} from './utils/validation.js';

// Individual field validation
const emailCheck = validateEmail('test@example.com');
// Returns: { isValid: true, message: '' }

// Complete registration validation
const regCheck = validateRegistration({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'MyPass123!'
});
// Returns: { isValid: true, errors: {} }
```

---

## 🚀 Summary

All user inputs are now validated using regex patterns to ensure:
- ✅ Valid email formats
- ✅ Strong passwords (8+ chars with uppercase, lowercase, number, special char)
- ✅ Proper name formatting
- ✅ Valid theater/hall names
- ✅ Correct OTP format (6 digits)
- ✅ Consistent error messages
- ✅ Both client and server-side validation support

The validation system provides a robust foundation for data integrity and security! 🔐
