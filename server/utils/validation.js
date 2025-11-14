/**
 * Validation Utilities
 * Regex patterns and validation functions for user inputs
 */

// Regex Patterns
export const REGEX_PATTERNS = {
  // Email: Standard RFC 5322 compliant email validation
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Password: Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Name: 2-50 characters, letters, spaces, hyphens, apostrophes only
  name: /^[a-zA-Z\s'-]{2,50}$/,
  
  // Theater/Hall Name: 2-100 characters, alphanumeric with spaces and common punctuation
  theaterName: /^[a-zA-Z0-9\s.,'-]{2,100}$/,
  
  // City: 2-50 characters, letters, spaces, hyphens only
  city: /^[a-zA-Z\s-]{2,50}$/,
  
  // OTP: Exactly 6 digits
  otp: /^\d{6}$/,
  
  // Phone: 10 digits (Indian format)
  phone: /^[6-9]\d{9}$/
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  email: {
    required: "Email is required",
    invalid: "Invalid email format. Please enter a valid email address."
  },
  password: {
    required: "Password is required",
    invalid: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
  },
  name: {
    required: "Name is required",
    invalid: "Name must be 2-50 characters long and can only contain letters, spaces, hyphens, and apostrophes."
  },
  theaterName: {
    required: "Theater name is required",
    invalid: "Theater name must be 2-100 characters long and can contain letters, numbers, spaces, and basic punctuation."
  },
  city: {
    required: "City is required",
    invalid: "City must be 2-50 characters long and can only contain letters, spaces, and hyphens."
  },
  otp: {
    required: "OTP is required",
    invalid: "OTP must be exactly 6 digits."
  },
  phone: {
    required: "Phone number is required",
    invalid: "Phone number must be a valid 10-digit Indian mobile number."
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, message: VALIDATION_MESSAGES.email.required };
  }
  
  if (!REGEX_PATTERNS.email.test(email.trim())) {
    return { isValid: false, message: VALIDATION_MESSAGES.email.invalid };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { isValid: false, message: VALIDATION_MESSAGES.password.required };
  }
  
  if (!REGEX_PATTERNS.password.test(password)) {
    return { isValid: false, message: VALIDATION_MESSAGES.password.invalid };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate name format
 * @param {string} name - Name to validate
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, message: VALIDATION_MESSAGES.name.required };
  }
  
  if (!REGEX_PATTERNS.name.test(name.trim())) {
    return { isValid: false, message: VALIDATION_MESSAGES.name.invalid };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate theater/hall name
 * @param {string} name - Theater/hall name to validate
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateTheaterName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, message: VALIDATION_MESSAGES.theaterName.required };
  }
  
  if (!REGEX_PATTERNS.theaterName.test(name.trim())) {
    return { isValid: false, message: VALIDATION_MESSAGES.theaterName.invalid };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate city name
 * @param {string} city - City name to validate
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateCity = (city) => {
  if (!city || city.trim() === '') {
    return { isValid: false, message: VALIDATION_MESSAGES.city.required };
  }
  
  if (!REGEX_PATTERNS.city.test(city.trim())) {
    return { isValid: false, message: VALIDATION_MESSAGES.city.invalid };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate OTP format
 * @param {string} otp - OTP to validate
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateOTP = (otp) => {
  if (!otp || otp.trim() === '') {
    return { isValid: false, message: VALIDATION_MESSAGES.otp.required };
  }
  
  if (!REGEX_PATTERNS.otp.test(otp.trim())) {
    return { isValid: false, message: VALIDATION_MESSAGES.otp.invalid };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate user registration data
 * @param {object} data - { name, email, password }
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateRegistration = (data) => {
  const errors = {};
  
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate theater creation data
 * @param {object} data - { name, city }
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateTheaterData = (data) => {
  const errors = {};
  
  const nameValidation = validateTheaterName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  if (data.city) {
    const cityValidation = validateCity(data.city);
    if (!cityValidation.isValid) {
      errors.city = cityValidation.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
