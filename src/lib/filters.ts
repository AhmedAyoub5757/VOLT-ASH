import { Product } from "@/lib/data/products";

export type SortKey = "bestseller" | "price-asc" | "price-desc" | "newest";

export interface FilterState {
  sizes: string[];
  fits: string[];
  priceBand: string | null; // "under-100" | "100-200" | "200-plus"
  sort: SortKey;
}

export const PRICE_BANDS: Record<string, (p: number) => boolean> = {
  "under-100": (p) => p < 100,
  "100-200": (p) => p >= 100 && p <= 200,
  "200-plus": (p) => p > 200,
};

export const PRICE_BAND_LABELS: Record<string, string> = {
  "under-100": "Under $100",
  "100-200": "$100 – $200",
  "200-plus": "$200+",
};

export function applyFilters(products: Product[], state: FilterState): Product[] {
  let result = products;
  if (state.sizes.length) {
    result = result.filter((p) => state.sizes.some((s) => p.sizes.includes(s) && !p.outOfStockSizes.includes(s)));
  }
  if (state.fits.length) {
    result = result.filter((p) => state.fits.includes(p.fit));
  }
  if (state.priceBand) {
    const test = PRICE_BANDS[state.priceBand];
    result = result.filter((p) => test(p.price));
  }
  return sortProducts(result, state.sort);
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "newest":
      return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "bestseller":
    default:
      return arr.sort((a, b) => (b.badge === "Bestseller" ? 1 : 0) - (a.badge === "Bestseller" ? 1 : 0));
  }
}

// Given the current state minus one dimension, would toggling `value` on for `key` yield 0 results?
export function wouldBeEmpty(
  products: Product[],
  state: FilterState,
  key: "sizes" | "fits",
  value: string
): boolean {
  const nextState: FilterState = {
    ...state,
    [key]: state[key].includes(value) ? state[key] : [...state[key], value],
  };
  return applyFilters(products, nextState).length === 0;
}

export function wouldPriceBandBeEmpty(products: Product[], state: FilterState, band: string): boolean {
  const nextState: FilterState = { ...state, priceBand: band };
  return applyFilters(products, nextState).length === 0;
}