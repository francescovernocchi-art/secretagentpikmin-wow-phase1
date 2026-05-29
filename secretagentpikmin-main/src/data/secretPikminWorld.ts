import { Binoculars, BookOpen, Camera, Coins, Leaf, Map, Radar, Rocket, Shield, ShoppingBag, Sprout, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CoreMissionKey = "ship" | "debt" | "planet" | "bestiary";
export type PikminSpecializationKey = "raccolta" | "ricerca" | "scouting" | "spionaggio" | "trasporto" | "combattimento";

export const FAMILY_COMMAND = {
  title: "Secret Pikmin: Missione Famiglia",
  commander: "Francesco · Comandante",
  firstExplorer: "Lorenzo · Esploratore Junior",
  rule: "Gli utenti sono sempre Comandanti: le classi e le specializzazioni appartengono ai Pikmin.",
};

export const CORE_MISSIONS: Array<{
  key: CoreMissionKey;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  emoji: string;
  progressLabel: string;
  color: string;
}> = [
  {
    key: "ship",
    title: "Recupero navicella",
    short: "Ricostruisci il razzo pezzo dopo pezzo.",
    description: "Ogni pezzo trovato sulla mappa o sbloccato con una missione aggiorna la navicella visiva: motore, cabina, antenna, ali, nucleo energia e stabilizzatori.",
    icon: Rocket,
    emoji: "🚀",
    progressLabel: "Pezzi recuperati",
    color: "from-cyan-400/25 to-blue-600/10",
  },
  {
    key: "debt",
    title: "Debito del pianeta",
    short: "Vendi oggetti e reliquie al Market.",
    description: "Gli oggetti raccolti possono essere messi in vendita o convertiti in crediti per estinguere il debito del pianeta originario.",
    icon: Coins,
    emoji: "🪙",
    progressLabel: "Crediti versati",
    color: "from-amber-300/25 to-orange-600/10",
  },
  {
    key: "planet",
    title: "Cibo ed energia",
    short: "Trasforma frutta, ingredienti e cristalli.",
    description: "Frutta e ingredienti nutrono il pianeta. Cristalli, batterie e scintille diventano energia. Il morale sale quando la famiglia collabora.",
    icon: Zap,
    emoji: "⚡",
    progressLabel: "Riserve pianeta",
    color: "from-lime-300/25 to-emerald-600/10",
  },
  {
    key: "bestiary",
    title: "Classificazione esseri viventi",
    short: "Studia mostri e specie in giro.",
    description: "I Pikmin specializzati nello spionaggio osservano i mostri, trovano debolezze, abitudini, biomi preferiti e completano il bestiario.",
    icon: BookOpen,
    emoji: "📚",
    progressLabel: "Schede catalogate",
    color: "from-fuchsia-300/25 to-purple-600/10",
  },
];

export const PIKMIN_SPECIALIZATIONS: Array<{
  key: PikminSpecializationKey;
  title: string;
  icon: LucideIcon;
  emoji: string;
  duties: string[];
  bonuses: string[];
  bestTypes: string[];
}> = [
  {
    key: "raccolta",
    title: "Raccolta materiale",
    icon: Leaf,
    emoji: "🍃",
    duties: ["frutta", "ingredienti", "minerali", "materiali naturali"],
    bonuses: ["più resa", "raccolta rapida", "meno energia consumata"],
    bestTypes: ["Rosso", "Giallo", "Ghiaccio"],
  },
  {
    key: "ricerca",
    title: "Ricerca oggetti rari",
    icon: Radar,
    emoji: "📡",
    duties: ["pezzi navicella", "reliquie", "oggetti rari", "anomalie"],
    bonuses: ["raggio radar", "drop raro", "tracce nascoste"],
    bestTypes: ["Giallo", "Alato", "Bianco"],
  },
  {
    key: "scouting",
    title: "Scouting e mappatura",
    icon: Map,
    emoji: "🗺️",
    duties: ["biomi", "punti sicuri", "percorsi", "nuovi villaggi"],
    bonuses: ["visibilità mappa", "spedizioni rapide", "rischio ridotto"],
    bestTypes: ["Alato", "Blu", "Giallo"],
  },
  {
    key: "spionaggio",
    title: "Spionaggio mostri",
    icon: Binoculars,
    emoji: "👁️",
    duties: ["osservazione", "debolezze", "comportamento", "bestiario"],
    bonuses: ["dati extra", "debolezze svelate", "meno combattimenti inutili"],
    bestTypes: ["Bianco", "Alato", "Ghiaccio"],
  },
  {
    key: "trasporto",
    title: "Trasporto e logistica",
    icon: ShoppingBag,
    emoji: "🎒",
    duties: ["pezzi pesanti", "merci", "materiali", "consegne"],
    bonuses: ["peso trasportabile", "consegna rapida", "meno Pikmin necessari"],
    bestTypes: ["Viola", "Roccia", "Blu"],
  },
  {
    key: "combattimento",
    title: "Battaglia e difesa",
    icon: Shield,
    emoji: "🛡️",
    duties: ["difesa villaggio", "caccia", "scorta", "eventi notturni"],
    bonuses: ["danno", "resistenze", "protezione squadra"],
    bestTypes: ["Rosso", "Roccia", "Viola"],
  },
];

export const GEO_BIOME_RULES = [
  { key: "foresta", emoji: "🌿", label: "Bosco / Giardino", materials: ["foglie", "frutta", "legno", "nettare"], pikmin: ["Rosso", "Giallo"], threats: ["mostri piccoli"], bonus: "cibo + raccolta" },
  { key: "litorale", emoji: "🌊", label: "Acqua / Litorale", materials: ["alghe", "conchiglie", "gocce", "perle"], pikmin: ["Blu"], threats: ["acquatici"], bonus: "recupero + energia idrica" },
  { key: "roccioso", emoji: "🪨", label: "Rocce / Muri", materials: ["pietra", "cristalli", "minerali"], pikmin: ["Roccia", "Viola"], threats: ["corazzati"], bonus: "difesa + estrazione" },
  { key: "industriale", emoji: "⚙️", label: "Zona industriale", materials: ["rottami", "batterie", "metallo", "chip"], pikmin: ["Giallo", "Roccia"], threats: ["meccanici"], bonus: "pezzi navicella + crediti" },
  { key: "spaziale", emoji: "🚀", label: "Anomalia spaziale", materials: ["scintille", "nuclei", "reliquie"], pikmin: ["Luminoso", "Bianco"], threats: ["rari"], bonus: "ricerca + eventi speciali" },
];

export const SCANNER_TARGETS = [
  { type: "Pikmin selvatico", icon: Sprout, emoji: "🌱", note: "può unirsi alla squadra se il segnale arriva al 100%" },
  { type: "Oggetto raro", icon: Sparkles, emoji: "✨", note: "può essere venduto, studiato o usato per missioni" },
  { type: "Ingrediente", icon: Leaf, emoji: "🍯", note: "convertibile in cibo o ricette di supporto" },
  { type: "Mostro", icon: Camera, emoji: "👾", note: "fotografalo e invia Pikmin spia per completare la scheda" },
];
