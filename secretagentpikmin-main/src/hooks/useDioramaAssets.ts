import { useCallback, useEffect, useState } from "react";
import type { BiomeKey } from "@/types/secretPikmin";
import type { DioramaLayout } from "@/data/dioramaLayouts";
import { saveDioramaLayout } from "@/hooks/useDioramaLayout";
import {
  applyAssetToLayout,
  type ApplyAssetInput,
} from "@/lib/diorama/applyDioramaAsset";
import { revokeDioramaAssetUrl } from "@/lib/diorama/dioramaAssetResolver";
import { downloadBiomeAssetPack, importBiomeAssetPack } from "@/lib/diorama/dioramaBiomePack";
import {
  deleteDioramaAsset,
  generateAssetId,
  listDioramaAssets,
  saveDioramaAsset,
  type DioramaAssetMeta,
  type DioramaAssetRecord,
} from "@/lib/diorama/dioramaAssetStore";

export function useDioramaAssets(biome: BiomeKey, layout: DioramaLayout, onLayoutChange: (l: DioramaLayout) => void) {
  const [assets, setAssets] = useState<DioramaAssetMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listDioramaAssets(biome);
      setAssets(list);
    } finally {
      setLoading(false);
    }
  }, [biome]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const persistLayout = useCallback(
    (next: DioramaLayout) => {
      saveDioramaLayout(biome, next);
      onLayoutChange(next);
    },
    [biome, onLayoutChange],
  );

  const uploadAsset = useCallback(
    async (file: File, input: Omit<ApplyAssetInput, "assetId">) => {
      const id = generateAssetId();
      const record: DioramaAssetRecord = {
        id,
        name: file.name,
        type: input.type,
        biome,
        mimeType: file.type || "image/webp",
        size: file.size,
        buildingKey: input.buildingKey,
        slot: input.slot,
        hotspotId: input.hotspotId,
        layerId: input.layerId,
        createdAt: Date.now(),
        blob: file,
      };
      await saveDioramaAsset(record);
      const next = applyAssetToLayout(layout, { ...input, assetId: id });
      persistLayout(next);
      await refresh();
      return id;
    },
    [biome, layout, persistLayout, refresh],
  );

  const applyExistingAsset = useCallback(
    async (meta: DioramaAssetMeta) => {
      const next = applyAssetToLayout(layout, {
        assetId: meta.id,
        type: meta.type,
        buildingKey: meta.buildingKey,
        slot: meta.slot,
        hotspotId: meta.hotspotId,
        layerId: meta.layerId,
      });
      persistLayout(next);
    },
    [layout, persistLayout],
  );

  const removeAsset = useCallback(
    async (id: string) => {
      await deleteDioramaAsset(id);
      revokeDioramaAssetUrl(id);
      await refresh();
    },
    [refresh],
  );

  const exportPack = useCallback(async () => {
    await downloadBiomeAssetPack(layout);
  }, [layout]);

  const importPack = useCallback(
    async (file: File) => {
      const text = await file.text();
      const raw = JSON.parse(text) as unknown;
      const { layout: imported, imported: count } = await importBiomeAssetPack(raw);
      persistLayout(imported);
      await refresh();
      return count;
    },
    [persistLayout, refresh],
  );

  return {
    assets,
    loading,
    refresh,
    uploadAsset,
    applyExistingAsset,
    removeAsset,
    exportPack,
    importPack,
  };
}
