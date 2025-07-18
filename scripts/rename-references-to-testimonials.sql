-- Drop the old references table if it exists
DROP TABLE IF EXISTS references CASCADE;

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  photo_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON testimonials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active testimonials
CREATE POLICY "Allow public read access to active testimonials" 
ON testimonials FOR SELECT 
USING (is_active = true);

-- Allow authenticated users full access (for admin)
CREATE POLICY "Allow authenticated users full access to testimonials" 
ON testimonials FOR ALL 
USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO testimonials (name, position, text, rating, display_order) VALUES
('Ing. Štěpánka Tryznová', 'Střední škola hotelnictví, řemesel a gastronomie, Trutnov, p. o.', 'Vážená paní Růžičková, ještě jednou veliký dík Vám a Vašim kolegům za celý ten úžasný projekt. Věřte, že jste našim studentům dali do života víc zážitků a zkušeností, než by dalo mnoho dní prosezených ve škole. Velice rádi se zúčastníme i příští rok.', 5, 1),
('Mgr. Helena Kučerová', 'Střední zdravotnická škola, Turnov, 28. října 1390', 'Vážená paní ředitelko, velice děkujeme za Vaši milou zpětnou vazbu a pochvalu našich žáků. Velmi rádi jim ji vyřídíme. Kromě práce žáků musím vyzdvihnout také práci kolegyň, které se jim věnovaly. Určitě počítáme s účastí i v příštím školním roce a těšíme se. Přeji Vám hodně sil a radosti z další práce.', 5, 2),
('Jan Novák', 'Absolvent programu, nyní profesionální fotograf', 'Díky programu Dělej co tě baví jsem našel svou vášeň pro fotografii. Workshopy byly skvěle vedené a atmosféra byla úžasná. Dnes pracuji jako profesionální fotograf a stále se účastním akcí organizace.', 5, 3),
('Marie Svobodová', 'Rodič účastníka tábora', 'Naše dcera se zúčastnila příměstského tábora a byla nadšená. Organizace byla perfektní, instruktoři milí a profesionální. Určitě ji přihlásíme i příští rok. Děkujeme za krásné prázdniny!', 5, 4),
('Ing. Pavel Černý', 'Ředitel, Městská knihovna Praha', 'Spolupráce s organizací Dělej co tě baví byla výborná. Jejich přístup k mladým lidem je inspirativní a výsledky jejich práce jsou viditelné. Rádi budeme pokračovat v partnerství.', 5, 5),
('Tereza Horáková', 'Studentka gymnázia, Praha', 'Konference Rada mladších byla skvělá příležitost k diskusi o důležitých tématech. Organizace byla na vysoké úrovni a moderátoři dokázali vést diskusi velmi profesionálně. Těšíme se na další ročník.', 5, 6);
