-- Phase 4: Scambi famiglia, villaggi multipli, notifiche gioco

-- ─── Scambi P2P ───
CREATE TABLE IF NOT EXISTS public.family_trade_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent text NOT NULL REFERENCES public.family_members(agent_key) ON DELETE CASCADE,
  to_agent text NOT NULL REFERENCES public.family_members(agent_key) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending', 'accepted', 'rejected', 'cancelled', 'completed')),
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.family_trade_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES public.family_trade_offers(id) ON DELETE CASCADE,
  side text NOT NULL CHECK (side IN ('offer', 'request')),
  agent_key text NOT NULL,
  item_key text NOT NULL,
  item_name text NOT NULL,
  emoji text NOT NULL DEFAULT '📦',
  category text NOT NULL DEFAULT 'oggetto',
  quantity int NOT NULL DEFAULT 1 CHECK (quantity > 0),
  sell_price int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.family_trade_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES public.family_trade_offers(id) ON DELETE CASCADE,
  from_agent text NOT NULL,
  to_agent text NOT NULL,
  action text NOT NULL,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_family_trade_offers_from ON public.family_trade_offers(from_agent, status);
CREATE INDEX IF NOT EXISTS idx_family_trade_offers_to ON public.family_trade_offers(to_agent, status);
CREATE INDEX IF NOT EXISTS idx_family_trade_items_offer ON public.family_trade_items(offer_id);

-- ─── Villaggi multipli ───
ALTER TABLE public.villages
  ADD COLUMN IF NOT EXISTS action_radius_m int NOT NULL DEFAULT 150;

ALTER TABLE public.player_profiles
  ADD COLUMN IF NOT EXISTS active_village_id uuid REFERENCES public.villages(id) ON DELETE SET NULL;

-- ─── Notifiche gioco (leggero, parallelo a mission_notifications) ───
CREATE TABLE IF NOT EXISTS public.game_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text NOT NULL,
  kind text NOT NULL,
  title text NOT NULL,
  body text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_notifications_agent ON public.game_notifications(agent_key, read_at);

-- RLS
ALTER TABLE public.family_trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_trade_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "family open" ON public.family_trade_offers;
CREATE POLICY "family open" ON public.family_trade_offers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "family open" ON public.family_trade_items;
CREATE POLICY "family open" ON public.family_trade_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "family open" ON public.family_trade_history;
CREATE POLICY "family open" ON public.family_trade_history FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "family open" ON public.game_notifications;
CREATE POLICY "family open" ON public.game_notifications FOR ALL USING (true) WITH CHECK (true);

-- Sync legacy ship_parts_collected → spaceship_parts (no data loss)
UPDATE public.spaceship_parts sp
SET collected = true,
    collected_by = CASE
      WHEN c.collected_by IN ('papa', 'Francesco', 'francesco') THEN 'papa'
      WHEN c.collected_by IN ('lorenzo', 'Lorenzo') THEN 'lorenzo'
      ELSE c.collected_by
    END,
    collected_at = COALESCE(sp.collected_at, c.collected_at)
FROM public.ship_parts_collected c
WHERE sp.key = c.part_key AND sp.collected = false;

-- Map legacy-only keys to spaceship keys where names match
UPDATE public.spaceship_parts sp
SET collected = true,
    collected_by = CASE
      WHEN c.collected_by IN ('papa', 'Francesco', 'francesco') THEN 'papa'
      WHEN c.collected_by IN ('lorenzo', 'Lorenzo') THEN 'lorenzo'
      ELSE c.collected_by
    END,
    collected_at = COALESCE(sp.collected_at, c.collected_at)
FROM public.ship_parts_collected c
JOIN public.ship_parts legacy ON legacy.key = c.part_key
WHERE sp.key IN ('motore','antenna','cabina','modulo_energia','stabilizzatori','nucleo')
  AND (
    (legacy.key = 'motore' AND sp.key = 'motore') OR
    (legacy.key = 'antenna' AND sp.key = 'antenna') OR
    (legacy.key = 'cabina' AND sp.key = 'cabina') OR
    (legacy.key IN ('serbatoio','reattore') AND sp.key IN ('modulo_energia','nucleo')) OR
    (legacy.key IN ('giroscopio','carrello') AND sp.key = 'stabilizzatori')
  )
  AND sp.collected = false;
