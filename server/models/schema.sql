-- =========================
-- FLIM_FLEX: final schema
-- =========================

-- === Enums (safe create) ===
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE seat_type AS ENUM ('basic', 'recliner', 'vip');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- =========================
-- Users
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255), -- nullable for Google auth
    google_id VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- require at least one auth method
    CHECK (password IS NOT NULL OR google_id IS NOT NULL)
);



-- =========================
-- Movies
-- =========================
CREATE TABLE IF NOT EXISTS movies (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    languages TEXT[] DEFAULT ARRAY[]::TEXT[], -- supports multiple languages
    genre VARCHAR(50),
    release_date DATE,
    poster_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Theaters and Halls
-- =========================
CREATE TABLE IF NOT EXISTS theaters (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    admin_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- who is the admin for the particular theater
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS halls (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    theater_id INT NOT NULL REFERENCES theaters(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL, -- e.g., "Screen 1", "Audi 2"
    capacity INT, -- optional, can be derived from seats but handy to store
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (theater_id, name)
);


-- =========================
-- Shows
-- =========================
CREATE TABLE IF NOT EXISTS shows (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    hall_id INT NOT NULL REFERENCES halls(id) ON DELETE CASCADE,
    show_time TIMESTAMPTZ NOT NULL,
    language VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- ensure a hall doesn't have two identical-time shows (enforced at app layer for overlaps if needed)
    UNIQUE (hall_id, movie_id, show_time)
);

CREATE INDEX IF NOT EXISTS idx_shows_show_time ON shows(show_time);


-- =========================
-- Seats (belong to halls)
-- =========================
CREATE TABLE IF NOT EXISTS seats (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hall_id INT NOT NULL REFERENCES halls(id) ON DELETE CASCADE,
    row_label VARCHAR(5) NOT NULL,   -- 'A', 'B' or 'AA' etc
    seat_number INT NOT NULL,        -- 1, 2, 3...
    seat_type seat_type NOT NULL DEFAULT 'basic',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (hall_id, row_label, seat_number)
);



-- =========================
-- Prices (per show + seat_type)
-- =========================
CREATE TABLE IF NOT EXISTS prices (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    show_id INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    seat_type seat_type NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    valid_from TIMESTAMPTZ, -- optional for time-limited pricing / dynamic pricing windows
    valid_to TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (show_id, seat_type)
);


-- =========================
-- Bookings and Booking Seats
-- =========================
CREATE TABLE IF NOT EXISTS bookings (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    show_id INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_reference TEXT, -- e.g., gateway transaction id
    booking_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMPTZ
);

-- Each booking can have multiple seats; include show_id here to prevent double-booking.
CREATE TABLE IF NOT EXISTS booking_seats (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    show_id INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    seat_id INT NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
    price_paid NUMERIC(10,2) NOT NULL CHECK (price_paid >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Prevent double-booking: a seat cannot be allocated more than once for the same show
    UNIQUE (show_id, seat_id)
);

-- index to quickly find seats for a show
CREATE INDEX IF NOT EXISTS idx_booking_seats_show ON booking_seats(show_id);



-- =========================
-- End of schema
-- =========================
