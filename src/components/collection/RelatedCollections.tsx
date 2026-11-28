import Link from "next/link";
import { CATEGORIES } from "@/lib/data/categories";

export default function RelatedCollections({ currentSlug }: { currentSlug: string }) {
  const others = CATEGORIES.filter((c) => c.slug !== currentSlug);

  return (
    <section className="w-full" style={{ background: "#ece6d6", padding: "10dvh 6dvh" }}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-center" style={{ fontFamily: "var(--font-ui)", color: "var(--color-green)" }}>
          Explore More
        </span>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {others.map((cat) => (
            <Link
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              className="group relative overflow-hidden rounded-[16px]"
              style={{ aspectRatio: "3 / 4" }}
            >
              <img src={`/assets/hero/${cat.slug}.jpg`} alt={cat.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(20,24,18,0.7) 0%, transparent 60%)" }} />
              <span
                className="absolute bottom-3 left-3 text-[13px] font-medium uppercase tracking-[0.1em]"
                style={{ fontFamily: "var(--font-ui)", color: "var(--color-cream)" }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}