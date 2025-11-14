-- Migration: Ensure seat_type enum is (basic, recliner, vip)
-- Date: November 14, 2025
-- Purpose: Update seat type classification if needed

-- If enum already exists with different values, this will update it
-- Otherwise, it will just verify the correct enum exists

DO $$ 
BEGIN
  -- Check if we need to update the enum
  IF EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'seat_type'
    AND e.enumlabel NOT IN ('basic', 'recliner', 'vip')
  ) THEN
    -- Create new type
    CREATE TYPE seat_type_new AS ENUM ('basic', 'recliner', 'vip');
    
    -- Update table to use new type
    ALTER TABLE seats 
      ALTER COLUMN seat_type TYPE seat_type_new 
      USING (
        CASE 
          WHEN seat_type::text = 'normal' THEN 'basic'
          WHEN seat_type::text = 'executive' THEN 'recliner'
          WHEN seat_type::text = 'vip' THEN 'vip'
          ELSE 'basic'
        END
      )::seat_type_new;
    
    -- Drop old type and rename new one
    DROP TYPE seat_type;
    ALTER TYPE seat_type_new RENAME TO seat_type;
    
    -- Set default
    ALTER TABLE seats ALTER COLUMN seat_type SET DEFAULT 'basic';
    
    RAISE NOTICE 'Seat types updated successfully';
  ELSE
    RAISE NOTICE 'Seat types already correct (basic, recliner, vip)';
  END IF;
END $$;

-- Verification query
SELECT seat_type, COUNT(*) as count 
FROM seats 
GROUP BY seat_type 
ORDER BY seat_type;

COMMENT ON TYPE seat_type IS 'Seat classification: basic (standard seating), recliner (premium comfort), vip (luxury experience)';
