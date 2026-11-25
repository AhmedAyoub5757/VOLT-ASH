export interface RingCategory {
  id: string;
  title: string;
  caption: string;
  image: string;
  bgFocus: string;
  thumbFocus: string;
  thumbScale: number;
  tone: "photo" | "paint" | "ink";
  accent: string;
}

export const RING_CATEGORIES: RingCategory[] = [
  {
    id: "streetwear",
    title: "Streetwear",
    caption: "Raw city energy · Drop 01",
    image: "/assets/ring/ring-streetwear.jpg",
    bgFocus: "50% 45%",
    thumbFocus: "50% 42%",
    thumbScale: 1.35,
    tone: "photo",
    accent: "#cf0023",
  },
  {
    id: "casual",
    title: "Casual Wear",
    caption: "Effortless, every day · Drop 02",
    image: "/assets/ring/ring-casual.jpg",
    bgFocus: "50% 50%",
    thumbFocus: "50% 46%",
    thumbScale: 1.3,
    tone: "photo",
    accent: "#2d5a27",
  },
  {
    id: "smart-casual",
    title: "Smart Casual",
    caption: "Tailored confidence · Drop 03",
    image: "/assets/ring/ring-smart-casual.jpg",
    bgFocus: "50% 48%",
    thumbFocus: "50% 44%",
    thumbScale: 1.4,
    tone: "photo",
    accent: "#2d5a27",
  },
  {
    id: "activewear",
    title: "Activewear",
    caption: "Built for the sprint · Drop 04",
    image: "/assets/ring/ring-activewear.jpg",
    bgFocus: "50% 42%",
    thumbFocus: "48% 42%",
    thumbScale: 1.3,
    tone: "photo",
    accent: "#cf0023",
  },
  {
    id: "modest",
    title: "Modest Wear",
    caption: "Elegance in every fold · Drop 05",
    image: "/assets/ring/ring-modest.jpg",
    bgFocus: "50% 50%",
    thumbFocus: "50% 46%",
    thumbScale: 1.35,
    tone: "photo",
    accent: "#2d5a27",
  },
  {
    id: "boho",
    title: "Boho-Chic",
    caption: "Free-spirited, grounded · Drop 06",
    image: "/assets/ring/ring-boho.jpg",
    bgFocus: "50% 46%",
    thumbFocus: "50% 44%",
    thumbScale: 1.4,
    tone: "photo",
    accent: "#cf0023",
  },
];
