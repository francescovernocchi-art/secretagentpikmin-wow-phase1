-- Phase 2: Secret Pikmin — persistenza game loop

-- ─── family_members ───
CREATE TABLE IF NOT EXISTS public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text UNIQUE NOT NULL,
  display_name text NOT NULL,
  role text NOT NULL DEFAULT 'comandante',
  rank text NOT NULL DEFAULT 'comandante',
  emoji text NOT NULL DEFAULT '🌱',
  online boolean NOT NULL DEFAULT false,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── player_profiles ───
CREATE TABLE IF NOT EXISTS public.player_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text UNIQUE NOT NULL REFERENCES public.family_members(agent_key) ON DELETE CASCADE,
  user_id uuid,
  level int NOT NULL DEFAULT 1,
  xp int NOT NULL DEFAULT 0,
  coins int NOT NULL DEFAULT 0,
  current_biome text NOT NULL DEFAULT 'bosco',
  lat double precision,
  lng double precision,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── pikmin_specializations (catalogo) ───
CREATE TABLE IF NOT EXISTS public.pikmin_specializations (
  key text PRIMARY KEY,
  title text NOT NULL,
  emoji text NOT NULL DEFAULT '🌱',
  duties jsonb NOT NULL DEFAULT '[]'::jsonb,
  bonuses jsonb NOT NULL DEFAULT '[]'::jsonb,
  best_types jsonb NOT NULL DEFAULT '[]'::jsonb
);

-- ─── pikmin_units ───
CREATE TABLE IF NOT EXISTS public.pikmin_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_agent text NOT NULL REFERENCES public.family_members(agent_key) ON DELETE CASCADE,
  name text NOT NULL,
  type_key text NOT NULL,
  level int NOT NULL DEFAULT 1,
  experience int NOT NULL DEFAULT 0,
  experience_to_next int NOT NULL DEFAULT 200,
  specialization_key text REFERENCES public.pikmin_specializations(key),
  stats jsonb NOT NULL DEFAULT '{"forza":50,"velocita":50,"resistenza":50,"intelligenza":50}'::jsonb,
  preferred_biome text NOT NULL DEFAULT 'bosco',
  story text,
  status text NOT NULL DEFAULT 'disponibile',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── planet_status (singleton) ───
CREATE TABLE IF NOT EXISTS public.planet_status (
  id text PRIMARY KEY DEFAULT 'origin',
  debt_total int NOT NULL DEFAULT 10000,
  debt_paid int NOT NULL DEFAULT 0,
  food int NOT NULL DEFAULT 68,
  energy int NOT NULL DEFAULT 54,
  morale int NOT NULL DEFAULT 72,
  bestiary_count int NOT NULL DEFAULT 12,
  bestiary_total int NOT NULL DEFAULT 48,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── spaceship_parts ───
CREATE TABLE IF NOT EXISTS public.spaceship_parts (
  key text PRIMARY KEY,
  name text NOT NULL,
  emoji text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  location_hint text,
  collected boolean NOT NULL DEFAULT false,
  collected_by text,
  collected_at timestamptz
);

-- ─── player_inventory ───
CREATE TABLE IF NOT EXISTS public.player_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text NOT NULL REFERENCES public.family_members(agent_key) ON DELETE CASCADE,
  item_key text NOT NULL,
  item_name text NOT NULL,
  emoji text NOT NULL DEFAULT '📦',
  category text NOT NULL DEFAULT 'oggetto' CHECK (category IN ('oggetto', 'materiale', 'ingrediente')),
  quantity int NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  sell_price int NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (agent_key, item_key)
);

-- ─── villages ───
CREATE TABLE IF NOT EXISTS public.villages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_agent text NOT NULL REFERENCES public.family_members(agent_key) ON DELETE CASCADE,
  name text NOT NULL,
  biome_key text NOT NULL DEFAULT 'bosco',
  lat double precision,
  lng double precision,
  level int NOT NULL DEFAULT 1,
  is_primary boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── village_buildings ───
CREATE TABLE IF NOT EXISTS public.village_buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  village_id uuid NOT NULL REFERENCES public.villages(id) ON DELETE CASCADE,
  building_key text NOT NULL,
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '🏠',
  level int NOT NULL DEFAULT 1,
  max_level int NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'active',
  UNIQUE (village_id, building_key)
);

