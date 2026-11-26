"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { FEATURED_PRODUCTS } from "@/lib/data/featuredProducts";

const AUTO_ROTATE_MS = 5000;
const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function FeaturedProducts() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayedIdx, setDisplayedIdx] = useState(0);
  const [isWiping, setIsWiping] = useState(false);
  const [wipeDirection, setWipeDirection] = useState<"down" | "up">("down");
  const [progress, setProgress] = useState(0);

  // Parallax tracking (only for gentle image tilt & ambient glow)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);

  const activeIdxRef = useRef(0);
  activeIdxRef.current = activeIdx;

  const isWipingRef = useRef(false);
  isWipingRef.current = isWiping;

  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const active = FEATURED_PRODUCTS[displayedIdx];

  // Mouse move handler for gentle image tilt only
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  // Vertical wipe transition (top-to-bottom or bottom-to-top)
  const triggerTransition = useCallback((nextIdx: number, dir: "down" | "up" = "down") => {
    if (nextIdx === activeIdxRef.current || isWipingRef.current) return;
    setIsWiping(true);
    setWipeDirection(dir);
    setActiveIdx(nextIdx);

    // Halfway: switch image & displayed title
    setTimeout(() => {
      setDisplayedIdx(nextIdx);
    }, 450);

    // End of wipe
    setTimeout(() => {
      setIsWiping(false);
    }, 900);
  }, []);

  // Frame-by-frame progress loop
  useEffect(() => {
    startTimeRef.current = performance.now();

    const loop = (time: number) => {
      const elapsed = time - startTimeRef.current;
      const p = Math.min(1, elapsed / AUTO_ROTATE_MS);
      setProgress(p);

      if (elapsed >= AUTO_ROTATE_MS) {
        const next = (activeIdxRef.current + 1) % FEATURED_PRODUCTS.length;
        triggerTransition(next, "down");
        startTimeRef.current = performance.now();
        setProgress(0);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [triggerTransition]);

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) return;
    const dir = idx >= activeIdx ? "down" : "up";
    triggerTransition(idx, dir);
    startTimeRef.current = performance.now();
    setProgress(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100dvh] w-full overflow-hidden select-none flex flex-col justify-between"
      style={{
        background: "#0c130f",
        color: "var(--color-cream)",
        padding: "clamp(60px, 8dvh, 90px) clamp(24px, 5vw, 84px)",
      }}
    >
      {/* ── Parallax Ambient Blurred Backdrop Glows ── */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full blur-[140px] opacity-15 transition-transform duration-700 ease-out"
        style={{
          background: "var(--color-green)",
          transform: `translate3d(${tilt.x * 30}px, ${tilt.y * 30}px, 0)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full blur-[160px] opacity-15 transition-transform duration-700 ease-out"
        style={{
          background: "var(--color-red)",
          transform: `translate3d(${-tilt.x * 30}px, ${-tilt.y * 30}px, 0)`,
        }}
      />

      {/* ── Section Header (Generous bottom margin so content never sticks to it) ── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-[clamp(36px,6dvh,64px)] gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2.5 text-[10.5px] uppercase font-semibold tracking-[0.34em] text-[var(--color-red)] mb-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--color-red)] animate-ping" />
            Curated Atelier Showcase
          </div>
          <h2
            className="font-normal uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.8vw, 3.4rem)",
              lineHeight: 1,
              letterSpacing: "-0.015em",
              color: "var(--color-cream)",
            }}
          >
            The Permanent Collection
          </h2>
        </div>

        <p
          className="max-w-[34ch] text-[13.5px] md:text-right shrink-0"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "rgba(255,250,240,0.6)",
            lineHeight: 1.45,
          }}
        >
          Form follows instinct. Discover the core silhouettes defining the season.
        </p>
      </div>

      {/* ── Perfectly Symmetrical 3-Column Stage (LHS = Center = RHS in width) ── */}
      <div className="relative flex-1 w-full grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-4 my-auto">
        
        {/* ── LHS (Equal 1/3 Width): Multi-line Natural Wrapping Vertical Title ── */}
        <div className="w-full flex items-center justify-center h-[62dvh] max-h-[580px] z-10">
          <Link
            href={`/collections/${active.categorySlug}`}
            className="group relative flex items-center justify-center h-full w-full max-w-[280px] cursor-pointer select-none"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {/* Multi-line vertical text wrapping with zero truncation */}
            <h3
              key={active.id}
              className="font-normal uppercase tracking-tight text-[var(--color-cream)] transition-all duration-500 ease-out group-hover:text-[var(--color-red)] text-center"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 3.5vw, 3.6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                maxHeight: "56dvh",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                opacity: isWiping ? 0.2 : 1,
                transform: isWiping ? "scale(0.98)" : "scale(1)",
                filter: isWiping ? "blur(4px)" : "blur(0px)",
                transition: "opacity 0.45s ease, transform 0.45s ease, filter 0.45s ease, color 0.3s ease",
              }}
            >
              {active.name}
            </h3>
          </Link>
        </div>

        {/* ── CENTER (Equal 1/3 Width): Clean 4:5 Image with Vertical Wipe ── */}
        <div className="w-full flex items-center justify-center h-[62dvh] max-h-[580px]">
          <div
            className="relative h-full w-auto aspect-[4/5] rounded-[18px] overflow-hidden transition-transform duration-700 ease-out"
            style={{
              transform: `perspective(1000px) rotateY(${tilt.x * 6}deg) rotateX(${-tilt.y * 6}deg)`,
              boxShadow: "0 35px 90px -25px rgba(0,0,0,0.85), 0 0 35px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,250,240,0.12)",
            }}
          >
            {/* The Photograph — Clean, unobstructed */}
            <img
              src={`/assets/featured/${active.imageAsset}`}
              alt={active.name}
              className="h-full w-full object-cover select-none transition-transform duration-700 ease-out"
              style={{
                objectPosition: "center",
                transform: `scale(${isWiping ? 1.04 : 1})`,
              }}
            />

            {/* Top / Bottom Vertical Shutter Wipe Curtain */}
            <div
              className="pointer-events-none absolute inset-0 z-30"
              style={{
                background: "#0c130f",
                transform: isWiping
                  ? wipeDirection === "down"
                    ? "translateY(0%)"
                    : "translateY(0%)"
                  : wipeDirection === "down"
                  ? "translateY(100%)"
                  : "translateY(-100%)",
                transition: "transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)",
              }}
            />
          </div>
        </div>

        {/* ── RHS (Equal 1/3 Width): Tight, Elegant Naked Avatar Column ── */}
        <div className="w-full flex items-center justify-center h-[62dvh] max-h-[580px] z-10">
          <div className="flex flex-col items-center justify-center gap-3.5 sm:gap-4">
            {FEATURED_PRODUCTS.map((prod, i) => {
              const isSelected = i === activeIdx;
              const strokeDashoffset = isSelected ? CIRCUMFERENCE * (1 - progress) : CIRCUMFERENCE;

              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className="group relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 cursor-pointer shrink-0"
                  aria-label={`Select ${prod.name}`}
                >
                  {/* Real SVG Circular Progress Ring */}
                  <svg
                    className="absolute inset-0 h-full w-full pointer-events-none"
                    viewBox="0 0 56 56"
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    <circle
                      cx="28"
                      cy="28"
                      r={RADIUS}
                      fill="none"
                      stroke={isSelected ? "rgba(255,250,240,0.15)" : "transparent"}
                      strokeWidth="2.2"
                    />
                    {isSelected && (
                      <circle
                        cx="28"
                        cy="28"
                        r={RADIUS}
                        fill="none"
                        stroke="var(--color-red)"
                        strokeWidth="2.2"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>

                  {/* Naked Circular Avatar Thumbnail */}
                  <span
                    className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden transition-all duration-300 shrink-0"
                    style={{
                      opacity: isSelected ? 1 : 0.35,
                      filter: isSelected ? "none" : "grayscale(0.75)",
                    }}
                  >
                    <img
                      src={`/assets/featured/${prod.imageAsset}`}
                      alt={prod.name}
                      className="h-full w-full object-cover"
                    />
                  </span>

                  {/* Hover Tooltip */}
                  <span
                    className="pointer-events-none absolute right-[calc(100%+14px)] hidden sm:block whitespace-nowrap text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--color-cream)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1 z-30"
                    style={{
                      fontFamily: "var(--font-ui)",
                      textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                    }}
                  >
                    {prod.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
