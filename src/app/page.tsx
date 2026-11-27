import Hero from "@/components/home/Hero";
// import CategoryRing from "@/components/home/CategoryRing";
import CategoryRings from "@/components/home/CategoryRings";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import LookbookRunway from "@/components/home/LookbookRunway";
import BrandManifesto from "@/components/home/BrandManifesto";

import "../styles/tokens.css";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* <CategoryRing /> */}
      <CategoryRings />
      <FeaturedProducts />
      <LookbookRunway />
      <BrandManifesto />
    </main>
  );
}
