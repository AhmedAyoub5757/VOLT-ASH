"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        ".navbar__left a, .navbar__right button",
        { y: -16, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        }
      ).fromTo(
        ".navbar__logo",
        { y: -16, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
        "<0.1"
      ).fromTo(
        ".navbar__accent",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        ">-0.2"
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
    >
      <nav className="navbar__left">
        <Link href="/collections/all">Shop</Link>
        <Link href="/collections/featured">Collections</Link>
        <Link href="/about">Story</Link>
      </nav>

      <div className="navbar__center">
        <Link href="/" className="navbar__logo">
          VOLT & ASH
        </Link>
        <span className="navbar__accent" />
      </div>

      <div className="navbar__right">
        <button aria-label="Search">
          <Search size={18} strokeWidth={1.5} />
        </button>
        <button aria-label="Account">
          <User size={18} strokeWidth={1.5} />
        </button>
        <button aria-label="Cart">
          <ShoppingBag size={18} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}