import { isAssetRef, parseAssetRef } from "./dioramaAssetRefs";
import { getDioramaAsset } from "./dioramaAssetStore";

const urlCache = new Map<string, string>();

/** Risolve diorama-asset:// → blob URL (cache in-memory) */
export async function resolveDioramaAssetUrl(src: string): Promise<string | undefined> {
  if (!isAssetRef(src)) return src;
  const id = parseAssetRef(src);
  if (!id) return undefined;

  const cached = urlCache.get(id);
  if (cached) return cached;

  const record = await getDioramaAsset(id);
  if (!record) return undefined;

  const url = URL.createObjectURL(record.blob);
  urlCache.set(id, url);
  return url;
}

export function revokeDioramaAssetUrl(id: string): void {
  const url = urlCache.get(id);
  if (url) {
    URL.revokeObjectURL(url);
    urlCache.delete(id);
  }
}

export function revokeAllDioramaAssetUrls(): void {
  for (const [id, url] of urlCache) {
    URL.revokeObjectURL(url);
    urlCache.delete(id);
  }
}

export function peekCachedAssetUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (!isAssetRef(src)) return src;
  const id = parseAssetRef(src);
  return id ? urlCache.get(id) : undefined;
}
