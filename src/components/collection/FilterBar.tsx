"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Product } from "@/lib/data/products";
import { FilterState, SortKey, PRICE_BAND_LABELS, wouldBeEmpty, wouldPriceBandBeEmpty } from "@/lib/filters";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "bestseller", label: "Bestseller" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function FilterBar({
  allProducts,
  state,
  onChange,
  resultCount,
}: {
  allProducts: Product[];
  state: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
}) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const allSizes = Array.from(new Set(allProducts.flatMap((p) => p.sizes)));
  const allFits = Array.from(new Set(allProducts.map((p) => p.fit)));

  const toggleSize = (size: string) => {
    const has = state.sizes.includes(size);
    onChange({ ...state, sizes: has ? state.sizes.filter((s) => s !== size) : [...state.sizes, size] });
  };
  const toggleFit = (fit: string) => {
    const has = state.fits.includes(fit);
    onChange({ ...state, fits: has ? state.fits.filter((f) => f !== fit) : [...state.fits, fit] });
  };
  const setPriceBand = (band: string) => {
    onChange({ ...state, priceBand: state.priceBand === band ? null : band });
  };
  const resetAll = () => onChange({ sizes: [], fits: [], priceBand: null, sort: state.sort });

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...state.sizes.map((s) => ({ label: `Size: ${s}`, onRemove: () => toggleSize(s) })),
    ...state.fits.map((f) => ({ label: `Fit: ${f}`, onRemove: () => toggleFit(f) })),
    ...(state.priceBand ? [{ label: PRICE_BAND_LABELS[state.priceBand], onRemove: () => setPriceBand(state.priceBand!) }] : []),
  ];

  return (
    <div
      className="sticky top-0 z-30 w-full transition-all duration-300"
      style={{ background: "var(--color-cream)", borderBottom: "1px solid rgba(45,90,39,0.12)" }}
    >
      <div
        className="mx-auto flex max-w-[1400px] flex-col gap-4 transition-all duration-300"
        style={{ padding: compact ? "1.2dvh 6dvh" : "2.4dvh 6dvh" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Size filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-ui)", color: "rgba(26,26,26,0.5)" }}>
              Size
            </span>
            {allSizes.map((size) => {
              const active = state.sizes.includes(size);
              const disabled = !active && wouldBeEmpty(allProducts, state, "sizes", size);
              return (
                <button
                  key={size}
                  onClick={() => !disabled && toggleSize(size)}
                  disabled={disabled}
                  className="rounded-full border px-3 py-1 text-[12px] transition-colors"
                  style={{
                    fontFamily: "var(--font-ui)",
                    borderColor: active ? "var(--color-red)" : "rgba(26,26,26,0.2)",
                    background: active ? "var(--color-red)" : "transparent",
                    color: disabled ? "rgba(26,26,26,0.25)" : active ? "var(--color-cream)" : "var(--color-ink)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Fit filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-ui)", color: "rgba(26,26,26,0.5)" }}>
              Fit
            </span>
            {allFits.map((fit) => {
              const active = state.fits.includes(fit);
              const disabled = !active && wouldBeEmpty(allProducts, state, "fits", fit);
              return (
                <button
                  key={fit}
                  onClick={() => !disabled && toggleFit(fit)}
                  disabled={disabled}
                  className="rounded-full border px-3 py-1 text-[12px] transition-colors"
                  style={{
                    fontFamily: "var(--font-ui)",
                    borderColor: active ? "var(--color-green)" : "rgba(26,26,26,0.2)",
                    background: active ? "var(--color-green)" : "transparent",
                    color: disabled ? "rgba(26,26,26,0.25)" : active ? "var(--color-cream)" : "var(--color-ink)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  {fit}
                </button>
              );
            })}
          </div>

          {/* Price filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-ui)", color: "rgba(26,26,26,0.5)" }}>
              Price
            </span>
            {Object.entries(PRICE_BAND_LABELS).map(([band, label]) => {
              const active = state.priceBand === band;
              const disabled = !active && wouldPriceBandBeEmpty(allProducts, state, band);
              return (
                <button
                  key={band}
                  onClick={() => !disabled && setPriceBand(band)}
                  disabled={disabled}
                  className="rounded-full border px-3 py-1 text-[12px] transition-colors"
                  style={{
                    fontFamily: "var(--font-ui)",
                    borderColor: active ? "var(--color-ink)" : "rgba(26,26,26,0.2)",
                    background: active ? "var(--color-ink)" : "transparent",
                    color: disabled ? "rgba(26,26,26,0.25)" : active ? "var(--color-cream)" : "var(--color-ink)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <select
            value={state.sort}
            onChange={(e) => onChange({ ...state, sort: e.target.value as SortKey })}
            className="rounded-full border px-4 py-1.5 text-[12px] outline-none"
            style={{ fontFamily: "var(--font-ui)", borderColor: "rgba(26,26,26,0.2)", background: "transparent", color: "var(--color-ink)" }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Active chips + result count */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px]"
                style={{ fontFamily: "var(--font-ui)", background: "rgba(45,90,39,0.1)", color: "var(--color-ink)" }}
              >
                {chip.label}
                <button onClick={chip.onRemove} aria-label={`Remove ${chip.label}`}>
                  <X size={11} />
                </button>
              </span>
            ))}
            {activeChips.length > 0 && (
              <button
                onClick={resetAll}
                className="text-[11px] underline"
                style={{ fontFamily: "var(--font-ui)", color: "var(--color-red)" }}
              >
                Reset all
              </button>
            )}
          </div>
          <span className="text-[12px]" style={{ fontFamily: "var(--font-ui)", color: "rgba(26,26,26,0.55)" }}>
            {resultCount} {resultCount === 1 ? "piece" : "pieces"}
          </span>
        </div>
      </div>
    </div>
  );
}