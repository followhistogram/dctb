-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    long_description TEXT,
    impact TEXT,
    duration TEXT,
    features TEXT[],
    image_url TEXT,
    project_link TEXT,
    icon TEXT,
    color TEXT,
    category TEXT,
    type TEXT NOT NULL DEFAULT 'main' CHECK (type IN ('main', 'additional')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies for projects
-- 1. Allow public read access
CREATE POLICY "Allow public read access to projects"
ON projects
FOR SELECT
USING (true);

-- 2. Allow admin users to insert
CREATE POLICY "Allow admin users to insert projects"
ON projects
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 3. Allow admin users to update
CREATE POLICY "Allow admin users to update projects"
ON projects
FOR UPDATE
USING (auth.role() = 'authenticated');

-- 4. Allow admin users to delete
CREATE POLICY "Allow admin users to delete projects"
ON projects
FOR DELETE
USING (auth.role() = 'authenticated');

-- Function to update `updated_at` timestamp
CREATE OR REPLACE FUNCTION handle_project_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update `updated_at` on row update
CREATE TRIGGER on_project_update
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION handle_project_update();
