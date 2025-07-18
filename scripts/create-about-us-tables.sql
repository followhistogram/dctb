-- Table for the main "About Us" page content
CREATE TABLE IF NOT EXISTS public.about_us_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for team members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.about_us_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Allow public read access to about_us_content"
ON public.about_us_content FOR SELECT
USING (true);

CREATE POLICY "Allow public read access to team_members"
ON public.team_members FOR SELECT
USING (true);

-- Policies for admin full access (using service_role)
CREATE POLICY "Allow admin full access to about_us_content"
ON public.about_us_content FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow admin full access to team_members"
ON public.team_members FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
