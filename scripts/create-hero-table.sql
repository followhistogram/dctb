-- Create hero_section table
CREATE TABLE IF NOT EXISTS public.hero_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_text TEXT NOT NULL DEFAULT 'Nezisková organizace pro mladé',
  title TEXT NOT NULL DEFAULT 'Dělej co tě baví',
  subtitle TEXT NOT NULL DEFAULT 'Pomáháme mladým lidem najít svou cestu, rozvíjet talenty a realizovat své sny. Připojte se k naší komunitě a objevte nové možnosti.',
  button1_text TEXT NOT NULL DEFAULT 'Zjistit více',
  button1_link TEXT NOT NULL DEFAULT '/o-nas',
  button2_text TEXT NOT NULL DEFAULT 'Nadcházející události',
  button2_link TEXT NOT NULL DEFAULT '/udalosti',
  image_url TEXT DEFAULT '/placeholder.svg?height=600&width=500',
  image_alt TEXT DEFAULT 'Mladí lidé pracující na kreativních projektech',
  stat1_value TEXT DEFAULT '500+',
  stat1_label TEXT DEFAULT 'Aktivních členů',
  stat2_value TEXT DEFAULT '50+',
  stat2_label TEXT DEFAULT 'Projektů ročně',
  stat3_value TEXT DEFAULT '10',
  stat3_label TEXT DEFAULT 'Let působení',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default content if table is empty
INSERT INTO public.hero_section (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM public.hero_section);


-- Enable RLS
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to hero_section" ON public.hero_section FOR SELECT USING (true);

-- Allow authenticated users full access (for admin)
CREATE POLICY "Allow authenticated full access to hero_section" ON public.hero_section FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_hero_section_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_hero_section_updated_at
  BEFORE UPDATE ON public.hero_section
  FOR EACH ROW
  EXECUTE FUNCTION public.update_hero_section_updated_at();
