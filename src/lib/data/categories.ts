export interface Category {
  slug: string;
  name: string;
  tagline: string;
}

export const CATEGORIES: Category[] = [
  { slug: "streetwear", name: "Streetwear", tagline: "Raw city energy" },
  { slug: "casual-wear", name: "Casual Wear", tagline: "Effortless, every day" },
  { slug: "smart-casual", name: "Smart Casual", tagline: "Tailored confidence" },
  { slug: "activewear", name: "Activewear", tagline: "Built for motion" },
  { slug: "modest-wear", name: "Modest Wear", tagline: "Quiet architecture" },
  { slug: "boho-chic", name: "Boho-Chic", tagline: "Free-spirited, grounded" },
];