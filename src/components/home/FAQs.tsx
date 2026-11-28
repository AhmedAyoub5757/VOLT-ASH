"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Plus, Sparkles, ArrowUpRight } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "sizing-fit",
    question: "How do your garments fit, and how should I choose my size?",
    answer:
      "Most ready-to-wear silhouettes are cut true to size with tailored ease unless labeled 'Relaxed' or 'Oversized.' Every product page lists exact flat garment measurements and model fit notes so you can match them to a piece you already own.",
  },
  {
    id: "shipping-dispatch",
    question: "When will my order dispatch and how long does delivery take?",
    answer:
      "In-stock pieces dispatch within 1–2 business days from our atelier. Domestic express delivery arrives in 2–4 business days, while international courier transit typically takes 5–9 business days.",
  },
  {
    id: "returns-exchanges",
    question: "What is your return and size-exchange policy?",
    answer:
      "We offer complimentary size exchanges and returns within 14 days of delivery on unworn garments with original tags, garment bags, and packaging intact. Archive final-sale items are non-returnable unless faulty.",
  },
  {
    id: "care-fabrics",
    question: "How should I care for delicate silks, woolens, and embellished pieces?",
    answer:
      "We recommend eco-friendly dry cleaning for structured outerwear, tailored wool, and silk eveningwear. Cotton and linen staples can be washed cold inside out on a gentle cycle and air-dried in shade.",
  },
  {
    id: "drops-restocks",
    question: "Do sold-out seasonal pieces or limited drops get restocked?",
    answer:
      "Capsule runway drops are crafted in numbered runs and rarely restock in full. Signature house staples return periodically—join our private dispatch for early access before new drops open.",
  },
];

