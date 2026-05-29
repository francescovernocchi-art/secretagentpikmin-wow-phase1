-- Phase 3: XP Pikmin, bestiario avanzato, log attività, spedizioni unità

ALTER TABLE public.pikmin_units
  ADD COLUMN IF NOT EXISTS spec_badge text,
  ADD COLUMN IF NOT EXISTS total_xp_earned int NOT NULL DEFAULT 0;

ALTER TABLE public.bestiary_entries
  ADD COLUMN IF NOT EXISTS study_status text NOT NULL DEFAULT 'avvistato'
    CHECK (study_status IN ('avvistato', 'studiato', 'classificato')),
  ADD COLUMN IF NOT EXISTS data_points int NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS weakness_unlocked boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.pikmin_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pikmin_id uuid NOT NULL,
  owner_agent text NOT NULL,
  reason text NOT NULL,
  xp_amount int NOT NULL DEFAULT 0,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pikmin_expedition_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expedition_id uuid NOT NULL,
  pikmin_unit_id uuid NOT NULL,
  owner_agent text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (expedition_id, pikmin_unit_id)
);

CREATE INDEX IF NOT EXISTS idx_pikmin_activity_log_pikmin ON public.pikmin_activity_log(pikmin_id);
CREATE INDEX IF NOT EXISTS idx_pikmin_activity_log_agent ON public.pikmin_activity_log(owner_agent);

ALTER TABLE public.pikmin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pikmin_expedition_units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "family open" ON public.pikmin_activity_log;
CREATE POLICY "family open" ON public.pikmin_activity_log FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "family open" ON public.pikmin_expedition_units;
CREATE POLICY "family open" ON public.pikmin_expedition_units FOR ALL USING (true) WITH CHECK (true);

-- Aggiorna bestiario seed con study_status
UPDATE public.bestiary_entries SET study_status = 'studiato', data_points = 3 WHERE scan_count >= 2;
UPDATE public.bestiary_entries SET study_status = 'classificato', weakness_unlocked = true, data_points = 5 WHERE scan_count >= 4;
