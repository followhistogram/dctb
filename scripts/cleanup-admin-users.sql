-- Remove admin_users table and all related policies
-- This fixes the infinite recursion error

-- Drop the admin_users table if it exists
DROP TABLE IF EXISTS admin_users CASCADE;

-- Remove any policies that might reference admin_users
-- Check for policies on news_articles table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies on news_articles table
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename = 'news_articles'
    LOOP
        -- Drop each policy
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            policy_record.policyname, 
            policy_record.schemaname, 
            policy_record.tablename);
    END LOOP;
END $$;

-- Create simple RLS policies for news_articles using Supabase Auth
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read news_articles (public access)
CREATE POLICY "Public can read news_articles" ON news_articles
    FOR SELECT USING (true);

-- Allow authenticated users to manage news_articles
CREATE POLICY "Authenticated users can manage news_articles" ON news_articles
    FOR ALL USING (auth.role() = 'authenticated');

-- Also ensure events table has proper policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies on events table
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename = 'events'
    LOOP
        -- Drop each policy
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            policy_record.policyname, 
            policy_record.schemaname, 
            policy_record.tablename);
    END LOOP;
END $$;

-- Create simple RLS policies for events using Supabase Auth
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read events (public access)
CREATE POLICY "Public can read events" ON events
    FOR SELECT USING (true);

-- Allow authenticated users to manage events
CREATE POLICY "Authenticated users can manage events" ON events
    FOR ALL USING (auth.role() = 'authenticated');

-- Politiky pro registrations tabulku
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies on registrations table
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename = 'registrations'
    LOOP
        -- Drop each policy
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            policy_record.policyname, 
            policy_record.schemaname, 
            policy_record.tablename);
    END LOOP;
END $$;

-- Create simple RLS policies for registrations using Supabase Auth
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow public to create registrations
CREATE POLICY "Public can create registrations" ON registrations
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to manage registrations
CREATE POLICY "Authenticated users can manage registrations" ON registrations
    FOR ALL USING (auth.role() = 'authenticated');
