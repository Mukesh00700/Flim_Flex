-- Migration: Add default pricing columns to halls table
-- Date: November 14, 2025
-- Purpose: Allow halls to store default seat pricing that can be used when creating shows

-- Add default price columns to halls table
ALTER TABLE halls 
ADD COLUMN IF NOT EXISTS default_basic_price NUMERIC(10,2) DEFAULT 200,
ADD COLUMN IF NOT EXISTS default_recliner_price NUMERIC(10,2) DEFAULT 350,
ADD COLUMN IF NOT EXISTS default_vip_price NUMERIC(10,2) DEFAULT 500;

-- Update existing halls with default prices
UPDATE halls 
SET 
  default_basic_price = 200,
  default_recliner_price = 350,
  default_vip_price = 500
WHERE default_basic_price IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN halls.default_basic_price IS 'Default price for basic seats in this hall (can be overridden per show)';
COMMENT ON COLUMN halls.default_recliner_price IS 'Default price for recliner seats in this hall (can be overridden per show)';
COMMENT ON COLUMN halls.default_vip_price IS 'Default price for VIP seats in this hall (can be overridden per show)';

-- Verify the migration
SELECT 
  id,
  name,
  default_basic_price,
  default_recliner_price,
  default_vip_price
FROM halls
LIMIT 5;
