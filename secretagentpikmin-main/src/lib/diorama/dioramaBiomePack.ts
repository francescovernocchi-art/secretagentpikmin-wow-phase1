import type { BiomeKey } from "@/types/secretPikmin";
import type { DioramaLayout } from "@/data/dioramaLayouts";
import { collectAssetRefsFromLayout } from "./applyDioramaAsset";
import { makeAssetRef } from "./dioramaAssetRefs";
import {
  blobToDataUrl,
  dataUrlToBlob,
  generateAssetId,
  getDioramaAsset,
  saveDioramaAsset,
  type DioramaAssetMeta,
  type DioramaAssetRecord,
} from "./dioramaAssetStore";

export const BIOME_PACK_VERSION = 1;

export interface BiomePackAssetEntry {
  id: string;
  ref: string;
  meta: DioramaAssetMeta;
  dataBase64: string;
}

export interface BiomeAssetPack {
  version: number;
  exportedAt: string;
  biome: BiomeKey;
  layout: DioramaLayout;
  assets: BiomePackAssetEntry[];
  /** Futuro: zip bundle — per ora JSON + base64 */
  format: "json-base64";
}

export async function exportBiomeAssetPack(layout: DioramaLayout): Promise<BiomeAssetPack> {
  const ids = collectAssetRefsFromLayout(layout);
  const assets: BiomePackAssetEntry[] = [];

  for (const id of ids) {
    const record = await getDioramaAsset(id);
    if (!record) continue;
    const dataBase64 = await blobToDataUrl(record.blob);
    const { blob: _b, ...meta } = record;
    assets.push({ id, ref: makeAssetRef(id), meta, dataBase64 });
  }

  return {
    version: BIOME_PACK_VERSION,
    exportedAt: new Date().toISOString(),
    biome: layout.biome,
    layout,
    assets,
    format: "json-base64",
  };
}

export async function downloadBiomeAssetPack(layout: DioramaLayout): Promise<void> {
  const pack = await exportBiomeAssetPack(layout);
  const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${layout.id}-biome-pack.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBiomeAssetPack(
  raw: unknown,
): Promise<{ layout: DioramaLayout; imported: number }> {
  if (!raw || typeof raw !== "object") throw new Error("Pacchetto non valido");
  const pack = raw as BiomeAssetPack;
  if (!pack.layout?.id || !Array.isArray(pack.assets))
    throw new Error("Formato pacchetto incompleto");

  let imported = 0;
  for (const entry of pack.assets) {
    const blob = await dataUrlToBlob(entry.dataBase64);
    const record: DioramaAssetRecord = {
      ...entry.meta,
      id: entry.id || generateAssetId(),
      blob,
      size: blob.size,
    };
    await saveDioramaAsset(record);
    imported++;
  }

  return { layout: pack.layout, imported };
}
