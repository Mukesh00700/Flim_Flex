-- Add email verification fields to users table

-- Add is_verified column (default false)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Add verification_token column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);

-- Add verification_token_expires column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ;

-- Add password_reset_token column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);

-- Add password_reset_token_expires column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_reset_token_expires TIMESTAMPTZ;

-- Create index on verification_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);

-- Create index on password_reset_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);

-- Create index on email for faster lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update existing users to be verified (if you want existing users to be auto-verified)
-- Uncomment the line below if you want to verify all existing users
-- UPDATE users SET is_verified = TRUE WHERE is_verified = FALSE;
