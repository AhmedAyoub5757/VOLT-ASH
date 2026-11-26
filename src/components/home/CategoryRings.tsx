"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Flame, Coffee, Briefcase, Dumbbell, Moon, Flower2, type LucideIcon } from "lucide-react";
import { CATEGORIES } from "@/lib/data/categories";

const ICONS: Record<string, LucideIcon> = {
  streetwear: Flame,
  "casual-wear": Coffee,
  "smart-casual": Briefcase,
  activewear: Dumbbell,
  "modest-wear": Moon,
  "boho-chic": Flower2,
};

const RING_SIZE = 148; // px, desktop
const RING_SIZE_MOBILE = 104;
const STROKE = 1.4;
const RADIUS = RING_SIZE / 2 - 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CategoryRings() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-cream)",
        padding: "12dvh 8dvh 14dvh",
      }}
    >
      {/* Ambient floating shapes — depth, not decoration-for-its-own-sake */}
      <FloatingShape top="8%" left="4%" size={180} color="var(--color-green)" opacity={0.06} duration={18} />
      <FloatingShape top="60%" left="88%" size={240} color="var(--color-red)" opacity={0.04} duration={22} reverse />
      <FloatingShape top="85%" left="10%" size={120} color="var(--color-green)" opacity={0.05} duration={15} />

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center gap-[7dvh]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <span
            className="text-[11px] font-medium uppercase tracking-[0.36em]"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-green)" }}
          >
            Shop By Style
          </span>
          <h2
            className="text-[clamp(2.4rem,5.5vw,4.5rem)]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)", lineHeight: 1 }}
          >
            Find Your Line
          </h2>
        </motion.div>

        {/* Rings row */}
        <div className="flex w-full flex-wrap items-start justify-center gap-x-[5dvh] gap-y-[6dvh] max-sm:gap-x-[7vw]">
          {CATEGORIES.map((cat, i) => (
            <RingItem key={cat.slug} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RingItem({
  category,
  index,
}: {
  category: { slug: string; name: string; tagline: string };
  index: number;
}) {
  const Icon = ICONS[category.slug];
  const hoverRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.65, 0, 0.35, 1] }}
    >
      <Link
        href={`/collections/${category.slug}`}
        className="group flex flex-col items-center gap-4"
        style={{ width: RING_SIZE }}
      >
        <div
          ref={hoverRef}
          className="relative flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          style={{ width: RING_SIZE, height: RING_SIZE }}
        >
          {/* Static base ring */}
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            className="absolute inset-0"
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--color-green)"
              strokeOpacity={0.18}
              strokeWidth={STROKE}
            />
          </svg>

          {/* Draw-on ring — animates stroke-dashoffset on hover, independent of scale */}
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            className="absolute inset-0 -rotate-90"
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--color-red)"
              strokeWidth={STROKE + 0.6}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              className="transition-[stroke-dashoffset] duration-[900ms] ease-out group-hover:[stroke-dashoffset:0]"
            />
          </svg>

          {/* Fill wash — soft radial fill-in behind the icon on hover */}
          <div
            className="absolute inset-[6px] rounded-full opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(45,90,39,0.08) 0%, transparent 72%)",
            }}
          />

          {/* Icon — scales + rotates slightly on hover, color shifts green -> red */}
          <Icon
            size={34}
            strokeWidth={1.4}
            className="relative z-10 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-[8deg]"
            style={{ color: "var(--color-green)" }}
            color="var(--color-green)"
          />
          <style jsx>{`
            .group:hover :global(svg[stroke-width]) {
            }
          `}</style>
        </div>

        {/* Label */}
        <div className="flex flex-col items-center gap-1.5">
          <span
            className="relative text-[13px] font-medium uppercase tracking-[0.18em]"
            style={{ fontFamily: "var(--font-ui)", color: "var(--color-ink)" }}
          >
            {category.name}
            <span
              className="absolute -bottom-1 left-1/2 h-[1px] w-0 -translate-x-1/2 transition-all duration-400 ease-out group-hover:w-full"
              style={{ background: "var(--color-red)" }}
            />
          </span>
          <span
            className="text-[11px] opacity-0 transition-opacity duration-400 ease-out group-hover:opacity-70"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ink)" }}
          >
            {category.tagline}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Ambient floating shape ──────────────────────────────────── */
function FloatingShape({
  top, left, size, color, opacity, duration, reverse = false,
}: {
  top: string; left: string; size: number; color: string; opacity: number; duration: number; reverse?: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute rounded-full blur-3xl"
      style={{ top, left, width: size, height: size, background: color, opacity }}
      animate={{
        y: reverse ? [0, 24, 0] : [0, -24, 0],
        x: reverse ? [0, -16, 0] : [0, 16, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}