import { useEffect, useState } from "react";
import { isAssetRef } from "@/lib/diorama/dioramaAssetRefs";
import { peekCachedAssetUrl, resolveDioramaAssetUrl } from "@/lib/diorama/dioramaAssetResolver";

/** Hook — risolve diorama-asset:// in blob URL per <img> */
export function useResolvedAssetUrl(src?: string): string | undefined {
  const [resolved, setResolved] = useState<string | undefined>(() => {
    if (!src) return undefined;
    if (!isAssetRef(src)) return src;
    return peekCachedAssetUrl(src);
  });

  useEffect(() => {
    if (!src) {
      setResolved(undefined);
      return;
    }
    if (!isAssetRef(src)) {
      setResolved(src);
      return;
    }
    let cancelled = false;
    resolveDioramaAssetUrl(src).then((url) => {
      if (!cancelled) setResolved(url);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return resolved;
}

/** Hook — true quando l'immagine (public o blob) è caricabile */
export function useAssetImageReady(src?: string): boolean {
  const resolved = useResolvedAssetUrl(src);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!resolved) {
      setReady(false);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setReady(true);
    };
    img.onerror = () => {
      if (!cancelled) setReady(false);
    };
    img.src = resolved;
    return () => {
      cancelled = true;
    };
  }, [resolved]);

  return ready;
}
