import { useCallback, useEffect, useMemo, useState } from "react";
import type { BiomeKey } from "@/types/secretPikmin";
import {
  type DioramaLayout,
  getDefaultLayout,
  mergeLayout,
  resolveLayoutBiome,
  storageKeyForBiome,
} from "@/data/dioramaLayouts";
import { useAssetImageReady } from "@/hooks/useResolvedAssetUrl";

function readStoredLayout(biome: BiomeKey): Partial<DioramaLayout> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKeyForBiome(biome));
    if (!raw) return null;
    return JSON.parse(raw) as Partial<DioramaLayout>;
  } catch {
    return null;
  }
}

export function saveDioramaLayout(biome: BiomeKey, layout: DioramaLayout): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKeyForBiome(biome), JSON.stringify(layout));
}

export function clearDioramaLayoutOverride(biome: BiomeKey): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKeyForBiome(biome));
}

export function useDioramaLayout(biomeInput?: string | BiomeKey) {
  const biome = resolveLayoutBiome(biomeInput ?? "bosco");

  const [override, setOverride] = useState<Partial<DioramaLayout> | null>(() => readStoredLayout(biome));

  useEffect(() => {
    setOverride(readStoredLayout(biome));
  }, [biome]);

  const layout = useMemo(
    () => mergeLayout(getDefaultLayout(biome), override ?? {}),
    [biome, override],
  );

  const persist = useCallback(
    (next: DioramaLayout) => {
      saveDioramaLayout(biome, next);
      setOverride(next);
    },
    [biome],
  );

  const reset = useCallback(() => {
    clearDioramaLayoutOverride(biome);
    setOverride(null);
  }, [biome]);

  return { layout, biome, persist, reset, hasOverride: override != null };
}

/** Verifica se lo sfondo public esiste */
export function useDioramaBackgroundReady(src?: string): boolean {
  return useAssetImageReady(src);
}

export function useEngineMode(layout: DioramaLayout): "image" | "css" {
  const bgReady = useDioramaBackgroundReady(layout.backgroundImage);
  if (layout.forceCssFallback) return "css";
  if (layout.backgroundImage && bgReady) return "image";
  return "css";
}
