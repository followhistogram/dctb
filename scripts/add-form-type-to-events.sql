-- Add form_type column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS form_type VARCHAR(20) DEFAULT 'event';

-- Update existing events to have default form_type
UPDATE events SET form_type = 'event' WHERE form_type IS NULL;

-- Add check constraint for valid form types
ALTER TABLE events ADD CONSTRAINT check_form_type CHECK (form_type IN ('event', 'camp'));
