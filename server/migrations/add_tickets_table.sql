-- Add tickets table to store ticket information

CREATE TABLE IF NOT EXISTS tickets (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL UNIQUE,
    booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    show_id INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    verification_code VARCHAR(10) NOT NULL,
    qr_code_data TEXT NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (booking_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_id ON tickets(ticket_id);
CREATE INDEX IF NOT EXISTS idx_tickets_booking_id ON tickets(booking_id);
CREATE INDEX IF NOT EXISTS idx_tickets_verification_code ON tickets(verification_code);
CREATE INDEX IF NOT EXISTS idx_tickets_show_id ON tickets(show_id);

-- Add ticket_sent column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS ticket_sent BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS ticket_sent_at TIMESTAMPTZ;
