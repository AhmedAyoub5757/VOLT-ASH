"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RING_CATEGORIES, type RingCategory } from "@/lib/data/ringCategories";

/* ─── Tuning constants (spec §18 adapted to VOLT & ASH) ───────── */
const N = RING_CATEGORIES.length; // 6
const RING_R_DESKTOP = 0.34;
const RING_R_PHONE = 0.38;
const RING_CY_RATIO = 0.055;
const CARD_FACTOR_DESKTOP = 0.18;
const CARD_FACTOR_PHONE = 0.22;
const BASE_SCALE = 0.86;
const TOP_EMPHASIS = 0.32; // focal disc = 1.18x
const LIFT = 7; // px focal disc rises
const STEP_DUR = 1.0;
const AUTO_INTERVAL = 3600;
const USER_IDLE = 4400;
const WHEEL_THRESHOLD = 88;
const WHEEL_GAP = 140;

const smoothstep = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

const easeInOutExpo = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
};

const wrapOff = (d: number) => {
  let o = (((d % N) + N + N / 2) % N) - N / 2;
  if (o === -N / 2) o = N / 2;
  return o;
};

export default function CategoryRing() {
  const rootRef = useRef<HTMLElement | null>(null);
  const bgWrapRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const discsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dispMapRRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const dispMapGRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const dispMapBRef = useRef<SVGFEDisplacementMapElement | null>(null);

  // State & interaction refs
  const [focalIdx, setFocalIdx] = useState(0);
  const [d0, setD0] = useState(140);
  const [isChromium, setIsChromium] = useState(false);

  const posRef = useRef(0);
  const targetPosRef = useRef(0);
  const tweenStartPosRef = useRef(0);
  const tweenStartTimeRef = useRef(0);
  const isTweeningRef = useRef(false);

  const enterRef = useRef(0);
  const enterCompletedRef = useRef(false);

  const lastInputTimeRef = useRef(0);
  const lastAdvanceTimeRef = useRef(0);

  const dragRef = useRef({
    active: false,
    startX: 0,
    startPos: 0,
    downIndex: -1,
    lastX: 0,
    lastTime: 0,
    vel: 0,
  });

  const wheelRef = useRef({
    acc: 0,
    locked: false,
    peaked: false,
    lastMag: 0,
    lastTime: 0,
  });

  const isVisibleRef = useRef(true);

  // Check user agent once mounted
  useEffect(() => {
    const ua = navigator.userAgent;
    const isChromeLike = /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/Safari\//.test(ua) ? true : /Chrome\//.test(ua);
    setIsChromium(isChromeLike);
  }, []);

  // Main animation engine & physics loop
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let rafId = 0;
    let stageW = window.innerWidth;
    let stageH = window.innerHeight;
    let S = Math.min(stageW, stageH);
    let isPhone = S < 640;

    let ringRadius = S * (isPhone ? RING_R_PHONE : RING_R_DESKTOP);
    let ringCY = stageH * RING_CY_RATIO;
    let stepAngle = (2 * Math.PI) / N;
    let currentD0 = Math.round(Math.max(60, Math.min(184, S * (isPhone ? CARD_FACTOR_PHONE : CARD_FACTOR_DESKTOP))));
    setD0(currentD0);

    const recompute = () => {
      stageW = window.innerWidth;
      stageH = window.innerHeight;
      S = Math.min(stageW, stageH);
      isPhone = S < 640;
      ringRadius = S * (isPhone ? RING_R_PHONE : RING_R_DESKTOP);
      ringCY = stageH * RING_CY_RATIO;
      currentD0 = Math.round(Math.max(60, Math.min(184, S * (isPhone ? CARD_FACTOR_PHONE : CARD_FACTOR_DESKTOP))));
      setD0(currentD0);
    };

    window.addEventListener("resize", recompute);

    // Entrance timeline
    const enterTween = gsap.to(enterRef, {
      current: 1,
      duration: 2.7,
      ease: "power4.out",
      delay: 0.15,
      onComplete: () => {
        enterCompletedRef.current = true;
      },
    });

    if (bgWrapRef.current) {
      gsap.fromTo(
        bgWrapRef.current,
        { opacity: 0, scale: 1.12, filter: "blur(20px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2.0, ease: "power3.out", delay: 0.15 }
      );
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0.32, duration: 2.0, delay: 0.3 });
    }

    const markInput = () => {
      lastInputTimeRef.current = performance.now();
    };

    const rotateTo = (target: number) => {
      tweenStartPosRef.current = posRef.current;
      targetPosRef.current = target;
      tweenStartTimeRef.current = performance.now();
      isTweeningRef.current = true;
    };

    const goTo = (index: number) => {
      const shortest = posRef.current + wrapOff(index - posRef.current);
      rotateTo(shortest);
    };

    const step = (dir: number) => {
      rotateTo(Math.round(posRef.current) + dir);
    };

    // Frame Clock
    const tick = (now: number) => {
      // 1. Advance rotation tween if animating
      if (isTweeningRef.current) {
        const elapsed = (now - tweenStartTimeRef.current) / (STEP_DUR * 1000);
        if (elapsed >= 1) {
          posRef.current = targetPosRef.current;
          isTweeningRef.current = false;
        } else {
          const eased = easeInOutExpo(elapsed);
          posRef.current = tweenStartPosRef.current + (targetPosRef.current - tweenStartPosRef.current) * eased;
        }
      }

      const curPos = posRef.current;
      const normalizedFocal = (((Math.round(curPos) % N) + N) % N);
      if (normalizedFocal !== focalIdx) {
        setFocalIdx(normalizedFocal);
      }

      // 2. Auto-rotate check
      if (
        enterCompletedRef.current &&
        isVisibleRef.current &&
        !dragRef.current.active &&
        !isTweeningRef.current &&
        now - lastInputTimeRef.current >= USER_IDLE &&
        now - lastAdvanceTimeRef.current >= AUTO_INTERVAL
      ) {
        lastAdvanceTimeRef.current = now;
        step(1);
      }

      // 3. Entrance progress values
      const enterVal = enterRef.current;
      const enterEased = smoothstep(enterVal);
      const spin = (1 - enterEased) * 2.4; // unwinds ~137 deg
      const er = 0.5 + 0.5 * enterEased;

      // 4. Update Discs
      for (let i = 0; i < N; i++) {
        const disc = discsRef.current[i];
        if (!disc) continue;

        const off = wrapOff(i - curPos);
        const ang = -Math.PI / 2 + off * stepAngle + spin;
        const bx = Math.cos(ang) * ringRadius * er;
        const by = ringCY + Math.sin(ang) * ringRadius * er;

        const topness = smoothstep(Math.max(0, Math.min(1, 1 - Math.abs(off))));
        const s = BASE_SCALE + TOP_EMPHASIS * topness;
        const lift = LIFT * topness;
        const z = Math.round(100 + topness * 120 - by * 0.02);

        // Staggered entrance
        const stg = (Math.min(Math.abs(off), N / 2) / (N / 2)) * 0.5;
        const le = smoothstep(Math.max(0, Math.min(1, (enterVal - stg) / (1 - stg || 1))));
        const eScale = 0.3 + 0.7 * le;

        disc.style.transform = `translate(-50%, -50%) translate3d(${bx.toFixed(2)}px, ${(by - lift).toFixed(2)}px, 0) scale(${(s * eScale).toFixed(4)})`;
        disc.style.opacity = le.toFixed(3);
        disc.style.zIndex = String(z);
        disc.style.visibility = le < 0.02 ? "hidden" : "visible";

        // Disc image filter & rim
        const img = disc.querySelector(".vis-med-img") as HTMLImageElement | null;
        if (img) {
          const gray = Math.max(0, Math.min(0.55, (1 - topness) * 0.55));
          const bright = 0.9 + 0.1 * topness;
          const blurPx = (1 - le) * 8;
          img.style.filter = `grayscale(${gray.toFixed(2)}) brightness(${bright.toFixed(2)}) blur(${blurPx.toFixed(1)}px)`;
        }

        const rim = disc.querySelector(".vis-med-rim") as HTMLElement | null;
        if (rim) {
          rim.style.opacity = (0.42 + 0.4 * topness).toFixed(3);
        }
      }

      // 5. Cross-fade backdrops: clamp(1.05 - |off_i|, 0, 1)
      const bgElements = root.querySelectorAll<HTMLElement>(".vis-bg");
      for (let i = 0; i < bgElements.length; i++) {
        const off = wrapOff(i - curPos);
        const op = Math.max(0, Math.min(1, 1.05 - Math.abs(off)));
        bgElements[i].style.opacity = op.toFixed(3);
      }

      // 6. SVG Glass living wobble (three layered sines)
      if (dispMapRRef.current && dispMapGRef.current && dispMapBRef.current) {
        const t = now;
        const wob = 1 + 0.38 * (Math.sin(t * 0.0015) + 0.38 * Math.sin(t * 0.0034 + 1.2) + 0.22 * Math.sin(t * 0.0061 + 2.4));
        const baseScale = 24;
        dispMapRRef.current.scale.baseVal = baseScale * (1 + 0.05 * 2.2) * wob;
        dispMapGRef.current.scale.baseVal = baseScale * wob;
        dispMapBRef.current.scale.baseVal = baseScale * (1 - 0.05 * 2.2) * wob;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // Visibility Observer
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(root);

    // ── Input: Drag
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest(".vis-chev")) return;

      markInput();
      const discEl = target?.closest<HTMLElement>(".vis-med");
      const downIdx = discEl?.dataset.index != null ? parseInt(discEl.dataset.index, 10) : -1;

      dragRef.current = {
        active: true,
        startX: e.clientX,
        startPos: posRef.current,
        downIndex: downIdx,
        lastX: e.clientX,
        lastTime: performance.now(),
        vel: 0,
      };

      try {
        root.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      markInput();
      const now = performance.now();
      const dx = e.clientX - dragRef.current.startX;
      const perStep = isPhone ? Math.max(130, Math.min(260, stageW * 0.38)) : 260;

      posRef.current = dragRef.current.startPos - dx / perStep;

      const dt = Math.max(1, now - dragRef.current.lastTime);
      const instantVel = (e.clientX - dragRef.current.lastX) / dt;
      dragRef.current.vel = instantVel;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastTime = now;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      try {
        root.releasePointerCapture(e.pointerId);
      } catch {}

      const dx = e.clientX - dragRef.current.startX;
      if (Math.abs(dx) <= 4 && dragRef.current.downIndex >= 0) {
        goTo(dragRef.current.downIndex);
        return;
      }

      // Flick projection and snap
      const vel = dragRef.current.vel;
      const projection = isPhone
        ? Math.max(-0.5, Math.min(0.5, -vel * 2.4))
        : Math.max(-1.2, Math.min(1.2, -vel * 6));

      rotateTo(Math.round(posRef.current + projection));
    };

    // ── Input: Wheel / Trackpad
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      markInput();
      const now = performance.now();
      const dy = e.deltaY + e.deltaX;
      const mag = Math.abs(dy);
      const prev = wheelRef.current.lastMag;
      wheelRef.current.lastMag = mag;

      if (now - wheelRef.current.lastTime > WHEEL_GAP) {
        wheelRef.current.acc = 0;
        wheelRef.current.locked = false;
        wheelRef.current.peaked = false;
      }
      wheelRef.current.lastTime = now;

      if (wheelRef.current.locked) {
        if (mag < prev) wheelRef.current.peaked = true;
        if (!(wheelRef.current.peaked && mag > prev + 10)) return;
        wheelRef.current.locked = false;
        wheelRef.current.peaked = false;
        wheelRef.current.acc = 0;
      }

      wheelRef.current.acc += dy;
      if (Math.abs(wheelRef.current.acc) >= WHEEL_THRESHOLD) {
        step(Math.sign(wheelRef.current.acc));
        wheelRef.current.acc = 0;
        wheelRef.current.locked = true;
        wheelRef.current.peaked = false;
      }
    };

    // ── Input: Keyboard
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        markInput();
        step(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        markInput();
        step(-1);
      }
    };

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(rafId);
      enterTween.kill();
      observer.disconnect();
      window.removeEventListener("resize", recompute);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const activeCategory = RING_CATEGORIES[focalIdx] || RING_CATEGORIES[0];

  return (
    <section
      ref={rootRef}
      className="vis-root relative h-screen w-full select-none overflow-hidden"
      style={{
        background: "var(--vis-stage, #14211a)",
        touchAction: "pan-y",
        cursor: "grab",
      }}
    >
      {/* Backdrop wrap (entrance bloom + Ken Burns) */}
      <div ref={bgWrapRef} className="vis-bgwrap absolute inset-0">
        {RING_CATEGORIES.map((cat, i) => (
          <div
            key={cat.id}
            className="vis-bg absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${cat.image})`,
              backgroundPosition: cat.bgFocus,
              filter: "brightness(0.60) saturate(0.95)",
              animation: "vis-kenburns 34s ease-in-out infinite alternate",
              willChange: "opacity, transform",
              opacity: i === 0 ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Static dark vignette */}
      <div
        className="vis-vignette pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 100% at 50% 44%, transparent 32%, rgba(10,16,11,.50) 72%, rgba(8,13,9,.90) 100%)",
        }}
      />

      {/* Warm soft glow bloom behind the title */}
      <div
        ref={glowRef}
        className="vis-glow pointer-events-none absolute left-1/2 rounded-full"
        style={{
          top: "55.5%",
          width: "42vmin",
          height: "42vmin",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(closest-side, ${activeCategory.accent}44, transparent)`,
          filter: "blur(44px)",
          mixBlendMode: "screen",
          opacity: 0,
          transition: "background 1s ease",
        }}
      />

      {/* Shared SVG Physical Refraction Glass Filter */}
      <svg aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0 }}>
        <defs>
          <filter id="vis-glass" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} result="noise" />
            <feDisplacementMap
              ref={dispMapRRef}
              in="SourceGraphic"
              in2="noise"
              scale={28}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispR"
            />
            <feDisplacementMap
              ref={dispMapGRef}
              in="SourceGraphic"
              in2="noise"
              scale={24}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispG"
            />
            <feDisplacementMap
              ref={dispMapBRef}
              in="SourceGraphic"
              in2="noise"
              scale={20}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispB"
            />
            <feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redOnly" />
            <feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="greenOnly" />
            <feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueOnly" />
            <feBlend mode="screen" in="redOnly" in2="greenOnly" result="rg" />
            <feBlend mode="screen" in="rg" in2="blueOnly" />
          </filter>
        </defs>
      </svg>

      {/* The Orbiting Discs */}
      <div className="vis-orbit pointer-events-none absolute inset-0">
        {RING_CATEGORIES.map((cat, i) => (
          <div
            key={cat.id}
            data-index={i}
            ref={(el) => {
              discsRef.current[i] = el;
            }}
            className="vis-med pointer-events-auto absolute left-1/2 top-1/2 rounded-full cursor-pointer will-change-[transform,opacity]"
            style={{
              width: `${d0}px`,
              height: `${d0}px`,
              background: "rgba(240,244,250,.04)",
              backdropFilter: isChromium
                ? "url(#vis-glass) blur(0.4px) saturate(1.16) brightness(0.97)"
                : "blur(4px) saturate(1.15) brightness(0.96)",
              WebkitBackdropFilter: isChromium
                ? "url(#vis-glass) blur(0.4px) saturate(1.16) brightness(0.97)"
                : "blur(4px) saturate(1.15) brightness(0.96)",
              boxShadow:
                "0 20px 46px rgba(0,0,0,.45), 0 3px 10px rgba(0,0,0,.34), inset 0 0 0 1px rgba(255,255,255,.10)",
            }}
          >
            {/* Medallion Inset Face (16% inset) */}
            <div
              className="vis-med-face absolute overflow-hidden rounded-full pointer-events-none"
              style={{
                inset: "16%",
                background: "#0b0907",
                boxShadow:
                  "inset 0 0 7px rgba(0,0,0,.40), 0 0 0 1px rgba(255,255,255,.16), 0 2px 6px rgba(0,0,0,.45)",
              }}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="vis-med-img h-full w-full object-cover pointer-events-none"
                style={{
                  objectPosition: cat.thumbFocus,
                  transform: `scale(${cat.thumbScale})`,
                }}
              />
            </div>

            {/* Glass Rim: Top Specular + Transmitted Edge Glow */}
            <div
              className="vis-med-rim absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 8%, rgba(255,255,255,.34), rgba(255,255,255,0) 40%), radial-gradient(circle at 72% 80%, rgba(255,250,242,.12), rgba(255,250,242,0) 30%)",
                boxShadow:
                  "inset 0 1px 2px rgba(255,255,255,.50), inset 0 0 0 1px rgba(255,255,255,.16), inset 0 -7px 16px rgba(0,0,0,.26), 0 0 0 1px rgba(0,0,0,.20)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Centred Title & Caption (Remounts smoothly on scene change) */}
      <div
        className="vis-title pointer-events-none absolute inset-x-0 top-[55.5%] z-[60] -translate-y-1/2 px-6 text-center"
        style={{ color: "var(--color-cream, #fffaf0)" }}
      >
        <h2
          key={`title-${activeCategory.id}`}
          className="vis-title-name mx-auto font-normal text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 4vw, 48px)",
            lineHeight: 1.12,
            letterSpacing: "-0.01em",
            maxWidth: "min(48vw, 500px)",
            textShadow: "0 2px 30px rgba(0,0,0,.65)",
            animation: "vis-rise 0.7s cubic-bezier(.22,1,.36,1) both",
          }}
        >
          {activeCategory.title}
        </h2>
        <div
          key={`caption-${activeCategory.id}`}
          className="vis-title-sub mt-4 text-[11px] font-medium uppercase tracking-[0.34em]"
          style={{
            fontFamily: "var(--font-ui)",
            color: "rgba(255,250,240,.65)",
            animation: "vis-fade 0.55s ease 0.12s both",
          }}
        >
          {activeCategory.caption}
        </div>
      </div>

      {/* Chevrons (Hidden on mobile) */}
      <button
        type="button"
        aria-label="Rotate left"
        onClick={() => {
          const navEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
          window.dispatchEvent(navEvent);
        }}
        className="vis-chev vis-chev-left group absolute top-1/2 z-[300] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 sm:grid"
        style={{
          left: "clamp(16px, 3.5vw, 48px)",
          color: "var(--color-cream)",
          background: "rgba(10,8,6,.38)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 6px 18px rgba(0,0,0,.42), inset 0 1px 1px rgba(255,255,255,.14)",
          cursor: "pointer",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:-translate-x-0.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Rotate right"
        onClick={() => {
          const navEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
          window.dispatchEvent(navEvent);
        }}
        className="vis-chev vis-chev-right group absolute top-1/2 z-[300] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 sm:grid"
        style={{
          right: "clamp(16px, 3.5vw, 48px)",
          color: "var(--color-cream)",
          background: "rgba(10,8,6,.38)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 6px 18px rgba(0,0,0,.42), inset 0 1px 1px rgba(255,255,255,.14)",
          cursor: "pointer",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes vis-kenburns {
          from {
            transform: scale(1) translate(0, 0);
          }
          to {
            transform: scale(1.04) translate(-0.6%, -0.8%);
          }
        }
        @keyframes vis-rise {
          from {
            opacity: 0;
            transform: translateY(26px);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes vis-fade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
