import Hero from "@/components/home/Hero";
// import CategoryRing from "@/components/home/CategoryRing";
import CategoryRings from "@/components/home/CategoryRings";

import "../styles/tokens.css";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* <CategoryRing /> */}
      <CategoryRings />
    </main>
  );
}