-- Add Razorpay payment integration fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS refund_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Update booking_seats table to track payment status
ALTER TABLE booking_seats 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS lock_expires_at TIMESTAMPTZ;

-- Index for finding locked seats
CREATE INDEX IF NOT EXISTS idx_booking_seats_locked_status 
ON booking_seats(show_id, locked_at, lock_expires_at);

-- Drop existing unique constraint and recreate with soft deletes in mind
ALTER TABLE booking_seats DROP CONSTRAINT IF EXISTS booking_seats_show_id_seat_id_key;

-- Create new unique constraint only for non-cancelled bookings
CREATE UNIQUE INDEX IF NOT EXISTS idx_booking_seats_unique_available 
ON booking_seats(show_id, seat_id) 
WHERE locked_at IS NULL OR lock_expires_at < CURRENT_TIMESTAMP;
