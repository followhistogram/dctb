-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id SERIAL PRIMARY KEY,
  logo_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row if none exists
INSERT INTO public.site_settings (logo_url, seo_title, seo_description, seo_keywords)
SELECT 
  '/logo.png',
  'Dělej co tě baví',
  'Organizace zaměřená na rozvoj dětí a mládeže prostřednictvím aktivit a projektů.',
  'děti, mládež, aktivity, projekty, rozvoj'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin)
CREATE POLICY "Allow authenticated users to read site_settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update site_settings" ON public.site_settings
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to insert site_settings" ON public.site_settings
  FOR INSERT WITH CHECK (true);
