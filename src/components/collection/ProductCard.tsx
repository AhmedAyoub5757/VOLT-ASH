"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/data/products";

const BADGE_COLORS: Record<string, string> = {
  New: "var(--color-green)",
  Bestseller: "var(--color-red)",
  "Low Stock": "#b8862b",
};

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState<string | null>(null);

  const quickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(size);
    setTimeout(() => setAdded(null), 1400);
  };

  return (
    <Link href={`/product/${product.id}`} className="group relative flex flex-col gap-3">
      <div className="relative overflow-hidden" style={{ borderRadius: "16px", aspectRatio: "4 / 5" }}>
        <img
          src={`/assets/products/${product.image}`}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-ui)", background: BADGE_COLORS[product.badge], color: "var(--color-cream)" }}
          >
            {product.badge === "Low Stock" && product.stockCount ? `Only ${product.stockCount} left` : product.badge}
          </span>
        )}

        {/* Quick-add size row, revealed on hover */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "linear-gradient(0deg, rgba(20,24,18,0.75) 0%, transparent 100%)" }}
        >
          {added ? (
            <span className="text-[11px] font-medium" style={{ fontFamily: "var(--font-ui)", color: "var(--color-cream)" }}>
              ✓ Added — {added}
            </span>
          ) : (
            product.sizes.map((size) => {
              const outOfStock = product.outOfStockSizes.includes(size);
              return (
                <button
                  key={size}
                  disabled={outOfStock}
                  onClick={(e) => quickAdd(e, size)}
                  className="rounded-md px-2 py-1 text-[10px] font-medium"
                  style={{
                    fontFamily: "var(--font-ui)",
                    background: outOfStock ? "rgba(255,250,240,0.15)" : "rgba(255,250,240,0.9)",
                    color: outOfStock ? "rgba(255,250,240,0.4)" : "var(--color-ink)",
                    textDecoration: outOfStock ? "line-through" : "none",
                    cursor: outOfStock ? "not-allowed" : "pointer",
                  }}
                >
                  {size}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-[13px]" style={{ fontFamily: "var(--font-ui)", color: "var(--color-ink)" }}>
          {product.name}
        </span>
        <span className="text-[13px]" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
          ${product.price}
        </span>
      </div>
    </Link>
  );
}