"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data/testimonials";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } },
};

export default function Testimonials() {
  return (
    <section className="w-full" style={{ background: "var(--color-cream)", padding: "12dvh 8dvh" }}>
      <div className="mx-auto max-w-6xl text-center">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.4em]"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-green)" }}
        >
          Worn In
        </span>
        <h2
          className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)", lineHeight: 1.1 }}
        >
          From the People Who Wear It
        </h2>
        <p
          className="mx-auto mt-4 max-w-2xl text-[15px]"
          style={{ fontFamily: "var(--font-ui)", color: "rgba(26,26,26,0.55)" }}
        >
          Real fit notes from the VOLT &amp; ASH line, not just our own.
        </p>

        <motion.div
          className="mt-[7dvh] grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="relative overflow-hidden"
              style={{ borderRadius: "20px", aspectRatio: "4 / 5" }}
              variants={itemVariants}
            >
              <img
                src={testimonial.imageSrc}
                alt={testimonial.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(20,24,18,0.85) 0%, rgba(20,24,18,0.45) 55%, transparent 85%)",
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <Quote size={28} strokeWidth={1.4} style={{ color: "var(--color-red)", opacity: 0.85 }} className="mb-3" />
                <blockquote
                  className="text-[15px] leading-relaxed"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-cream)" }}
                >
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-4">
                  <p className="text-[12px] font-medium uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-ui)", color: "var(--color-cream)" }}>
                    {testimonial.name}
                    <span className="ml-2" style={{ color: "rgba(255,250,240,0.55)" }}>{testimonial.role}</span>
                  </p>
                </figcaption>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}