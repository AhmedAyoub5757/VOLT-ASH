"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PREVIEW_IMAGES = [
  "/assets/featured/streetwear-product.jpg",
  "/assets/featured/casual-wear-product.jpg",
  "/assets/featured/smart-casual-product.jpg",
  "/assets/featured/activewear-product.jpg",
  "/assets/featured/modest-wear-product.jpg",
  "/assets/featured/boho-chic-product.jpg",
];

export default function CTABanner() {
  const [hovering, setHovering] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 220, damping: 26, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 26, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const startCycling = () => {
    setHovering(true);
    intervalRef.current = setInterval(() => {
      setPreviewIdx((i) => (i + 1) % PREVIEW_IMAGES.length);
    }, 900);
  };

  const stopCycling = () => {
    setHovering(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: "78dvh" }}
      onMouseMove={handleMouseMove}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/assets/cta/cta-banner.mp4" type="video/mp4" />
        {/* Fallback image for browsers that don't support video */}
        <img
          src="/assets/cta/cta-banner.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </video>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(20,24,18,0.75) 0%, rgba(20,24,18,0.45) 50%, rgba(20,24,18,0.6) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 px-[6dvh] text-center"
      >
        <span
          className="text-[11px] font-medium uppercase tracking-[0.4em]"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-cream)", opacity: 0.75 }}
        >
          Ready When You Are
        </span>
        <h2
          className="text-[clamp(2.2rem,5.5vw,4.5rem)]"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-cream)", lineHeight: 1.05 }}
        >
          Your Line Awaits
        </h2>
        <p
          className="max-w-[46ch] text-[15px]"
          style={{ fontFamily: "var(--font-ui)", color: "rgba(255,250,240,0.75)" }}
        >
          Six ways to wear engineered-for-motion. Find yours.
        </p>

        <Link
          href="/collections/all"
          onMouseEnter={startCycling}
          onMouseLeave={stopCycling}
          className="group relative mt-4 inline-flex items-center gap-4 overflow-hidden rounded-full px-10 py-4 text-[12px] font-medium uppercase tracking-[0.32em] transition-transform duration-300 hover:scale-[1.04]"
          style={{ fontFamily: "var(--font-ui)", background: "var(--color-red)", color: "var(--color-cream)" }}
        >
          <span>Shop All Collections</span>
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </motion.div>

      {/* Cursor-follow preview lens */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 overflow-hidden rounded-full"
        style={{
          width: 120,
          height: 120,
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hovering ? 1 : 0,
          transition: "opacity 250ms ease",
          border: "2px solid var(--color-cream)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        {PREVIEW_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            style={{ opacity: i === previewIdx ? 1 : 0 }}
          />
        ))}
      </motion.div>
    </section>
  );
}