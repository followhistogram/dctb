-- Add slug column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS events_slug_unique ON events(slug);

-- Update existing events with slugs based on their titles
UPDATE events 
SET slug = CASE 
  WHEN title = 'Příměstský tábor BIKE CAMP' THEN 'bike-camp-2025'
  WHEN title = 'Kreativní psaní pro začátečníky' THEN 'kreativni-psani-zacatecnici'
  ELSE lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[áàâäã]', 'a', 'g'),
        '[éèêë]', 'e', 'g'
      ),
      '[íìîï]', 'i', 'g'
    )
  )
END
WHERE slug IS NULL;

-- Make slug column NOT NULL after updating existing records
ALTER TABLE events ALTER COLUMN slug SET NOT NULL;

-- Add constraint to ensure slug is unique
ALTER TABLE events ADD CONSTRAINT events_slug_unique_constraint UNIQUE (slug);
