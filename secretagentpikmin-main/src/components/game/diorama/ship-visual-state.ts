/** Tier visivo navicella — solo presentazione, dati da percent esistente. */
export type ShipVisualTier = "wreck" | "p25" | "p50" | "p75" | "complete";

export function shipVisualTier(percent: number): ShipVisualTier {
  if (percent >= 88) return "complete";
  if (percent >= 63) return "p75";
  if (percent >= 38) return "p50";
  if (percent >= 13) return "p25";
  return "wreck";
}

export const SHIP_TIER_LABEL: Record<ShipVisualTier, string> = {
  wreck: "Relitto",
  p25: "Riparazione 25%",
  p50: "Riparazione 50%",
  p75: "Riparazione 75%",
  complete: "Navicella completa",
};
