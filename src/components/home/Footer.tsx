"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

// Simple data for link groups – replace with real routes as needed
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
      className="bg-[var(--color-cream)] text-[var(--color-dark)] py-12"
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Link groups */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 font-medium text-lg" style={{ color: "var(--color-dark)" }}>
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="hover:underline transition-colors"
                      style={{ color: "var(--color-dark)" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Social icons */}
        <div className="flex items-center space-x-4 justify-center md:justify-end">
          <a href="#" aria-label="Facebook" className="text-[var(--color-dark)] hover:text-gray-600 transition-colors">
            <Facebook size={24} />
          </a>
          <a href="#" aria-label="Twitter" className="text-[var(--color-dark)] hover:text-gray-600 transition-colors">
            <Twitter size={24} />
          </a>
          <a href="#" aria-label="Instagram" className="text-[var(--color-dark)] hover:text-gray-600 transition-colors">
            <Instagram size={24} />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-[var(--color-dark)] hover:text-gray-600 transition-colors">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
      <div className="mt-8 text-center text-sm" style={{ color: "var(--color-dark)" }}>
        © {new Date().getFullYear()} Fashion House. All rights reserved.
      </div>
    </motion.footer>
  );
}
