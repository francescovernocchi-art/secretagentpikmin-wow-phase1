/** Prefisso URL virtuale per asset in IndexedDB — futuro: Supabase Storage path */
export const DIOASSET_SCHEME = "diorama-asset://";

export function makeAssetRef(id: string): string {
  return `${DIOASSET_SCHEME}${id}`;
}

export function parseAssetRef(url: string): string | null {
  if (!url.startsWith(DIOASSET_SCHEME)) return null;
  const id = url.slice(DIOASSET_SCHEME.length);
  return id.length > 0 ? id : null;
}

export function isAssetRef(url: string | undefined): url is string {
  return typeof url === "string" && url.startsWith(DIOASSET_SCHEME);
}

/** Path Supabase Storage futuro (non usato in V2.4) */
export function futureSupabaseStoragePath(biome: string, assetId: string, ext: string): string {
  return `diorama-assets/${biome}/${assetId}.${ext}`;
}
