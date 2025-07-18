-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(500),
  logo_url VARCHAR(500),
  category VARCHAR(100) NOT NULL CHECK (category IN ('educational', 'municipal', 'corporate', 'media')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create partner categories table for better management
CREATE TABLE IF NOT EXISTS partner_categories (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(100),
  display_order INTEGER DEFAULT 0
);

-- Insert default categories
INSERT INTO partner_categories (id, title, description, icon, color, display_order) VALUES
('educational', 'Vzdělávací instituce', 'Střední školy a vzdělávací zařízení, se kterými dlouhodobě spolupracujeme', 'Users', 'from-[#c13aab] to-[#c13aab]/80', 1),
('municipal', 'Města a obce', 'Místní samosprávy podporující naše aktivity a projekty', 'Building', 'from-[#00acb9] to-[#00acb9]/80', 2),
('corporate', 'Firemní partneři', 'Společnosti, které nás podporují finančně nebo poskytují služby', 'Handshake', 'from-[#c13aab] to-[#00acb9]', 3),
('media', 'Mediální partneři', 'Média, která o nás informují a podporují naše aktivity', 'Globe', 'from-[#00acb9] to-[#c13aab]', 4);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to partners" ON partners FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to partner_categories" ON partner_categories FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Allow admin full access to partners" ON partners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access to partner_categories" ON partner_categories FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
