"use client";

import { motion } from "framer-motion";

export default function BrandManifesto() {
  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: "90dvh" }}
    >
      {/* Ambient background film */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/manifesto/brand-film.mp4"
        poster="/assets/manifesto/brand-film-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        style={{ animation: "manifestoZoom 24s ease-in-out infinite alternate" }}
      />

      {/* Legibility overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,33,26,0.55) 0%, rgba(20,33,26,0.72) 50%, rgba(20,33,26,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center gap-8 px-[6dvh] text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[11px] font-medium uppercase tracking-[0.4em]"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-cream)", opacity: 0.75 }}
        >
          Our Manifesto
        </motion.span>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
          style={{ transformOrigin: "center", height: 1, width: 48, background: "var(--color-red)" }}
        />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
          className="text-[clamp(1.8rem,4vw,3.2rem)]"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-cream)", lineHeight: 1.25 }}
        >
          We don't dress the body at rest.
          <br />
          We dress the body in motion.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.5 }}
          className="max-w-[48ch] text-[15px] leading-[1.75]"
          style={{ fontFamily: "var(--font-ui)", color: "rgba(255,250,240,0.78)" }}
        >
          Volt is the charge — the push, the pulse, the line that refuses stillness. Ash is what stays
          grounded — the fabric, the form, the weight that holds a shape when everything else is
          moving. Between the two, we cut everything we make.
        </motion.p>

        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.75 }}
          className="text-[12px] font-medium uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-red)" }}
        >
          Engineered for Motion
        </motion.span>
      </div>

      <style jsx>{`
        @keyframes manifestoZoom {
          from { transform: scale(1); }
          to { transform: scale(1.06); }
        }
      `}</style>
    </section>
  );
}