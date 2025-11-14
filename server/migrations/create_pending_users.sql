-- Create pending_users table for temporary storage before email verification
-- Date: November 14, 2025

CREATE TABLE IF NOT EXISTS pending_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    verification_otp VARCHAR(6),
    verification_otp_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_pending_users_email ON pending_users(email);

-- Add automatic cleanup for expired pending users (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_expired_pending_users()
RETURNS void AS $$
BEGIN
    DELETE FROM pending_users 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE pending_users IS 'Temporary storage for user registrations pending email verification';
