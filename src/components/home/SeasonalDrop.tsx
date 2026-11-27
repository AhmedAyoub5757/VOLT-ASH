"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

interface DropSlide {
  src: string;
  alt: string;
  piece: string;
  fabric: string;
  caption: string;
}

const SLIDES: DropSlide[] = [
  {
    src: "/assets/seasonal-drop/voltage-field-1-1.jpg",
    alt: "Voltage Field — SS26 Look 01A",
    piece: "Look 01A — Signal Shell",
    fabric: "Brushed ripstop cotton",
    caption: "The signature capsule. Red as the pulse against ash and cream.",
  },
  {
    src: "/assets/seasonal-drop/voltage-field-1.jpg",
    alt: "Voltage Field — SS26 Look 01",
    piece: "Look 01 — Core Field Set",
    fabric: "Midweight loopback jersey",
    caption: "Balanced proportions built for daylight wear and easy layering.",
  },
  {
    src: "/assets/seasonal-drop/voltage-field-2.jpg",
    alt: "Voltage Field — SS26 Look 02",
    piece: "Look 02 — Drift Overshirt",
    fabric: "Woven technical twill",
    caption: "Lightweight structure with subtle contrast trim and clean seams.",
  },
  {
    src: "/assets/seasonal-drop/voltage-field-1-2.jpg",
    alt: "Voltage Field — SS26 Look 01B",
    piece: "Look 01B — Ash Utility Pant",
    fabric: "Garment-dyed canvas",
    caption: "Relaxed drape grounded in muted stone, ash, and cream tones.",
  },
];

const WIPE_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

// Fixed portrait/editorial ratio (896x1152 ≈ 7 / 9) matching the majority of the drop assets
const FIXED_FRAME_ASPECT = "7 / 9";

export default function SeasonalDrop() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const visualParallaxY = useTransform(scrollYProgress, [0, 1], [-16, 16]);
  const copyParallaxY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  const currentSlide = SLIDES[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ background: "var(--color-cream)", padding: "5dvh 6dvh" }}
    >
      <div className="mx-auto grid w-full max-w-[1140px] grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Editorial Content & Slide Bars */}
        <motion.div
          style={{ y: copyParallaxY }}
          className="flex flex-col justify-between gap-5 lg:col-span-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: WIPE_EASE }}
            className="flex flex-col gap-2"
          >
            <span
              className="text-[11px] font-medium uppercase tracking-[0.4em]"
              style={{
                fontFamily: "var(--font-ui)",
                color: "rgba(26,26,26,0.65)",
              }}
            >
              Seasonal Drop — SS26
            </span>

            <h2
              className="text-[clamp(2rem,4vw,3.25rem)]"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                color: "rgba(26,26,26,0.92)",
                lineHeight: 1.02,
              }}
            >
              Voltage Field
            </h2>
          </motion.div>

          {/* Active slide editorial details */}
          <div className="min-h-[5.5rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.src}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: WIPE_EASE }}
                className="flex flex-col gap-2"
              >
                <div
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.2em]"
                  style={{
                    fontFamily: "var(--font-ui)",
                    color: "rgba(26,26,26,0.75)",
                  }}
                >
                  <span className="font-medium">{currentSlide.piece}</span>
                  <span style={{ color: "rgba(26,26,26,0.3)" }}>/</span>
                  <span style={{ color: "rgba(26,26,26,0.55)" }}>
                    {currentSlide.fabric}
                  </span>
                </div>

                <p
                  className="text-[13px] leading-relaxed"
                  style={{
                    fontFamily: "var(--font-ui)",
                    color: "rgba(26,26,26,0.62)",
                  }}
                >
                  {currentSlide.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Capsule notes for richer left-column balance */}
          <div
            className="grid grid-cols-2 gap-4 border-t pt-4"
            style={{ borderColor: "rgba(26,26,26,0.12)" }}
          >
            <div className="flex flex-col gap-1">
              <span
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{
                  fontFamily: "var(--font-ui)",
                  color: "rgba(26,26,26,0.45)",
                }}
              >
                Palette
              </span>
              <span
                className="text-[12px]"
                style={{
                  fontFamily: "var(--font-ui)",
                  color: "rgba(26,26,26,0.8)",
                }}
              >
                Signal Red, Ash, Cream
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{
                  fontFamily: "var(--font-ui)",
                  color: "rgba(26,26,26,0.45)",
                }}
              >
                Release
              </span>
              <span
                className="text-[12px]"
                style={{
                  fontFamily: "var(--font-ui)",
                  color: "rgba(26,26,26,0.8)",
                }}
              >
                Limited SS26 Capsule
              </span>
            </div>
          </div>

          {/* Slide indicators without numbers */}
          <div className="flex items-center gap-2.5 pt-1">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show ${slide.alt}`}
                  className="py-1 focus:outline-none"
                >
                  <span
                    className="block h-[2px] transition-all duration-500"
                    style={{
                      width: isActive ? "36px" : "18px",
                      backgroundColor: isActive
                        ? "rgba(26,26,26,0.88)"
                        : "rgba(26,26,26,0.22)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Fixed Aspect Container Matching All Slides */}
        <motion.div
          style={{ y: visualParallaxY }}
          className="relative flex w-full justify-center lg:col-span-6"
        >
          <div
            className="relative w-full max-w-[360px] overflow-hidden rounded-[18px]"
            style={{
              aspectRatio: FIXED_FRAME_ASPECT,
              background: "rgba(26,26,26,0.04)",
            }}
          >
            <AnimatePresence mode="sync" initial={false}>
              <motion.img
                key={currentSlide.src}
                src={currentSlide.src}
                alt={currentSlide.alt}
                initial={{
                  clipPath: "inset(0% 0% 0% 100%)",
                  scale: 1.04,
                }}
                animate={{
                  clipPath: "inset(0% 0% 0% 0%)",
                  scale: 1,
                }}
                exit={{
                  clipPath: "inset(0% 100% 0% 0%)",
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.9,
                  ease: WIPE_EASE,
                }}
                className="h-full w-full object-cover select-none"
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}