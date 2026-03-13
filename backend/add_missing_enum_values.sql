-- Add missing enum values to messagetype
-- Run this in Supabase SQL Editor

-- Add PROPOSE_MEETING if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'PROPOSE_MEETING' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'messagetype')
    ) THEN
        ALTER TYPE messagetype ADD VALUE 'PROPOSE_MEETING';
    END IF;
END $$;

-- Add CONFIRM_MEETING if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'CONFIRM_MEETING' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'messagetype')
    ) THEN
        ALTER TYPE messagetype ADD VALUE 'CONFIRM_MEETING';
    END IF;
END $$;

-- Add GENERATE_OTP if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'GENERATE_OTP' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'messagetype')
    ) THEN
        ALTER TYPE messagetype ADD VALUE 'GENERATE_OTP';
    END IF;
END $$;

-- Add OTP_VERIFIED if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'OTP_VERIFIED' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'messagetype')
    ) THEN
        ALTER TYPE messagetype ADD VALUE 'OTP_VERIFIED';
    END IF;
END $$;

-- Verify the enum values
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'messagetype')
ORDER BY enumlabel;
