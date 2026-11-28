"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PRODUCTS } from "@/lib/data/products";
import { FilterState, applyFilters } from "@/lib/filters";
import CollectionHero from "@/components/collection/CollectionHero";
import FilterBar from "@/components/collection/FilterBar";
import ProductCard from "@/components/collection/ProductCard";
import EmptyState from "@/components/collection/EmptyState";
import FitSizingGuide from "@/components/collection/FitSizingGuide";
import RelatedCollections from "@/components/collection/RelatedCollections";
import FAQSection from "@/components/home/FAQs";

export default function CollectionPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [filters, setFilters] = useState<FilterState>({
    sizes: [],
    fits: [],
    priceBand: null,
    sort: "bestseller",
  });

  const categoryProducts = useMemo(
    () => PRODUCTS.filter((p) => p.categorySlug === slug),
    [slug]
  );

  const filtered = useMemo(
    () => applyFilters(categoryProducts, filters),
    [categoryProducts, filters]
  );

  const resetAll = () => setFilters({ sizes: [], fits: [], priceBand: null, sort: filters.sort });

  return (
    <main>
      <CollectionHero slug={slug} />
      <FilterBar
        allProducts={categoryProducts}
        state={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      <section className="w-full" style={{ background: "var(--color-cream)", padding: "6dvh 6dvh 10dvh" }}>
        {filtered.length === 0 ? (
          <EmptyState onReset={resetAll} />
        ) : (
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <FitSizingGuide />
      <RelatedCollections currentSlug={slug} />
      <FAQSection />
    </main>
  );
}