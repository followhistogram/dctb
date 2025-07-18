-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 20,
  registered INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  image_url TEXT,
  organizer TEXT NOT NULL,
  requirements TEXT[],
  agenda JSONB,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event categories table
CREATE TABLE IF NOT EXISTS event_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default event categories
INSERT INTO event_categories (name, slug, description, color) VALUES
  ('Workshop', 'workshop', 'Vzdělávací workshopy a kurzy', '#c13aab'),
  ('Seminář', 'seminar', 'Odborné semináře a přednášky', '#00acb9'),
  ('Konference', 'konference', 'Meziškolní konference a setkání', '#10b981'),
  ('Tábor', 'tabor', 'Příměstské tábory a pobytové akce', '#f59e0b'),
  ('Kulturní akce', 'kulturni-akce', 'Kulturní a společenské akce', '#8b5cf6'),
  ('Sportovní akce', 'sportovni-akce', 'Sportovní aktivity a soutěže', '#ef4444')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT USING (true);

-- Only authenticated users can manage events
CREATE POLICY "Authenticated users can manage events" ON events
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for event_categories
CREATE POLICY "Anyone can read event categories" ON event_categories
  FOR SELECT USING (true);

-- Only authenticated users can manage event categories
CREATE POLICY "Authenticated users can manage event categories" ON event_categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Triggers for updated_at
CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample events
INSERT INTO events (
  title, description, long_description, date, end_date, time, end_time, 
  location, address, capacity, registered, price, category, image_url, 
  organizer, requirements, agenda, tags, featured
) VALUES
(
  'Příměstský tábor BIKE CAMP',
  'Týdenní dobrodružství na kolech pro děti a mládež ve věku 8-16 let.',
  'Příměstský tábor BIKE CAMP je určen pro všechny mladé cyklisty, kteří chtějí zlepšit své dovednosti na kole a prožít nezapomenutelné prázdniny. Během pěti dnů se naučíte základy bezpečné jízdy, zvládnete technické prvky a projdete se po nejkrásnějších stezkách v okolí Prahy.',
  '2025-08-11',
  '2025-08-15',
  '08:00',
  '16:00',
  'Bike park Letná',
  'Letenské sady, Praha 7',
  24,
  18,
  4900.00,
  'Tábor',
  '/placeholder.svg?height=400&width=600',
  'Tomáš Novotný',
  ARRAY['Vlastní kolo v dobrém technickém stavu', 'Cyklistická helma (povinná)', 'Sportovní oblečení a obuv', 'Pláštěnka nebo nepromokavá bunda', 'Láhev na pití', 'Svačina na každý den'],
  '[
    {"time": "08:00-08:30", "activity": "Příchod a ranní rozcvička"},
    {"time": "08:30-10:00", "activity": "Technické dovednosti - brždění a zatáčení"},
    {"time": "10:00-10:15", "activity": "Přestávka"},
    {"time": "10:15-11:45", "activity": "Jízda v terénu - základy"},
    {"time": "11:45-12:30", "activity": "Oběd"},
    {"time": "12:30-14:00", "activity": "Výlet na kolech po okolí"},
    {"time": "14:00-14:15", "activity": "Svačina"},
    {"time": "14:15-15:30", "activity": "Hry a soutěže na kolech"},
    {"time": "15:30-16:00", "activity": "Závěrečné hodnocení dne"}
  ]'::jsonb,
  ARRAY['cyklistika', 'tábor', 'děti', 'sport', 'příroda'],
  true
),
(
  'Kreativní psaní pro začátečníky',
  'Objevte sílu slov a naučte se vyjadřovat své myšlenky kreativním způsobem.',
  'Tento workshop je určen pro všechny, kteří chtějí začít s kreativním psaním nebo si zlepšit své dovednosti. Během tří hodin se naučíte základní techniky, prozkoumáte různé žánry a vytvoříte své první texty pod vedením zkušené spisovatelky.',
  '2024-12-22',
  NULL,
  '14:00',
  '17:00',
  'Komunitní centrum',
  'Náměstí Míru 15, Praha 2',
  20,
  15,
  0.00,
  'Workshop',
  '/placeholder.svg?height=400&width=600',
  'Marie Nováková',
  ARRAY['Zápisník a pero', 'Chuť experimentovat', 'Žádné předchozí zkušenosti nejsou nutné'],
  '[
    {"time": "14:00-14:30", "activity": "Úvod a seznámení"},
    {"time": "14:30-15:30", "activity": "Základní techniky kreativního psaní"},
    {"time": "15:30-15:45", "activity": "Přestávka"},
    {"time": "15:45-16:30", "activity": "Praktické cvičení - tvorba krátkého textu"},
    {"time": "16:30-17:00", "activity": "Sdílení a zpětná vazba"}
  ]'::jsonb,
  ARRAY['kreativita', 'psaní', 'začátečníci'],
  true
)
ON CONFLICT DO NOTHING;
