"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/collections/new" },
  { label: "Best Sellers", href: "/collections/best" },
  { label: "Sale", href: "/collections/sale" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Help & Returns", href: "/help" },
  { label: "Privacy Policy", href: "/privacy" },
];

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

const CINEMATIC_EASE = [0.65, 0, 0.35, 1] as const;
const BRAND_LETTERS = "FASHION HOUSE".split("");

export default function Footer() {
  return (
    <footer
      style={{ fontFamily: "var(--font-ui)" }}
      className="relative w-full overflow-hidden pt-16 md:pt-24 bg-[var(--color-cream)] text-[var(--color-ink)]"
    >
      {/* 1. Clean Draped Silhouette Top Edge */}
      <div className="relative w-full leading-none select-none pointer-events-none -mb-1">
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24 sm:h-32 md:h-44 block"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: CINEMATIC_EASE }}
            d="M0,115 C240,35 480,165 720,95 C960,25 1200,155 1440,80 L1440,220 L0,220 Z"
            fill="var(--color-pink)"
            fillOpacity="0.45"
          />

          <motion.path
            initial={{ y: 24 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
            d="M0,140 C220,65 460,185 720,120 C980,55 1220,175 1440,105 L1440,220 L0,220 Z"
            fill="var(--color-red)"
          />
        </svg>
      </div>

      {/* 2. Main Crimson Footer Body */}
      <div className="bg-[var(--color-red)] text-[#1a1a1a] pt-6 pb-8 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start md:items-end pb-14">
            {/* Left Column: Navigation with Lucide ArrowRight on Hover */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
              className="space-y-3"
            >
              <h4
                style={{
                  fontSize: "var(--fs-label)",
                  letterSpacing: "var(--tracking-label)",
                }}
                className="font-bold uppercase text-[#fffaf0]/85"
              >
                Navigation
              </h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a1a1a] hover:text-[#fffaf0] transition-colors duration-200"
                    >
                      <ArrowRight className="w-3.5 h-3.5 -ml-4 opacity-0 -translate-x-1 group-hover:ml-0 group-hover:opacity-100 group-hover:translate-x-0 text-[#fffaf0] transition-all duration-200" />
                      <span className="relative">
                        {link.label}
                        <span className="block h-[1.5px] max-w-0 bg-[#fffaf0] transition-all duration-300 group-hover:max-w-full" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Center Column: Editorial CTA (Cream bg, no hover) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: CINEMATIC_EASE }}
              className="flex flex-col items-start md:items-center text-left md:text-center space-y-3.5"
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  letterSpacing: "var(--tracking-display)",
                }}
                className="text-3xl md:text-4xl font-bold italic text-[#fffaf0] leading-none"
              >
                Say Hi!
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#1a1a1a] max-w-xs">
                Interested in private styling, runway lookbooks, or archive drops?
              </p>
              <a
                href="/contact"
                style={{
                  fontSize: "var(--fs-label)",
                  letterSpacing: "var(--tracking-label)",
                }}
                className="inline-flex items-center gap-2 bg-[var(--color-cream)] text-[var(--color-ink)] px-7 py-3.5 rounded-full font-bold uppercase shadow-md"
              >
                <span>Let&apos;s Chat!</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Right Column: Socials (Cream bg, no hover), Copyright & Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: CINEMATIC_EASE }}
              className="flex flex-col items-start md:items-end justify-end space-y-4"
            >
              <div className="flex items-center gap-2.5">
                {SOCIAL_LINKS.map(({ name, href, icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="w-11 h-11 rounded-full bg-[var(--color-cream)] text-[var(--color-ink)] flex items-center justify-center shadow-sm"
                  >
                    {icon}
                  </a>
                ))}
              </div>

              <p className="text-lg sm:text-xl font-bold tracking-tight text-[#1a1a1a]">
                © {new Date().getFullYear()} Fashion House
              </p>

              <div className="inline-flex items-center gap-2 border-[1.5px] border-[#1a1a1a] bg-[#1a1a1a] text-[#fffaf0] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff93a4]" />
                <span>Crafted with care for motion</span>
              </div>
            </motion.div>
          </div>

          {/* 3. Monumental Edge-to-Edge Display Wordmark */}
          <div className="w-full pt-3 border-t-2 border-[#1a1a1a]/25 overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "var(--tracking-display)",
                fontSize: "clamp(2.85rem, 11.4vw, 11.5rem)",
              }}
              className="w-full flex justify-between items-baseline font-bold uppercase leading-[0.84] text-[#1a1a1a] select-none"
            >
              {BRAND_LETTERS.map((char, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{
                    y: -10,
                    color: "#fffaf0",
                    transition: { type: "spring", stiffness: 350, damping: 15 },
                  }}
                  className="inline-block cursor-default transition-colors duration-200"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h2>
          </div>
        </div>
      </div>
    </footer>
  );
}