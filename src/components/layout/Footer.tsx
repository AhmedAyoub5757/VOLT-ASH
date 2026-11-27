"use client";

import { motion } from "framer-motion";
// import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";


const LINK_GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/collections/new" },
      { label: "Best Sellers", href: "/collections/best" },
      { label: "Sale", href: "/collections/sale" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Returns", href: "/returns" },
      { label: "Shipping", href: "/shipping" },
    ],
  },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-r from-[var(--color-cream)] to-[var(--color-light)] text-[var(--color-dark)] py-16 border-t border-[var(--color-dark)]/20"
    >
      <div className="container mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Link groups */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-dark)]/80">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="block text-base text-[var(--color-dark)] hover:text-[var(--color-red)] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Tagline / decorative element */}
        <div className="flex items-center justify-center md:justify-end">
          <p className="text-sm italic text-[var(--color-dark)]/60">Crafted with care for motion.</p>
        </div>
      </div>
      {/* Bottom large typography */}
      <div className="mt-12 text-center">
        <p className="text-5xl font-extrabold tracking-tight text-[var(--color-dark)]">
          © {new Date().getFullYear()} Fashion House. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
