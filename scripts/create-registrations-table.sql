-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  registration_type TEXT NOT NULL CHECK (registration_type IN ('camp', 'event')),
  
  -- Common fields
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  agree_to_terms BOOLEAN NOT NULL DEFAULT false,
  agree_to_newsletter BOOLEAN DEFAULT false,
  agree_to_photos BOOLEAN DEFAULT false,
  
  -- For camp registrations (children)
  first_name TEXT,
  last_name TEXT,
  birth_date DATE,
  address TEXT,
  city TEXT,
  zip_code TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  
  -- For event registrations (adults)
  full_name TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert registrations" ON event_registrations
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read registrations
CREATE POLICY "Authenticated users can read registrations" ON event_registrations
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only authenticated users can manage registrations
CREATE POLICY "Authenticated users can manage registrations" ON event_registrations
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to increment registered count
CREATE OR REPLACE FUNCTION increment_registered_count(event_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE events 
  SET registered = registered + 1 
  WHERE id = event_id_param;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_event_registrations_updated_at 
  BEFORE UPDATE ON event_registrations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at);
