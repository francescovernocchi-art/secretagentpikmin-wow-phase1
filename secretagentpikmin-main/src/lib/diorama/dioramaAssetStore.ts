import type { BiomeKey } from "@/types/secretPikmin";
import type { BuildingKey } from "@/components/game/diorama/diorama-data";
import type { DioramaBuildingAssetSlots, DioramaHangarStage } from "@/data/dioramaLayouts";

export type DioramaAssetType = "background" | "building" | "hangar" | "hotspot" | "decoration";

export type DioramaBuildingSlot = keyof DioramaBuildingAssetSlots;
export type DioramaAssetSlot = DioramaBuildingSlot | DioramaHangarStage;

export interface DioramaAssetMeta {
  id: string;
  name: string;
  type: DioramaAssetType;
  biome: BiomeKey;
  mimeType: string;
  size: number;
  buildingKey?: BuildingKey | "serra";
  slot?: DioramaAssetSlot;
  hotspotId?: string;
  layerId?: string;
  createdAt: number;
}

export interface DioramaAssetRecord extends DioramaAssetMeta {
  blob: Blob;
}

const DB_NAME = "secret-pikmin-diorama-assets";
const DB_VERSION = 1;
const STORE = "assets";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: "id" });
        os.createIndex("biome", "biome", { unique: false });
        os.createIndex("type", "type", { unique: false });
      }
    };
  });
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function generateAssetId(): string {
  return `da-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function saveDioramaAsset(record: DioramaAssetRecord): Promise<void> {
  const db = await openDb();
  try {
    await reqToPromise(db.transaction(STORE, "readwrite").objectStore(STORE).put(record));
  } finally {
    db.close();
  }
}

export async function getDioramaAsset(id: string): Promise<DioramaAssetRecord | null> {
  const db = await openDb();
  try {
    const row = await reqToPromise(db.transaction(STORE, "readonly").objectStore(STORE).get(id));
    return (row as DioramaAssetRecord | undefined) ?? null;
  } finally {
    db.close();
  }
}

export async function deleteDioramaAsset(id: string): Promise<void> {
  const db = await openDb();
  try {
    await reqToPromise(db.transaction(STORE, "readwrite").objectStore(STORE).delete(id));
  } finally {
    db.close();
  }
}

export async function listDioramaAssets(biome?: BiomeKey): Promise<DioramaAssetMeta[]> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const all = await reqToPromise(store.getAll() as IDBRequest<DioramaAssetRecord[]>);
    return all
      .filter((a) => !biome || a.biome === biome)
      .map(({ blob: _b, ...meta }) => meta)
      .sort((a, b) => b.createdAt - a.createdAt);
  } finally {
    db.close();
  }
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