const CINEMATIC_EASE = [0.65, 0, 0.35, 1] as const;

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbTopY = useTransform(scrollYProgress, [0, 1], [-50, 70]);
  const orbBottomY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      style={{ fontFamily: "var(--font-ui)" }}
      className="relative w-full overflow-hidden bg-[var(--color-cream)] text-[var(--color-ink)] py-24 md:py-32 px-6 md:px-12 border-t border-[var(--color-ink)]/15"
    >
      {/* Scroll-Linked Ambient Couture Glows */}
      <motion.div
        aria-hidden="true"
        style={{ y: orbTopY }}
        className="pointer-events-none absolute -top-24 right-[8%] w-[26rem] h-[26rem] rounded-full bg-[var(--color-pink)]/25 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        style={{ y: orbBottomY }}
        className="pointer-events-none absolute bottom-10 left-[6%] w-[22rem] h-[22rem] rounded-full bg-[var(--color-red)]/12 blur-3xl"
      />

      <div className="relative max-w-4xl mx-auto">
        {/* 1. Centered Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20 space-y-5">
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
              style={{
                fontSize: "var(--fs-label)",
                letterSpacing: "var(--tracking-label)",
              }}
              className="font-bold uppercase text-[var(--color-red)]"
            >
              Client Care &amp; Dialogue
            </motion.p>
          </div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.08, ease: CINEMATIC_EASE }}
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "var(--tracking-display)",
                fontSize: "var(--fs-display-lg)",
              }}
              className="font-bold leading-[0.95] text-[var(--color-ink)]"
            >
              Questions &amp;{" "}
              <span className="italic font-normal text-[var(--color-red)]">
                Direct
              </span>{" "}
              Replies
            </motion.h2>
          </div>

          {/* Animated Hairline Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: CINEMATIC_EASE }}
            className="w-20 h-[2px] bg-[var(--color-red)] mx-auto origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.25, ease: CINEMATIC_EASE }}
            className="text-sm sm:text-base text-[var(--color-ink-soft)] leading-relaxed max-w-lg mx-auto"
          >
            Select any question below to unfold our studio stylist&apos;s notes on silhouette fit, dispatch timelines, and garment care.
          </motion.p>
        </div>

        {/* 2. Centered Chat Thread with Asymmetric Couture Shapes */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  layout: { duration: 0.45, ease: CINEMATIC_EASE },
                  opacity: { duration: 0.65, delay: index * 0.07 },
                  y: { duration: 0.7, delay: index * 0.07, ease: CINEMATIC_EASE },
                }}
                className="flex flex-col gap-4"
              >
                {/* RIGHT CORNER: Asymmetric Question Bubble */}
                <div className="flex justify-end">
                  <motion.button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`chat-answer-${item.id}`}
                    whileHover={{
                      x: -6,
                      y: -3,
                      transition: { type: "spring", stiffness: 380, damping: 24 },
                    }}
                    whileTap={{ scale: 0.985 }}
                    className={`group relative max-w-[92%] sm:max-w-[78%] text-left px-6 sm:px-8 py-5 sm:py-6 border transition-colors duration-300 cursor-pointer overflow-hidden rounded-tl-[2.5rem] rounded-tr-[0.4rem] rounded-bl-[1.25rem] rounded-br-[2.75rem] ${
                      isOpen
                        ? "bg-[var(--color-red)] text-[var(--color-cream)] border-[var(--color-red)] shadow-[8px_8px_0px_0px_var(--color-ink)]"
                        : "bg-white/90 hover:bg-[var(--color-ink)] text-[var(--color-ink)] hover:text-[var(--color-cream)] border-[var(--color-ink)]/20 hover:border-[var(--color-ink)] shadow-[4px_4px_0px_0px_rgba(26,26,26,0.12)] hover:shadow-[8px_8px_0px_0px_var(--color-red)]"
                    }`}
                  >
                    {/* Subtle Diagonal Sheen Sweep on Hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    />

                    <div className="relative flex items-center justify-between gap-5">
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          letterSpacing: "var(--tracking-display)",
                        }}
                        className="text-xl sm:text-2xl md:text-[1.65rem] font-bold leading-snug"
                      >
                        {item.question}
                      </span>

                      <motion.span
                        animate={{ rotate: isOpen ? 135 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 22,
                        }}
                        className={`shrink-0 w-9 h-9 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm flex items-center justify-center transition-colors duration-300 ${
                          isOpen
                            ? "bg-[var(--color-cream)] text-[var(--color-red)]"
                            : "bg-[var(--color-ink)]/10 text-current group-hover:bg-[var(--color-red)] group-hover:text-[var(--color-cream)]"
                        }`}
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </motion.span>
                    </div>
                  </motion.button>
                </div>

                {/* LEFT CORNER: Asymmetric Atelier Reply Bubble */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`chat-answer-${item.id}`}
                      key="answer-bubble"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        transition: {
                          height: { duration: 0.45, ease: CINEMATIC_EASE },
                          opacity: { duration: 0.35, delay: 0.06 },
                        },
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: {
                          height: { duration: 0.34, ease: CINEMATIC_EASE },
                          opacity: { duration: 0.2 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-end gap-3.5 max-w-[92%] sm:max-w-[78%] pt-1 pb-3 pl-1">
                        {/* Asymmetric Brand Emblem Avatar */}
                        <motion.div
                          initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 20,
                            delay: 0.08,
                          }}
                          className="shrink-0 w-10 h-10 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-sm bg-[var(--color-ink)] text-[var(--color-cream)] flex items-center justify-center shadow-md border border-[var(--color-pink)]/40"
                        >
                          <Sparkles className="w-4 h-4 text-[var(--color-pink)]" />
                        </motion.div>

                        {/* Mirrored Asymmetric Answer Bubble */}
                        <motion.div
                          initial={{ x: -24, y: 10, scale: 0.96, opacity: 0 }}
                          animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                          exit={{ x: -16, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 340,
                            damping: 25,
                            delay: 0.1,
                          }}
                          whileHover={{
                            x: 5,
                            y: -2,
                            transition: {
                              type: "spring",
                              stiffness: 380,
                              damping: 24,
                            },
                          }}
                          className="relative bg-[var(--color-ink)] text-[var(--color-cream)] px-6 sm:px-8 py-5 sm:py-6 rounded-tl-[0.4rem] rounded-tr-[2.5rem] rounded-bl-[2.75rem] rounded-br-[1.25rem] shadow-[6px_6px_0px_0px_var(--color-pink)] border border-[var(--color-ink)]"
                        >
                          {/* Animated Typing Pulse Dots */}
                          <div className="flex items-center gap-1.5 mb-2.5">
                            {[0, 1, 2].map((dot) => (
                              <motion.span
                                key={dot}
                                animate={{
                                  opacity: [0.35, 1, 0.35],
                                  y: [0, -2.5, 0],
                                }}
                                transition={{
                                  duration: 1.4,
                                  repeat: Infinity,
                                  delay: dot * 0.2,
                                  ease: "easeInOut",
                                }}
                                className="w-1.5 h-1.5 rounded-full bg-[var(--color-pink)]"
                              />
                            ))}
                          </div>

                          <motion.p
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.18 }}
                            className="text-sm sm:text-base leading-relaxed text-[var(--color-cream)]/95"
                          >
                            {item.answer}
                          </motion.p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* 3. Centered Closing Stylist Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.15, ease: CINEMATIC_EASE }}
          className="mt-16 md:mt-20 text-center"
        >
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontSize: "var(--fs-label)",
              letterSpacing: "var(--tracking-label)",
            }}
            className="group inline-flex items-center gap-2.5 bg-[var(--color-cream)] text-[var(--color-cream)] hover:bg-[var(--color-red)] px-8 py-4 rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm font-bold uppercase shadow-[5px_5px_0px_0px_var(--color-pink)] transition-colors duration-300"
          >
            <span>Message a Stylist Directly</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}