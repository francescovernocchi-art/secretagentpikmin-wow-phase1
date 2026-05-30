-- Initial colonies must feel newly landed, not fully built.
UPDATE public.village_buildings
SET name = 'Capsula comando', emoji = '🛸', level = 1, status = 'level_1'
WHERE village_id IN ('00000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000011')
  AND building_key = 'centro_controllo';

UPDATE public.village_buildings
SET name = 'Piccolo deposito', emoji = '📦', level = 1, status = 'level_1'
WHERE village_id IN ('00000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000011')
  AND building_key = 'magazzino';

UPDATE public.village_buildings
SET name = 'Navicella danneggiata', emoji = '🚀', level = 0, status = 'under_construction'
WHERE village_id IN ('00000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000011')
  AND building_key = 'hangar';

UPDATE public.village_buildings
SET level = 0, status = 'locked'
WHERE village_id IN ('00000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000011')
  AND building_key = 'accademia';

UPDATE public.village_buildings
SET level = 0, status = 'under_construction'
WHERE village_id IN ('00000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000011')
  AND building_key = 'laboratorio';

UPDATE public.village_buildings
SET level = 0, status = 'buildable'
WHERE village_id IN ('00000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000011')
  AND building_key = 'mercato';
