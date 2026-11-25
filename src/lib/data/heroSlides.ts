export interface PressItem {
  rating: number; // 0–5
  label: string;
  quote: string;
}

export interface HeroStats {
  construction: string;
  silhouette: string;
  fabrication: string;
  weight: string;
  region: string;
  fit: string;
  colorway: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  category: string;
  titleLines: string[];
  season: string;
  stylist: string;
  imageAsset: string; // filename in /public/images/assets/hero/
  press: PressItem[];
  description: string;
  stats: HeroStats;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "streetwear",
    eyebrow: "SS26 DROP · VOLT & ASH STUDIO",
    category: "STREETWEAR",
    titleLines: ["STREET", "PROTOCOL"],
    season: "SS26",
    stylist: "MARA VOSS",
    imageAsset: "streetwear.jpg",
    press: [
      { rating: 5, label: "STUDIO REVIEW", quote: "RAW CITY ENERGY" },
      { rating: 4, label: "FIT NOTES", quote: "LOOSE, NOT SLOPPY" },
      { rating: 5, label: "EDITOR'S PICK", quote: "THE OPENING STATEMENT" },
    ],
    description:
      "Oversized layers built for the block, not the runway. Street Protocol pairs a boxy bomber with cargo fullness, engineered so the silhouette holds its shape whether you're standing still or moving fast.",
    stats: {
      construction: "RIBBED CUFF, BOXY FIT",
      silhouette: "OVERSIZED, DROPPED SHOULDER",
      fabrication: "COTTON-NYLON BLEND",
      weight: "380GSM",
      region: "MADE IN PORTUGAL",
      fit: "OVERSIZED",
      colorway: "ASH GREEN · CREAM",
    },
  },
  {
    id: "casual-wear",
    eyebrow: "SS26 DROP · VOLT & ASH STUDIO",
    category: "CASUAL WEAR",
    titleLines: ["SOFT", "GROUND"],
    season: "SS26",
    stylist: "DIEGO AMARI",
    imageAsset: "casual-wear.jpg",
    press: [
      { rating: 5, label: "STUDIO REVIEW", quote: "EFFORTLESS, NOT LAZY" },
      { rating: 4, label: "FIT NOTES", quote: "MOVES WITH YOU" },
      { rating: 4, label: "EDITOR'S PICK", quote: "AN EVERYDAY STAPLE" },
    ],
    description:
      "Built for the in-between hours. Soft Ground keeps a relaxed tee and straight-leg trouser pairing honest — simple fabrics, simple lines, nothing fighting for attention.",
    stats: {
      construction: "GARMENT-WASHED, DOUBLE-STITCH HEM",
      silhouette: "RELAXED, STRAIGHT LEG",
      fabrication: "COMBED COTTON JERSEY",
      weight: "220GSM",
      region: "MADE IN PORTUGAL",
      fit: "RELAXED",
      colorway: "CREAM · ASH GREEN",
    },
  },
  {
    id: "smart-casual",
    eyebrow: "AW25 DROP · VOLT & ASH STUDIO",
    category: "SMART CASUAL",
    titleLines: ["QUIET", "LEVERAGE"],
    season: "AW25",
    stylist: "RENA OKOYE",
    imageAsset: "smart-casual.jpg",
    press: [
      { rating: 5, label: "STUDIO REVIEW", quote: "TAILORED CONFIDENCE" },
      { rating: 5, label: "FIT NOTES", quote: "SHARP WITHOUT TRYING" },
      { rating: 4, label: "EDITOR'S PICK", quote: "BOARDROOM TO STREET" },
    ],
    description:
      "A tailored blazer cut to move between meetings and the street without missing a beat. Quiet Leverage keeps the structure precise and the attitude understated.",
    stats: {
      construction: "HALF-CANVAS, NOTCH LAPEL",
      silhouette: "TAILORED, SLIM",
      fabrication: "WOOL-BLEND SUITING",
      weight: "360GSM",
      region: "MADE IN PORTUGAL",
      fit: "TAILORED",
      colorway: "DEEP GREEN · CREAM",
    },
  },
  {
    id: "activewear",
    eyebrow: "SS26 DROP · VOLT & ASH STUDIO",
    category: "ACTIVEWEAR",
    titleLines: ["FULL", "VOLTAGE"],
    season: "SS26",
    stylist: "DIEGO AMARI",
    imageAsset: "activewear.jpg",
    press: [
      { rating: 5, label: "STUDIO REVIEW", quote: "BUILT FOR THE SPRINT" },
      { rating: 5, label: "FIT NOTES", quote: "COMPRESSION DONE RIGHT" },
      { rating: 4, label: "EDITOR'S PICK", quote: "PERFORMANCE, ENGINEERED" },
    ],
    description:
      "Technical fabric mapped to the body's actual movement lines. Full Voltage pairs four-way-stretch leggings with a seamless top, the red piping tracing exactly where the strain hits.",
    stats: {
      construction: "FLATLOCK SEAM, COMPRESSION PANEL",
      silhouette: "FITTED, ATHLETIC",
      fabrication: "RECYCLED PERFORMANCE KNIT",
      weight: "260GSM",
      region: "MADE IN PORTUGAL",
      fit: "FITTED",
      colorway: "CREAM · SIGNAL RED",
    },
  },
  {
    id: "modest-wear",
    eyebrow: "AW25 DROP · VOLT & ASH STUDIO",
    category: "MODEST WEAR",
    titleLines: ["QUIET", "ARCHITECTURE"],
    season: "AW25",
    stylist: "RENA OKOYE",
    imageAsset: "modest-wear.jpg",
    press: [
      { rating: 5, label: "STUDIO REVIEW", quote: "ELEGANCE IN EVERY FOLD" },
      { rating: 5, label: "FIT NOTES", quote: "FLOWS, NEVER CLINGS" },
      { rating: 4, label: "EDITOR'S PICK", quote: "A QUIET STATEMENT" },
    ],
    description:
      "A multi-layered silhouette built on heritage craft and movement, not restriction. Quiet Architecture pairs an intricately embroidered tunic and wide-leg silk trousers with a flowing organza shawl, every seam placed to let the fabric command the space on its own terms.",
    stats: {
      construction: "FULL LINING, FRENCH SEAM",
      silhouette: "FLOWING, FULL-LENGTH",
      fabrication: "CREPE-BACK SATIN",
      weight: "210GSM",
      region: "MADE IN PORTUGAL",
      fit: "RELAXED",
      colorway: "DEEP GREEN · CREAM",
    },
  },
  {
    id: "boho-chic",
    eyebrow: "SS26 DROP · VOLT & ASH STUDIO",
    category: "BOHEMIAN (BOHO-CHIC)",
    titleLines: ["WILD", "FIELD"],
    season: "SS26",
    stylist: "MARA VOSS",
    imageAsset: "boho-chic.jpg",
    press: [
      { rating: 5, label: "STUDIO REVIEW", quote: "FREE-SPIRITED, GROUNDED" },
      { rating: 4, label: "FIT NOTES", quote: "LAYERS THAT BREATHE" },
      { rating: 5, label: "EDITOR'S PICK", quote: "THE SEASON'S ROMANTIC" },
    ],
    description:
      "Crochet detailing and a fringed layer built for golden-hour wandering. Wild Field pairs soft texture with earthy movement, a single woven accent keeping it tethered to the line.",
    stats: {
      construction: "HAND-FINISHED CROCHET TRIM",
      silhouette: "FLOWING, LAYERED",
      fabrication: "COTTON GAUZE · FRINGE KNIT",
      weight: "190GSM",
      region: "MADE IN PORTUGAL",
      fit: "RELAXED",
      colorway: "CREAM · ASH GREEN",
    },
  },
];
