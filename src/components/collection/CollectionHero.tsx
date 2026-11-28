"use client";

import { CATEGORIES } from "@/lib/data/categories";

export default function CollectionHero({ slug }: { slug: string }) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  const name = category?.name ?? slug;
  const tagline = category?.tagline ?? "";

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "56dvh" }}>
      <img
        src={`/assets/hero/${slug}.jpg`}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(0deg, rgba(20,24,18,0.75) 0%, rgba(20,24,18,0.25) 60%, rgba(20,24,18,0.45) 100%)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-end gap-2 px-[6dvh] pb-[5dvh]">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.4em]"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-cream)", opacity: 0.75 }}
        >
          Collection
        </span>
        <h1
          className="text-[clamp(2.2rem,6vw,4.5rem)]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-cream)", lineHeight: 1 }}
        >
          {name}
        </h1>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "rgba(255,250,240,0.8)", fontSize: 16 }}>
          {tagline}
        </p>
      </div>
    </section>
  );
}