-- ─── biome_zones ───
CREATE TABLE IF NOT EXISTS public.biome_zones (
  key text PRIMARY KEY,
  label text NOT NULL,
  emoji text NOT NULL,
  theme text,
  resources jsonb NOT NULL DEFAULT '[]'::jsonb,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  frequent_pikmin jsonb NOT NULL DEFAULT '[]'::jsonb,
  frequent_monsters jsonb NOT NULL DEFAULT '[]'::jsonb,
  events jsonb NOT NULL DEFAULT '[]'::jsonb,
  rarity text NOT NULL DEFAULT 'comune',
  bonus text,
  malus text
);

-- ─── scan_results ───
CREATE TABLE IF NOT EXISTS public.scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text NOT NULL,
  biome_key text NOT NULL,
  target_type text NOT NULL,
  label text NOT NULL,
  emoji text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── market_transactions ───
CREATE TABLE IF NOT EXISTS public.market_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text NOT NULL,
  item_key text NOT NULL,
  item_name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  price int NOT NULL DEFAULT 0,
  transaction_type text NOT NULL CHECK (transaction_type IN ('sell', 'buy', 'debt_payment', 'trade')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── family_chat_messages ───
CREATE TABLE IF NOT EXISTS public.family_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL DEFAULT 'famiglia' CHECK (channel IN ('famiglia', 'missioni', 'villaggio', 'comandante')),
  sender_agent text NOT NULL,
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'text',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── bestiary_entries ───
CREATE TABLE IF NOT EXISTS public.bestiary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creature_key text UNIQUE NOT NULL,
  name text NOT NULL,
  emoji text,
  biome_key text,
  rarity text NOT NULL DEFAULT 'comune',
  danger_level int NOT NULL DEFAULT 1,
  weakness text,
  rewards jsonb NOT NULL DEFAULT '[]'::jsonb,
  discovered_by text,
  scan_count int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS — family open (come messages/missions)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'family_members','player_profiles','pikmin_specializations','pikmin_units',
    'planet_status','spaceship_parts','player_inventory','villages','village_buildings',
    'biome_zones','scan_results','market_transactions','family_chat_messages','bestiary_entries'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "family open" ON public.%I', t);
    EXECUTE format('CREATE POLICY "family open" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.family_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scan_results;
ALTER PUBLICATION supabase_realtime ADD TABLE public.planet_status;

-- ─── SEED: family ───
INSERT INTO public.family_members (agent_key, display_name, role, rank, emoji, online) VALUES
  ('papa', 'Francesco', 'comandante', 'comandante', '⭐', true),
  ('lorenzo', 'Lorenzo', 'comandante', 'comandante_junior', '🌱', true)
ON CONFLICT (agent_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  rank = EXCLUDED.rank,
  emoji = EXCLUDED.emoji;

INSERT INTO public.player_profiles (agent_key, current_biome, coins) VALUES
  ('papa', 'bosco', 120),
  ('lorenzo', 'giardino', 80)
ON CONFLICT (agent_key) DO NOTHING;

-- ─── SEED: specializations ───
INSERT INTO public.pikmin_specializations (key, title, emoji, duties, bonuses, best_types) VALUES
  ('raccolta', 'Raccolta', '🍃', '["frutta","ingredienti","minerali"]', '["più resa","raccolta rapida"]', '["Rosso","Giallo","Ghiaccio"]'),
  ('trasporto', 'Trasporto', '🎒', '["pezzi pesanti","merci","consegne"]', '["peso trasportabile","consegna rapida"]', '["Viola","Roccia","Alato"]'),
  ('ricerca', 'Ricerca oggetti rari', '📡', '["pezzi navicella","reliquie","anomalie"]', '["raggio radar","drop raro"]', '["Giallo","Alato","Bianco"]'),
  ('scouting', 'Scouting e mappatura', '🗺️', '["biomi","percorsi","villaggi"]', '["visibilità mappa","rischio ridotto"]', '["Alato","Blu","Giallo"]'),
  ('spionaggio', 'Spionaggio mostri', '👁️', '["osservazione","debolezze","bestiario"]', '["dati extra","debolezze svelate"]', '["Bianco","Alato","Ghiaccio"]'),
  ('combattimento', 'Combattimento e difesa', '🛡️', '["difesa villaggio","caccia","scorta"]', '["danno","resistenze"]', '["Rosso","Roccia","Viola"]'),
  ('supporto', 'Supporto squadra', '💚', '["cura","morale","buff energia"]', '["rigenerazione","morale +"]', '["Ghiaccio","Bianco","Blu"]')
ON CONFLICT (key) DO NOTHING;

-- ─── SEED: planet ───
INSERT INTO public.planet_status (id, debt_total, debt_paid, food, energy, morale, bestiary_count, bestiary_total)
VALUES ('origin', 10000, 2350, 68, 54, 72, 12, 48)
ON CONFLICT (id) DO NOTHING;

-- ─── SEED: spaceship parts ───
INSERT INTO public.spaceship_parts (key, name, emoji, sort_order, location_hint, collected, collected_by) VALUES
  ('motore', 'Motore ionico', '🔥', 1, 'Zona industriale', true, 'francesco'),
  ('antenna', 'Antenna di comunicazione', '📡', 2, 'Campo aperto', true, 'francesco'),
  ('cabina', 'Cabina di comando', '🛸', 3, 'Bosco antico', false, null),
  ('modulo_energia', 'Modulo energia', '⚡', 4, 'Grotta cristallina', false, null),
  ('stabilizzatori', 'Stabilizzatori', '🪽', 5, 'Giardino', true, 'lorenzo'),
  ('nucleo', 'Nucleo centrale', '💎', 6, 'Anomalia spaziale', false, null)
ON CONFLICT (key) DO NOTHING;

-- ─── SEED: biomes ───
INSERT INTO public.biome_zones (key, label, emoji, theme, resources, ingredients, frequent_pikmin, frequent_monsters, events, rarity, bonus, malus) VALUES
  ('bosco', 'Bosco', '🌲', 'verde profondo, muschio', '["legno","resina","foglie"]', '["frutti di bosco","nettare"]', '["rosso","alato"]', '["Scarabée","Bulborb nano"]', '["pioggia di semi"]', 'comune', 'cibo +15%', 'visibilità ridotta di notte'),
  ('giardino', 'Giardino', '🌻', 'colori vivaci, fiori', '["petali","semi","polline"]', '["miele","bacche"]', '["blu","giallo"]', '["Coccinella gigante"]', '["fioritura"]', 'comune', 'morale +10%', null),
  ('acqua', 'Acqua', '🌊', 'riflessi, alghe', '["alghe","conchiglie"]', '["gocce","plancton"]', '["blu","ghiaccio"]', '["Anfibio scuro"]', '["marea alta"]', 'comune', 'recupero +20%', null),
  ('roccia', 'Roccia', '🪨', 'pareti rocciose', '["pietra","cristalli"]', '["polvere di quarzo"]', '["roccia","viola"]', '["Scarabeo corazza"]', '["vena di cristallo"]', 'raro', 'difesa +15%', null),
  ('grotta', 'Grotta', '🕳️', 'oscurità, bioluminescenza', '["stalattiti","spore"]', '["luminescenza"]', '["bianco","luminoso"]', '["Slime ombra"]', '["eclissi interna"]', 'raro', 'ricerca +25%', 'morale -5% senza luce'),
  ('campo', 'Campo', '🌾', 'prateria aperta', '["fieno","semi selvatici"]', '["grano","bacche selvatiche"]', '["giallo","alato"]', '["Locusta verde"]', '["raccolto"]', 'comune', 'scouting +20%', null),
  ('citta', 'Città', '🏙️', 'asfalto, parchi urbani', '["metallo leggero","vetro"]', '["fiori urbani"]', '["bianco","giallo"]', '["Piccione corazzato"]', '["mercato di strada"]', 'comune', 'crediti +10%', null),
  ('industriale', 'Industriale', '⚙️', 'ferro, macchinari', '["rottami","batterie","chip"]', '["scintille","polvere di ferro"]', '["giallo","roccia"]', '["Drone errante"]', '["pezzo navicella"]', 'raro', 'pezzi navicella +30%', null)
ON CONFLICT (key) DO NOTHING;

-- ─── SEED: pikmin units ───
INSERT INTO public.pikmin_units (id, owner_agent, name, type_key, level, experience, experience_to_next, specialization_key, stats, preferred_biome, story, status) VALUES
  ('00000000-0000-4000-8000-000000000001', 'lorenzo', 'Fiamma', 'rosso', 4, 320, 500, 'combattimento', '{"forza":82,"velocita":55,"resistenza":70,"intelligenza":40}', 'bosco', 'Primo Pikmin addestrato da Lorenzo.', 'disponibile'),
  ('00000000-0000-4000-8000-000000000002', 'papa', 'Onda', 'blu', 3, 180, 350, 'raccolta', '{"forza":45,"velocita":60,"resistenza":65,"intelligenza":55}', 'acqua', 'Trovato vicino al litorale.', 'in_missione'),
  ('00000000-0000-4000-8000-000000000003', 'papa', 'Spark', 'giallo', 5, 610, 800, 'ricerca', '{"forza":35,"velocita":70,"resistenza":50,"intelligenza":90}', 'industriale', 'Esperto pezzi navicella.', 'disponibile'),
  ('00000000-0000-4000-8000-000000000004', 'lorenzo', 'Ombra', 'bianco', 2, 90, 200, 'spionaggio', '{"forza":30,"velocita":75,"resistenza":40,"intelligenza":85}', 'grotta', 'Osserva i mostri per il bestiario.', 'addestramento')
ON CONFLICT (id) DO NOTHING;

-- ─── SEED: villages + buildings ───
INSERT INTO public.villages (id, owner_agent, name, biome_key, is_primary, level)
VALUES
  ('00000000-0000-4000-8000-000000000010', 'papa', 'Colonia Francesco', 'bosco', true, 1),
  ('00000000-0000-4000-8000-000000000011', 'lorenzo', 'Base Lorenzo', 'giardino', true, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.village_buildings (village_id, building_key, name, emoji, level, max_level) VALUES
  ('00000000-0000-4000-8000-000000000010', 'centro_controllo', 'Centro di Controllo', '🎛️', 1, 5),
  ('00000000-0000-4000-8000-000000000010', 'magazzino', 'Magazzino', '📦', 1, 5),
  ('00000000-0000-4000-8000-000000000010', 'accademia', 'Accademia Pikmin', '🎓', 1, 4),
  ('00000000-0000-4000-8000-000000000010', 'laboratorio', 'Laboratorio', '🔬', 1, 4),
  ('00000000-0000-4000-8000-000000000010', 'mercato', 'Mercato', '🏪', 1, 3),
  ('00000000-0000-4000-8000-000000000010', 'hangar', 'Hangar Navicella', '🚀', 1, 3),
  ('00000000-0000-4000-8000-000000000011', 'centro_controllo', 'Centro di Controllo', '🎛️', 1, 5),
  ('00000000-0000-4000-8000-000000000011', 'magazzino', 'Magazzino', '📦', 1, 5),
  ('00000000-0000-4000-8000-000000000011', 'accademia', 'Accademia Pikmin', '🎓', 1, 4),
  ('00000000-0000-4000-8000-000000000011', 'laboratorio', 'Laboratorio', '🔬', 1, 4),
  ('00000000-0000-4000-8000-000000000011', 'mercato', 'Mercato', '🏪', 1, 3),
  ('00000000-0000-4000-8000-000000000011', 'hangar', 'Hangar Navicella', '🚀', 1, 3)
ON CONFLICT (village_id, building_key) DO NOTHING;

-- ─── SEED: inventory ───
INSERT INTO public.player_inventory (agent_key, item_key, item_name, emoji, category, quantity, sell_price) VALUES
  ('papa', 'cristallo_rame', 'Cristallo di rame', '💎', 'oggetto', 2, 120),
  ('papa', 'miele_dorato', 'Miele dorato', '🍯', 'ingrediente', 5, 30),
  ('lorenzo', 'batteria_usata', 'Batteria usata', '🔋', 'materiale', 3, 45),
  ('lorenzo', 'seme_rosso', 'Seme rosso', '🔴', 'ingrediente', 8, 15)
ON CONFLICT (agent_key, item_key) DO NOTHING;

-- ─── SEED: bestiary sample ───
INSERT INTO public.bestiary_entries (creature_key, name, emoji, biome_key, rarity, danger_level, weakness, discovered_by) VALUES
  ('bulborb_nano', 'Bulborb nano', '👾', 'bosco', 'comune', 2, 'attacco dorsale', 'lorenzo'),
  ('scarabee', 'Scarabée', '🪲', 'bosco', 'comune', 1, 'schiacciamento', 'francesco')
ON CONFLICT (creature_key) DO NOTHING;

-- ─── SEED: chat welcome ───
INSERT INTO public.family_chat_messages (channel, sender_agent, content, message_type) VALUES
  ('famiglia', 'papa', 'Missione Famiglia attiva. Centro Comando online.', 'text'),
  ('missioni', 'lorenzo', 'Ho trovato un pezzo della navicella.', 'quick');
