-- Add slug column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx ON events(slug);

-- Update existing events with slugs based on their titles
UPDATE events 
SET slug = CASE 
  WHEN title ILIKE '%bike camp%' THEN 'bike-camp-2025'
  WHEN title ILIKE '%kreativní psaní%' THEN 'kreativni-psani-zacatecnici'
  ELSE lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[áàâäã]', 'a', 'g'),
        '[éèêë]', 'e', 'g'
      ),
      '[^a-z0-9\s-]', '', 'g'
    )
  )
END
WHERE slug IS NULL;

-- Make slug NOT NULL after updating existing records
ALTER TABLE events ALTER COLUMN slug SET NOT NULL;

-- Add constraint to ensure slug is unique
ALTER TABLE events ADD CONSTRAINT events_slug_unique UNIQUE (slug);
