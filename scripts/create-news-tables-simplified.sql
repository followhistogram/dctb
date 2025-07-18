-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create news table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  perex TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS news_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO news_categories (name, slug, description, color) VALUES
  ('Projekty', 'projekty', 'Úspěchy a výsledky našich projektů', '#c13aab'),
  ('Partnerství', 'partnerstvi', 'Nové spolupráce a partnerství', '#00acb9'),
  ('Tábory', 'tabory', 'Zprávy z příměstských táborů', '#10b981'),
  ('Granty', 'granty', 'Získané granty a financování', '#f59e0b'),
  ('Workshopy', 'workshopy', 'Vzdělávací aktivity a kurzy', '#8b5cf6'),
  ('Organizace', 'organizace', 'Interní zprávy organizace', '#6b7280')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news_articles
CREATE POLICY "Anyone can read published articles" ON news_articles
  FOR SELECT USING (true);

-- Only authenticated users can manage articles
CREATE POLICY "Authenticated users can manage articles" ON news_articles
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for news_categories
CREATE POLICY "Anyone can read categories" ON news_categories
  FOR SELECT USING (true);

-- Only authenticated users can manage categories
CREATE POLICY "Authenticated users can manage categories" ON news_categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_news_articles_updated_at 
  BEFORE UPDATE ON news_articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample news articles
INSERT INTO news_articles (slug, title, perex, content, author, category, tags, image_url, featured, read_time) VALUES
(
  'uspesne-dokonceni-projektu-rada-mladsich-2024',
  'Úspěšné dokončení projektu Rada mladších 2024',
  'Letošní ročník meziškolní konference Rada mladších přinesl mnoho inspirativních diskusí a nových nápadů od středoškolských studentů z celé republiky.',
  '<p>Ve dnech 15.-17. listopadu 2024 se v Praze uskutečnil již 8. ročník meziškolní konference Rada mladších, která letos přivítala rekordních 180 studentů z 25 středních škol z celé České republiky.</p><h2>Hlavní témata konference</h2><p>Letošní konference se zaměřila na tři klíčová témata současnosti:</p><ul><li><strong>Klimatická změna a udržitelnost</strong> - studenti diskutovali o praktických řešeních pro školy a komunity</li><li><strong>Digitální gramotnost a AI</strong> - jak se připravit na budoucnost plnou technologií</li><li><strong>Duševní zdraví mladých</strong> - otevřená diskuse o problémech a řešeních</li></ul>',
  'Marie Nováková',
  'Projekty',
  ARRAY['rada mladších', 'konference', 'studenti', 'vzdělávání'],
  '/placeholder.svg?height=400&width=600',
  true,
  4
),
(
  'nove-partnerstvi-s-mestskou-knihovnou-praha',
  'Nové partnerství s Městskou knihovnou Praha',
  'Navázali jsme spolupráci s Městskou knihovnou Praha na projektu podpory čtenářské gramotnosti mezi mladými lidmi.',
  '<p>S radostí oznamujeme zahájení nového partnerství s Městskou knihovnou Praha, které přinese mladým lidem nové možnosti rozvoje čtenářské gramotnosti a lásky ke knihám.</p><h2>Co partnerství přinese</h2><p>Spolupráce se zaměří na několik klíčových oblastí:</p><ul><li><strong>Literární klub pro mladé</strong> - měsíční setkání nad zajímavými knihami</li><li><strong>Workshopy kreativního psaní</strong> - pod vedením zkušených autorů</li></ul>',
  'Tomáš Svoboda',
  'Partnerství',
  ARRAY['partnerství', 'knihovna', 'čtení', 'literatura'],
  '/placeholder.svg?height=400&width=600',
  true,
  3
)
ON CONFLICT (slug) DO NOTHING;
