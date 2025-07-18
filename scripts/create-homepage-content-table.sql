-- Create homepage_content table
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id TEXT PRIMARY KEY DEFAULT '1',
    hero_title TEXT NOT NULL DEFAULT 'Dělej co tě baví',
    hero_description TEXT NOT NULL DEFAULT 'Pomáháme mladým lidem najít jejich cestu a rozvíjet jejich potenciál prostřednictvím zážitkových programů, táborů a workshopů.',
    hero_button1_text TEXT NOT NULL DEFAULT 'Zjistit více',
    hero_button1_link TEXT NOT NULL DEFAULT '/o-nas',
    hero_button2_text TEXT NOT NULL DEFAULT 'Nadcházející události',
    hero_button2_link TEXT NOT NULL DEFAULT '/udalosti',
    hero_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default content
INSERT INTO public.homepage_content (id) VALUES ('1') ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.homepage_content
    FOR SELECT USING (true);

-- Allow authenticated users full access (for admin)
CREATE POLICY "Allow authenticated users to update" ON public.homepage_content
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER handle_homepage_content_updated_at
    BEFORE UPDATE ON public.homepage_content
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
