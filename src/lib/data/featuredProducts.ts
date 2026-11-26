export interface FeaturedProduct {
  id: string;
  name: string;
  categorySlug: string;
  categoryLabel: string;
  price: string;
  imageAsset: string;
  blurb: string;
}

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "street-protocol-bomber",
    name: "Street Protocol Bomber",
    categorySlug: "streetwear",
    categoryLabel: "Streetwear",
    price: "$285",
    imageAsset: "streetwear-product.jpg",
    blurb: "Oversized, boxy, built for the block.",
  },
  {
    id: "soft-ground-tee",
    name: "Soft Ground Tee",
    categorySlug: "casual-wear",
    categoryLabel: "Casual Wear",
    price: "$95",
    imageAsset: "casual-wear-product.jpg",
    blurb: "Everyday fabric, nothing fighting for attention.",
  },
  {
    id: "quiet-leverage-blazer",
    name: "Quiet Leverage Blazer",
    categorySlug: "smart-casual",
    categoryLabel: "Smart Casual",
    price: "$340",
    imageAsset: "smart-casual-product.jpg",
    blurb: "Tailored structure, understated attitude.",
  },
  {
    id: "full-voltage-top",
    name: "Full Voltage Top",
    categorySlug: "activewear",
    categoryLabel: "Activewear",
    price: "$120",
    imageAsset: "activewear-product.jpg",
    blurb: "Technical knit mapped to real movement.",
  },
  {
    id: "quiet-architecture-dress",
    name: "Quiet Architecture Dress",
    categorySlug: "modest-wear",
    categoryLabel: "Modest Wear",
    price: "$265",
    imageAsset: "modest-wear-product.jpg",
    blurb: "Drape over restriction, every seam deliberate.",
  },
  {
    id: "wild-field-top",
    name: "Wild Field Top",
    categorySlug: "boho-chic",
    categoryLabel: "Boho-Chic",
    price: "$145",
    imageAsset: "boho-chic-product.jpg",
    blurb: "Crochet texture for golden-hour wandering.",
  },
];