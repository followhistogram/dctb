-- Seed content for "About Us"
INSERT INTO public.about_us_content (title, content)
VALUES (
  'O nás',
  'Organizujeme a produkčně zajišťujeme akce na míru tábory, kurzy, festivaly, plesy , konference a závody.Dělej co tě baví nabízí neformální vzdělávání a smysluplné trávení volného času dětí a mládeže.'
)
ON CONFLICT (id) DO NOTHING;

-- Seed team members
INSERT INTO public.team_members (name, position, email, display_order)
VALUES
  ('Jiřina Faloutová', 'ředitelka', 'jirina@delejcotebavi.com', 1),
  ('Barbora Růžičková', 'projektová manažerka', 'barbora.ruzickova@delejcotebavi.com', 2),
  ('Klára Hübnerová', 'produkční manažerka, administrace projektů', 'klara@delejcotebavi.com', 3),
  ('Mgr. Petr Zalabák', 'vedoucí táborů, moderátor akcí', 'petr.zalabak@delejcotebavi.com', 4),
  ('Mgr. Jana Havlíková', 'metodička a odborná garantka projektu Rada mladších', 'jana.havlikova@delejcotebavi.com', 5),
  ('Mgr. Aleš Kuda', 'Odborný garant projektu Rada mladších, psycholog a moderátor', null, 6),
  ('Ing. Kateřina Martykánová', 'PR managerka', 'martykanova.katka@gmail.com', 7),
  ('Jana Vaňková', 'grafický vizuál', null, 8),
  ('Ing. Lenka Mikešová', 'administrace projektů', null, 9)
ON CONFLICT (name) DO NOTHING;
