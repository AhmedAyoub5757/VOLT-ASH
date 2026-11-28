export interface Product {
  id: string;
  name: string;
  categorySlug: string;
  price: number;
  fit: "Relaxed" | "Tailored" | "Oversized" | "Fitted";
  sizes: string[];
  outOfStockSizes: string[];
  image: string;
  badge?: "New" | "Bestseller" | "Low Stock";
  stockCount?: number;
  createdAt: string;
}

const SIZES = ["XS", "S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  // ── STREETWEAR (6) ──────────────────────────────────────
  { id: "street-protocol-bomber", name: "Street Protocol Bomber", categorySlug: "streetwear", price: 285, fit: "Oversized", sizes: SIZES, outOfStockSizes: ["XS"], image: "streetwear-product.jpg", badge: "Bestseller", createdAt: "2026-08-01" },
  { id: "cargo-utility-trousers", name: "Cargo Utility Trousers", categorySlug: "streetwear", price: 180, fit: "Relaxed", sizes: SIZES, outOfStockSizes: [], image: "streetwear-2.jpg", createdAt: "2026-08-01" },
  { id: "block-hoodie", name: "Block Hoodie", categorySlug: "streetwear", price: 165, fit: "Oversized", sizes: SIZES, outOfStockSizes: ["XL"], image: "streetwear-3.jpg", badge: "New", createdAt: "2026-11-10" },
  { id: "graffiti-line-tee", name: "Graffiti Line Tee", categorySlug: "streetwear", price: 85, fit: "Oversized", sizes: SIZES, outOfStockSizes: [], image: "streetwear-4.jpg", createdAt: "2026-06-15" },
  { id: "night-shift-track-pant", name: "Night Shift Track Pant", categorySlug: "streetwear", price: 150, fit: "Relaxed", sizes: SIZES, outOfStockSizes: ["S", "XS"], image: "streetwear-5.jpg", badge: "Low Stock", stockCount: 3, createdAt: "2026-05-20" },
  { id: "asphalt-cap", name: "Asphalt Panel Cap", categorySlug: "streetwear", price: 65, fit: "Relaxed", sizes: ["One Size"], outOfStockSizes: [], image: "streetwear-6.jpg", createdAt: "2026-09-05" },

  // ── CASUAL WEAR (4) ─────────────────────────────────────
  { id: "soft-ground-tee", name: "Soft Ground Tee", categorySlug: "casual-wear", price: 95, fit: "Relaxed", sizes: SIZES, outOfStockSizes: [], image: "casual-wear-product.jpg", badge: "Bestseller", createdAt: "2026-07-01" },
  { id: "relaxed-straight-trousers", name: "Relaxed Straight Trousers", categorySlug: "casual-wear", price: 140, fit: "Relaxed", sizes: SIZES, outOfStockSizes: ["XL"], image: "casual-wear-2.jpg", createdAt: "2026-07-01" },
  { id: "weekend-overshirt", name: "Weekend Overshirt", categorySlug: "casual-wear", price: 135, fit: "Oversized", sizes: SIZES, outOfStockSizes: [], image: "casual-wear-3.jpg", badge: "New", createdAt: "2026-11-12" },
  { id: "courtyard-linen-shirt", name: "Courtyard Linen Shirt", categorySlug: "casual-wear", price: 110, fit: "Relaxed", sizes: SIZES, outOfStockSizes: [], image: "casual-wear-4.jpg", createdAt: "2026-04-18" },

  // ── SMART CASUAL (5) ────────────────────────────────────
  { id: "quiet-leverage-blazer", name: "Quiet Leverage Blazer", categorySlug: "smart-casual", price: 340, fit: "Tailored", sizes: SIZES, outOfStockSizes: [], image: "smart-casual-product.jpg", badge: "Bestseller", createdAt: "2026-08-15" },
  { id: "tailored-wool-trousers", name: "Tailored Wool Trousers", categorySlug: "smart-casual", price: 220, fit: "Tailored", sizes: SIZES, outOfStockSizes: ["XS"], image: "smart-casual-2.jpg", createdAt: "2026-08-15" },
  { id: "knit-polo", name: "Structured Knit Polo", categorySlug: "smart-casual", price: 125, fit: "Tailored", sizes: SIZES, outOfStockSizes: [], image: "smart-casual-3.jpg", badge: "New", createdAt: "2026-11-05" },
  { id: "loafer-leather", name: "Minimal Leather Loafer", categorySlug: "smart-casual", price: 260, fit: "Tailored", sizes: ["38", "39", "40", "41", "42"], outOfStockSizes: [], image: "smart-casual-4.jpg", createdAt: "2026-02-10" },
  { id: "silk-blend-shirt", name: "Silk-Blend Shirt", categorySlug: "smart-casual", price: 175, fit: "Tailored", sizes: SIZES, outOfStockSizes: ["XL"], image: "smart-casual-5.jpg", badge: "Low Stock", stockCount: 4, createdAt: "2026-01-28" },

  // ── ACTIVEWEAR (3) ──────────────────────────────────────
  { id: "full-voltage-top", name: "Full Voltage Top", categorySlug: "activewear", price: 120, fit: "Fitted", sizes: SIZES, outOfStockSizes: [], image: "activewear-product.jpg", badge: "Bestseller", createdAt: "2026-07-20" },
  { id: "compression-leggings", name: "Compression Leggings", categorySlug: "activewear", price: 110, fit: "Fitted", sizes: SIZES, outOfStockSizes: ["XL"], image: "activewear-2.jpg", createdAt: "2026-07-20" },
  { id: "sprint-jacket", name: "Sprint Shell Jacket", categorySlug: "activewear", price: 195, fit: "Fitted", sizes: SIZES, outOfStockSizes: [], image: "activewear-3.jpg", badge: "New", createdAt: "2026-11-18" },

  // ── MODEST WEAR (4) ─────────────────────────────────────
  { id: "quiet-architecture-dress", name: "Quiet Architecture Dress", categorySlug: "modest-wear", price: 265, fit: "Relaxed", sizes: SIZES, outOfStockSizes: [], image: "modest-wear-product.jpg", badge: "Bestseller", createdAt: "2026-08-25" },
  { id: "cream-wrap-layer", name: "Cream Wrap Layer", categorySlug: "modest-wear", price: 195, fit: "Relaxed", sizes: SIZES, outOfStockSizes: ["XS"], image: "modest-wear-2.jpg", createdAt: "2026-08-25" },
  { id: "long-sleeve-tunic", name: "Long Sleeve Tunic", categorySlug: "modest-wear", price: 150, fit: "Relaxed", sizes: SIZES, outOfStockSizes: [], image: "modest-wear-3.jpg", badge: "New", createdAt: "2026-11-08" },
  { id: "wide-leg-trouser-set", name: "Wide Leg Trouser Set", categorySlug: "modest-wear", price: 210, fit: "Relaxed", sizes: SIZES, outOfStockSizes: [], image: "modest-wear-4.jpg", createdAt: "2026-04-02" },

  // ── BOHO-CHIC (3) ────────────────────────────────────────
  { id: "wild-field-top", name: "Wild Field Top", categorySlug: "boho-chic", price: 145, fit: "Relaxed", sizes: SIZES, outOfStockSizes: [], image: "boho-chic-product.jpg", badge: "Bestseller", createdAt: "2026-07-10" },
  { id: "fringed-kimono-jacket", name: "Fringed Kimono Jacket", categorySlug: "boho-chic", price: 210, fit: "Relaxed", sizes: SIZES, outOfStockSizes: ["XL"], image: "boho-chic-2.jpg", createdAt: "2026-07-10" },
  { id: "embroidered-maxi-dress", name: "Embroidered Maxi Dress", categorySlug: "boho-chic", price: 230, fit: "Relaxed", sizes: SIZES, outOfStockSizes: [], image: "boho-chic-3.jpg", badge: "New", createdAt: "2026-11-02" },
];