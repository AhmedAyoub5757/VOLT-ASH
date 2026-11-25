"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { X, ChevronUp, ChevronDown, Hand } from "lucide-react";
import { HERO_SLIDES, type HeroSlide } from "@/lib/data/heroSlides";

/* ─── Layout (vh values; rendered as dvh) ─────────────────────── */
const SLIDE_VH = 80;
const GAP_VH = 5;
const PITCH_VH = SLIDE_VH + GAP_VH;
const MASK_VH = 10;
const TOP_PAD_VH = (100 - SLIDE_VH) / 2;

/* ─── Input thresholds ────────────────────────────────────────── */
const WHEEL_PER_EVENT_CAP = 200;
const WHEEL_PAUSE_MS = 100;
const DRAG_THRESHOLD_VH = 14;

/* ─── Spring ───────────────────────────────────────────────────── */
const EASE = 0.11;

/* ─── Content motion ───────────────────────────────────────────── */
const FADE_THRESHOLD = 0.55;
const PARALLAX_FACTOR = 0.42;
const ENTRY_OFFSET_PX = 64;

/* ─── Image parallax ───────────────────────────────────────────── */
const IMG_HEIGHT_RATIO = 1.2;

/* ─── Loop ─────────────────────────────────────────────────────── */
const LOOP_COPIES = 7;
const N_SLIDES = HERO_SLIDES.length; // 6
const TOTAL_RENDERED = N_SLIDES * LOOP_COPIES;
const INITIAL_IDX = Math.floor(LOOP_COPIES / 2) * N_SLIDES;

/* ─── Auto-scroll ──────────────────────────────────────────────── */
const AUTO_ADVANCE_MS = 5000;
const AUTO_START_IDX = INITIAL_IDX;
const AUTO_END_IDX = INITIAL_IDX + 2 * N_SLIDES;
const AUTO_SCROLL_MS = 3000;
const AUTO_FADE_MS = 1000;

const CURSOR_SIZE = 104;
const BG = "#14241166"; // unused fallback

const modN = (i: number) => ((i % N_SLIDES) + N_SLIDES) % N_SLIDES;

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorScrollRef = useRef<HTMLDivElement | null>(null);
  const cursorDragRef = useRef<HTMLDivElement | null>(null);
  const cursorUpRef = useRef<HTMLDivElement | null>(null);
  const cursorDownRef = useRef<HTMLDivElement | null>(null);
  const cursorOnUiRef = useRef(false);
  const cursorZoneRef = useRef<"top" | "bottom" | null>(null);
  const blurFilterRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const scanlinesRef = useRef<HTMLDivElement | null>(null);

  const idxRef = useRef(AUTO_START_IDX);
  const prevIdxRef = useRef(AUTO_START_IDX);
  const yRef = useRef(0);
  const targetYRef = useRef(0);
  const wheelLastTime = useRef(0);
  const autoScrollingRef = useRef(true);
  const lastBlurPRef = useRef(0);
  const lastBlurTsRef = useRef(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInteractingRef = useRef(false);

  const dragRef = useRef({ active: false, startClientY: 0, startTrackY: 0, delta: 0, pointerId: 0 });
  const onSectionRef = useRef(false);
  const downRef = useRef(false);
  const cursorPos = useRef({ x: 0, y: 0 });
  const cursorRender = useRef({ x: 0, y: 0, scale: 0, opacity: 0 });
  const cursorInitRef = useRef(false);

  const [autoScrolling, setAutoScrolling] = useState(true);
  const [activeIdx, setActiveIdx] = useState(modN(AUTO_START_IDX));
  const [openSlideKey, setOpenSlideKey] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let viewportH = window.innerHeight;
    let pitch = (viewportH * PITCH_VH) / 100;
    let slideH = (viewportH * SLIDE_VH) / 100;
    let dragThresh = (viewportH * DRAG_THRESHOLD_VH) / 100;
    let topPad = (viewportH * TOP_PAD_VH) / 100;

    const recomputeSizes = () => {
      viewportH = window.innerHeight;
      pitch = (viewportH * PITCH_VH) / 100;
      slideH = (viewportH * SLIDE_VH) / 100;
      dragThresh = (viewportH * DRAG_THRESHOLD_VH) / 100;
      topPad = (viewportH * TOP_PAD_VH) / 100;
      if (!autoScrollingRef.current) {
        targetYRef.current = topPad - idxRef.current * pitch;
        yRef.current = targetYRef.current;
      }
    };
    recomputeSizes();
    yRef.current = ((TOP_PAD_VH - AUTO_START_IDX * PITCH_VH) * window.innerHeight) / 100;
    targetYRef.current = yRef.current;

    const maybeWrap = () => {
      while (idxRef.current < N_SLIDES) {
        idxRef.current += N_SLIDES;
        prevIdxRef.current += N_SLIDES;
        const shift = N_SLIDES * pitch;
        yRef.current -= shift;
        targetYRef.current -= shift;
        if (dragRef.current.active) dragRef.current.startTrackY -= shift;
      }
      while (idxRef.current >= (LOOP_COPIES - 1) * N_SLIDES) {
        idxRef.current -= N_SLIDES;
        prevIdxRef.current -= N_SLIDES;
        const shift = N_SLIDES * pitch;
        yRef.current += shift;
        targetYRef.current += shift;
        if (dragRef.current.active) dragRef.current.startTrackY += shift;
      }
    };

    const setIndex = (next: number) => {
      if (next === idxRef.current) return;
      prevIdxRef.current = idxRef.current;
      idxRef.current = next;
      targetYRef.current = topPad - next * pitch;
      setActiveIdx(modN(next));
      maybeWrap();
      restartAutoPlay();
    };

    const restartAutoPlay = () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      if (autoScrollingRef.current) return;
      autoPlayTimerRef.current = setInterval(() => {
        if (!isInteractingRef.current && !autoScrollingRef.current) {
          setIndex(idxRef.current + 1);
        }
      }, AUTO_ADVANCE_MS);
    };

    /* ── Entrance timeline ──────────────────────────────────── */
    const tweenObj = { p: 0 };
    const vhToPx = window.innerHeight / 100;
    const slideEls = slideRefs.current;
    let timelineCompletedOnce = false;

    const onScrollUpdate = () => {
      const p = tweenObj.p;
      const idxF = AUTO_START_IDX + (AUTO_END_IDX - AUTO_START_IDX) * p;
      yRef.current = (TOP_PAD_VH - idxF * PITCH_VH) * vhToPx;
      targetYRef.current = yRef.current;

      const visualPitchPx = PITCH_VH * vhToPx;
      for (let i = 0; i < slideEls.length; i++) {
        const el = slideEls[i];
        if (!el) continue;
        const cache = el as unknown as { __wrap?: HTMLElement | null };
        if (cache.__wrap === undefined) {
          cache.__wrap = el.querySelector("[data-slide-image]") as HTMLElement | null;
        }
        if (cache.__wrap) {
          const visualDyPx = (i - idxF) * visualPitchPx;
          const wrapY = -visualDyPx / IMG_HEIGHT_RATIO;
          cache.__wrap.style.transform = `translate3d(0, ${wrapY.toFixed(2)}px, 0)`;
        }
      }

      const now = performance.now();
      let norm = 1;
      if (lastBlurTsRef.current > 0) {
        const dt = Math.max(now - lastBlurTsRef.current, 1);
        const dp = Math.abs(p - lastBlurPRef.current);
        const idxRange = AUTO_END_IDX - AUTO_START_IDX;
        const idxSpeed = (dp * idxRange) / dt;
        const peakSpeed = (idxRange * 3) / (AUTO_SCROLL_MS);
        norm = Math.min(idxSpeed / peakSpeed, 1);
      }
      lastBlurPRef.current = p;
      lastBlurTsRef.current = now;

      if (blurFilterRef.current) {
        blurFilterRef.current.setAttribute("stdDeviation", `0 ${(norm * 18).toFixed(2)}`);
      }
      if (scanlinesRef.current) {
        scanlinesRef.current.style.opacity = norm.toFixed(3);
      }
    };

    const mainTween = gsap.timeline({
      onUpdate: onScrollUpdate,
      onComplete: () => {
        if (timelineCompletedOnce) return;
        timelineCompletedOnce = true;
        for (let i = 0; i < slideEls.length; i++) {
          const el = slideEls[i];
          if (el) el.style.transform = "";
        }
        if (blurFilterRef.current) blurFilterRef.current.setAttribute("stdDeviation", "0 0");
        autoScrollingRef.current = false;
        setAutoScrolling(false);
        idxRef.current = AUTO_END_IDX;
        prevIdxRef.current = AUTO_END_IDX;
        targetYRef.current = topPad - AUTO_END_IDX * pitch;
        yRef.current = targetYRef.current;
        setActiveIdx(modN(AUTO_END_IDX));
        maybeWrap();
        restartAutoPlay();

        const landing = slideRefs.current[idxRef.current];
        if (landing) {
          const reveals = landing.querySelectorAll<HTMLElement>("[data-reveal]");
          if (reveals.length) {
            gsap.fromTo(
              reveals,
              { autoAlpha: 0, y: 32, filter: "blur(10px)" },
              { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power4.out", stagger: 0.07 }
            );
          }
        }
      },
    });
    mainTween.to(slideEls.filter(Boolean), { autoAlpha: 1, duration: AUTO_FADE_MS / 1000, ease: "power2.out" }, 0);
    mainTween.to(tweenObj, { p: 1, duration: AUTO_SCROLL_MS / 1000, ease: "power3.out" }, 0);

    /* ── rAF loop ────────────────────────────────────────────── */
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const isDragging = dragRef.current.active;
      const wheelActive = now - wheelLastTime.current < WHEEL_PAUSE_MS;
      const isAuto = autoScrollingRef.current;

      if (!isDragging && !wheelActive && !isAuto) {
        const dy = targetYRef.current - yRef.current;
        if (Math.abs(dy) < 0.5) yRef.current = targetYRef.current;
        else yRef.current += dy * EASE;
      }
      track.style.transform = `translate3d(0, ${yRef.current}px, 0)`;
      const y = yRef.current;
      const viewCenter = viewportH / 2;

      for (let i = 0; i < TOTAL_RENDERED; i++) {
        const ref = slideRefs.current[i];
        if (!ref) continue;
        const effectiveTop = i * pitch + y;
        const slideCenter = effectiveTop + slideH / 2;
        const dy = slideCenter - viewCenter;
        const dn = Math.abs(dy) / slideH;

        const content = ref.querySelector("[data-slide-content]") as HTMLElement | null;
        if (dn > 2) {
          if (content && content.style.opacity !== "0") {
            content.style.opacity = "0";
            content.style.filter = "blur(16px)";
          }
          continue;
        }

        const cache = ref as unknown as { __wrap?: HTMLElement | null };
        let wrap = cache.__wrap;
        if (wrap === undefined) {
          wrap = ref.querySelector("[data-slide-image]") as HTMLElement | null;
          cache.__wrap = wrap;
        }
        if (!content) continue;

        if (wrap && !isAuto) {
          const imgY = -dy / IMG_HEIGHT_RATIO;
          wrap.style.transform = `translate3d(0, ${imgY.toFixed(2)}px, 0)`;
        }

        if (isAuto) {
          if (content.style.opacity !== "0") {
            content.style.opacity = "0";
            content.style.filter = "blur(16px)";
          }
          continue;
        }

        const isActive = i === idxRef.current;
        const isLeaving = i === prevIdxRef.current && prevIdxRef.current !== idxRef.current;
        let opacity = 0, blur = 16, cy = 0;

        if (isActive) {
          const t = Math.max(0, Math.min(1, 1 - dn / FADE_THRESHOLD));
          opacity = t * t * (3 - 2 * t);
          blur = (1 - opacity) * 14;
          cy = (1 - opacity) * ENTRY_OFFSET_PX * Math.sign(dy || 1);
        } else if (isLeaving) {
          const fade = Math.max(0, 1 - Math.max(0, dn - 0.6) / 0.6);
          opacity = fade;
          blur = (1 - fade) * 6;
          cy = -dy * PARALLAX_FACTOR;
        }

        content.style.transform = `translate3d(0, ${cy.toFixed(2)}px, 0)`;
        content.style.opacity = opacity.toFixed(3);
        content.style.filter = `blur(${blur.toFixed(2)}px)`;
      }

      /* cursor */
      const cur = cursorRef.current;
      if (cur) {
        const px = cursorPos.current.x;
        const py = cursorPos.current.y;
        if (!cursorInitRef.current && (px !== 0 || py !== 0)) {
          cursorRender.current.x = px;
          cursorRender.current.y = py;
          cursorInitRef.current = true;
        }
        cursorRender.current.x += (px - cursorRender.current.x) * 0.22;
        cursorRender.current.y += (py - cursorRender.current.y) * 0.22;
        const targetOpacity = onSectionRef.current && cursorInitRef.current ? 1 : 0;
        cursorRender.current.opacity += (targetOpacity - cursorRender.current.opacity) * 0.18;
        const targetScale = downRef.current ? 1.18 : 1;
        cursorRender.current.scale += (targetScale - cursorRender.current.scale) * 0.22;

        cur.style.transform = `translate3d(${cursorRender.current.x}px, ${cursorRender.current.y}px, 0) translate(-50%, -50%) scale(${cursorRender.current.scale.toFixed(3)})`;
        cur.style.opacity = cursorRender.current.opacity.toFixed(3);

        const zone = cursorZoneRef.current;
        const isDown = downRef.current;
        const onUi = cursorOnUiRef.current;
        if (cursorScrollRef.current) cursorScrollRef.current.style.opacity = zone === null && !isDown && !onUi ? "1" : "0";
        if (cursorDragRef.current) cursorDragRef.current.style.opacity = isDown && zone === null ? "1" : "0";
        if (cursorUpRef.current) cursorUpRef.current.style.opacity = zone === "top" || (isDown && zone === null) ? "1" : "0";
        if (cursorDownRef.current) cursorDownRef.current.style.opacity = zone === "bottom" || (isDown && zone === null) ? "1" : "0";
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* ── Input handlers ─────────────────────────────────────── */
    const onWheel = (e: WheelEvent) => {
      if (!onSectionRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-no-drag]")) return;
      e.preventDefault();
      const delta = Math.max(-WHEEL_PER_EVENT_CAP, Math.min(WHEEL_PER_EVENT_CAP, e.deltaY));
      yRef.current -= delta;
      wheelLastTime.current = performance.now();
      const idealFloat = (topPad - yRef.current) / pitch;
      const nearest = Math.round(idealFloat);
      if (nearest !== idxRef.current) setIndex(nearest);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!onSectionRef.current) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-no-drag]")) return;
      isInteractingRef.current = true;
      wheelLastTime.current = 0;
      dragRef.current.active = true;
      dragRef.current.startClientY = e.clientY;
      dragRef.current.startTrackY = yRef.current;
      dragRef.current.delta = 0;
      dragRef.current.pointerId = e.pointerId;
      downRef.current = true;
      try { section.setPointerCapture(e.pointerId); } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      cursorPos.current.x = e.clientX;
      cursorPos.current.y = e.clientY;
      const topThreshold = (window.innerHeight * MASK_VH) / 100;
      const bottomThreshold = window.innerHeight - (window.innerHeight * MASK_VH) / 100;
      if (e.clientY < topThreshold) cursorZoneRef.current = "top";
      else if (e.clientY > bottomThreshold) cursorZoneRef.current = "bottom";
      else cursorZoneRef.current = null;
      cursorOnUiRef.current = !!(e.target as HTMLElement | null)?.closest("[data-no-drag]");

      if (!dragRef.current.active) return;
      const delta = e.clientY - dragRef.current.startClientY;
      dragRef.current.delta = delta;
      yRef.current = dragRef.current.startTrackY + delta;
    };

    const endDrag = (committed: boolean) => {
      const delta = dragRef.current.delta;
      const zone = cursorZoneRef.current;
      dragRef.current.active = false;
      downRef.current = false;
      isInteractingRef.current = false;
      restartAutoPlay();
      if (!committed) return;

      if (zone && Math.abs(delta) < 8) {
        const next = idxRef.current + (zone === "top" ? -1 : 1);
        setOpenSlideKey(null);
        setIndex(next);
        return;
      }
      if (Math.abs(delta) > dragThresh) {
        const next = idxRef.current + (delta < 0 ? 1 : -1);
        setIndex(next);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      try { section.releasePointerCapture(dragRef.current.pointerId); } catch {}
      endDrag(true);
    };
    const onPointerCancel = () => {
      dragRef.current.delta = 0;
      yRef.current = dragRef.current.startTrackY;
      endDrag(false);
    };
    const onEnter = () => { onSectionRef.current = true; };
    const onLeave = () => { onSectionRef.current = false; if (dragRef.current.active) endDrag(true); };
    const onResize = () => recomputeSizes();
    const onKey = (e: KeyboardEvent) => {
      if (!onSectionRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); setIndex(idxRef.current + 1); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); setIndex(idxRef.current - 1); }
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenSlideKey(null); };

    section.addEventListener("wheel", onWheel, { passive: false });
    section.addEventListener("pointerdown", onPointerDown);
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerup", onPointerUp);
    section.addEventListener("pointercancel", onPointerCancel);
    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keydown", onEsc);

    (section as unknown as { __navigate?: (i: number) => void }).__navigate = (targetMod: number) => {
      const currentMod = modN(idxRef.current);
      let diff = targetMod - currentMod;
      if (diff > N_SLIDES / 2) diff -= N_SLIDES;
      else if (diff < -N_SLIDES / 2) diff += N_SLIDES;
      if (diff === 0) return;
      setIndex(idxRef.current + diff);
    };

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      cancelAnimationFrame(raf);
      mainTween.kill();
      section.removeEventListener("wheel", onWheel);
      section.removeEventListener("pointerdown", onPointerDown);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerup", onPointerUp);
      section.removeEventListener("pointercancel", onPointerCancel);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  const handlePipClick = (i: number) => {
    const nav = (sectionRef.current as unknown as { __navigate?: (i: number) => void })?.__navigate;
    nav?.(i);
  };

  const openSlide = HERO_SLIDES.find((s) => s.id === openSlideKey) || null;

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden select-none [--hero-pad-x:7.5dvh] max-sm:[--hero-pad-x:2dvh]"
      style={{ background: "var(--color-cream)", cursor: "none" }}
    >
      <svg aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0 }}>
        <defs>
          <filter id="hero-motion-blur" x="-5%" y="-25%" width="110%" height="150%">
            <feGaussianBlur ref={blurFilterRef} in="SourceGraphic" stdDeviation="0 0" />
          </filter>
        </defs>
      </svg>

      <div
        ref={trackRef}
        className="absolute inset-x-0 top-0 will-change-transform"
        style={{
          touchAction: "none",
          paddingLeft: "var(--hero-pad-x)",
          paddingRight: "var(--hero-pad-x)",
          transform: `translate3d(0, ${TOP_PAD_VH - AUTO_START_IDX * PITCH_VH}dvh, 0)`,
          filter: autoScrolling ? "url(#hero-motion-blur)" : undefined,
        }}
      >
        {Array.from({ length: TOTAL_RENDERED }).map((_, i) => {
          const slide = HERO_SLIDES[modN(i)];
          const isFirst = i === AUTO_END_IDX;
          return (
            <SlideFrame
              key={i}
              slide={slide}
              isFirst={isFirst}
              isOpen={openSlideKey === slide.id}
              onExplore={() => setOpenSlideKey(slide.id)}
              assignRef={(el) => { slideRefs.current[i] = el; }}
            />
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30" style={{ height: `${MASK_VH}dvh`, background: `linear-gradient(180deg, var(--color-cream) 0%, rgba(255,250,240,0) 100%)` }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30" style={{ height: `${MASK_VH}dvh`, background: `linear-gradient(0deg, var(--color-cream) 0%, rgba(255,250,240,0) 100%)` }} />

      {autoScrolling && (
        <div
          ref={scanlinesRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,250,240,0.06) 0px, rgba(255,250,240,0.06) 1px, transparent 1px, transparent 3px)",
            mixBlendMode: "screen",
            opacity: 1,
          }}
        />
      )}

      <ReelIndicator
        activeIdx={activeIdx}
        total={N_SLIDES}
        onPipClick={handlePipClick}
        hidden={openSlideKey != null}
      />

      <DetailsPanel open={!!openSlide} slide={openSlide} onClose={() => setOpenSlideKey(null)} />

      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50"
        style={{ width: CURSOR_SIZE, height: CURSOR_SIZE, opacity: 0, willChange: "transform, opacity" }}
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-0 rounded-full border" style={{ borderColor: "rgba(26,26,26,0.45)" }} />
          <div ref={cursorScrollRef} className="absolute inset-0 flex items-center justify-center" style={{ transition: "opacity 180ms ease" }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em]" style={{ color: "var(--color-ink)", fontFamily: "var(--font-ui)" }}>DRAG</span>
          </div>
          <div ref={cursorDragRef} className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0, transition: "opacity 160ms ease" }}>
            <Hand size={20} color="var(--color-ink)" strokeWidth={1.8} />
          </div>
          <div ref={cursorUpRef} className="absolute" style={{ bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", opacity: 0, transition: "opacity 160ms ease" }}>
            <ChevronUp size={20} color="var(--color-ink)" strokeWidth={1.8} />
          </div>
          <div ref={cursorDownRef} className="absolute" style={{ top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", opacity: 0, transition: "opacity 160ms ease" }}>
            <ChevronDown size={20} color="var(--color-ink)" strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SlideFrame ───────────────────────── */
function SlideFrame({
  slide, isFirst, isOpen, onExplore, assignRef,
}: {
  slide: HeroSlide; isFirst: boolean; isOpen: boolean; onExplore: () => void;
  assignRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={assignRef}
      className="relative w-full"
      style={{ height: `${SLIDE_VH}dvh`, marginBottom: `${GAP_VH}dvh`, perspective: "2000px", opacity: 0 }}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          borderRadius: "32px",
          transformOrigin: "0% 50%",
          transformStyle: "preserve-3d",
          transform: isOpen ? "rotateY(15deg)" : undefined,
          transition: "transform 700ms cubic-bezier(0.22,1,0.36,1), box-shadow 700ms cubic-bezier(0.22,1,0.36,1)",
          boxShadow: isOpen
            ? "0 30px 80px -20px rgba(0,0,0,0.55), 0 8px 30px -10px rgba(0,0,0,0.35)"
            : "0 24px 60px -15px rgba(20,33,26,0.18), 0 10px 24px -10px rgba(20,33,26,0.12)",
        }}
      >
        <div
          data-slide-image
          className="absolute inset-0 w-full h-full"
          style={{
            willChange: "transform",
          }}
        >
          <img
            src={`/images/assets/hero/${slide.imageAsset}`}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority={isFirst ? "high" : "auto"}
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,12,9,0.35) 0%, rgba(10,12,9,0.02) 25%, rgba(10,12,9,0.02) 70%, rgba(10,12,9,0.5) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(80% 70% at 50% 50%, transparent 45%, rgba(10,12,9,0.4) 100%)" }} />
        </div>

        <div data-slide-content className="absolute inset-0 will-change-[opacity,filter,transform]" style={{ opacity: 0, filter: "blur(16px)" }}>
          <SlideContent slide={slide} onExplore={onExplore} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── SlideContent ─────────────────────── */
function SlideContent({ slide, onExplore }: { slide: HeroSlide; onExplore: () => void }) {
  const cream = "var(--color-cream)";
  return (
    <div className="relative h-full w-full p-[5.5dvh_6dvh] max-sm:p-[3dvh]" style={{ color: cream }}>
      {/* Top-left: season + eyebrow */}
      <div className="absolute left-[6dvh] top-[5.5dvh] flex flex-col gap-3 max-sm:left-[3dvh] max-sm:top-[3dvh] max-sm:gap-2" data-reveal>
        <div className="text-[clamp(1.1rem,2.1dvh,2rem)] leading-none" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: cream, opacity: 0.9 }}>
          {slide.season}
        </div>
        <div className="text-[10px] max-sm:text-[8.5px] font-medium uppercase tracking-[0.32em] max-sm:tracking-[0.24em]" style={{ fontFamily: "var(--font-ui)", color: "rgba(255,250,240,0.65)" }}>
          {slide.eyebrow}
        </div>
      </div>

      {/* Center-left: category + title + stylist/category row */}
      <div className="absolute left-[6dvh] flex flex-col gap-5 max-sm:left-[3dvh] max-sm:gap-3" style={{ bottom: "9dvh" }} data-reveal>
        <div className="text-[10px] max-sm:text-[8.5px] font-medium uppercase tracking-[0.4em] max-sm:tracking-[0.28em]" style={{ fontFamily: "var(--font-ui)", color: "rgba(255,250,240,0.55)" }}>
          {slide.category}
        </div>
        <h2
          className="font-semibold uppercase text-[clamp(2.2rem,8.5dvh,9rem)] max-sm:text-[clamp(1.5rem,5.5dvh,2.4rem)]"
          style={{ fontFamily: "var(--font-display)", lineHeight: 0.92, letterSpacing: "-0.02em", color: cream }}
        >
          {slide.titleLines.map((line, i) => <span key={i} className="block">{line}</span>)}
        </h2>
        <div className="flex flex-col gap-1.5 text-[10px] max-sm:text-[8.5px] font-medium uppercase tracking-[0.32em] max-sm:tracking-[0.22em]" style={{ fontFamily: "var(--font-ui)" }}>
          <div className="flex items-baseline gap-3 max-sm:gap-2">
            <span style={{ color: "rgba(255,250,240,0.45)" }}>STYLED BY</span>
            <span style={{ color: "rgba(255,250,240,0.9)" }}>{slide.stylist}</span>
          </div>
          <div className="flex items-baseline gap-3 max-sm:gap-2">
            <span style={{ color: "rgba(255,250,240,0.45)" }}>COLORWAY</span>
            <span style={{ color: "rgba(255,250,240,0.9)" }}>{slide.stats.colorway}</span>
          </div>
        </div>
      </div>

      {/* Right: press acclaim stack */}
      <div className="absolute right-[6dvh] top-1/2 flex flex-col max-sm:hidden" style={{ transform: "translateY(-50%)" }}>
        <div className="flex flex-col gap-7" data-reveal>
          {slide.press.map((p, i) => (
            <div key={i} className="flex flex-col items-end gap-1.5 text-right">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className="text-[12px]" style={{ color: s < p.rating ? "var(--color-red)" : "rgba(255,250,240,0.18)" }}>★</span>
                ))}
              </div>
              <div className="text-[9.5px] font-medium uppercase tracking-[0.32em]" style={{ fontFamily: "var(--font-ui)", color: "rgba(255,250,240,0.55)" }}>
                {p.label}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, lineHeight: 1.2, maxWidth: "16ch", color: "rgba(255,250,240,0.95)" }}>
                &ldquo;{p.quote}&rdquo;
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── ReelIndicator ────────────────────── */
function ReelIndicator({ activeIdx, total, onPipClick, hidden }: { activeIdx: number; total: number; onPipClick: (i: number) => void; hidden: boolean }) {
  return (
    <div
      className={`absolute right-[3.5dvh] top-1/2 z-40 flex flex-col items-end gap-3 transition-opacity duration-400 ease-out ${hidden ? "pointer-events-none opacity-0" : "pointer-events-none opacity-100"}`}
      style={{ transform: "translateY(-50%)" }}
      aria-hidden={hidden}
    >
      <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, color: "var(--color-ink)", opacity: 0.75 }}>
        {String(activeIdx + 1).padStart(2, "0")}
      </div>
      <div data-no-drag className="pointer-events-auto flex flex-col items-center">
        {Array.from({ length: total }).map((_, i) => {
          const active = i === activeIdx;
          return (
            <button key={i} type="button" onClick={(e) => { e.stopPropagation(); onPipClick(i); }} aria-label={`Go to look ${i + 1}`} className="flex h-5 w-5 items-center justify-center" style={{ cursor: "pointer" }}>
              <span className="rounded-full" style={{ width: active ? 6 : 4, height: active ? 6 : 4, background: active ? "var(--color-red)" : "rgba(26,26,26,0.25)", transition: "all 320ms cubic-bezier(0.16,1,0.3,1)" }} />
            </button>
          );
        })}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, color: "var(--color-ink)", opacity: 0.45 }}>
        {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

/* ───────────────────────── DetailsPanel ─────────────────────── */
function DetailsPanel({ open, slide, onClose }: { open: boolean; slide: HeroSlide | null; onClose: () => void }) {
  return (
    <>
      <div
        data-no-drag
        aria-hidden={!open}
        onClick={onClose}
        className={`absolute z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          top: `${TOP_PAD_VH}dvh`, height: `${SLIDE_VH}dvh`,
          left: "var(--hero-pad-x)", right: "var(--hero-pad-x)",
          borderRadius: "32px", overflow: "hidden",
          backgroundColor: open ? "rgba(10,12,9,0.35)" : "rgba(10,12,9,0)",
          backdropFilter: open ? "blur(14px) saturate(120%)" : "blur(0px)",
          transition: "background-color 600ms cubic-bezier(0.22,1,0.36,1), backdrop-filter 600ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      <aside
        data-no-drag
        aria-hidden={!open}
        className="absolute z-50 flex flex-col w-[min(640px,52%)] max-sm:w-[calc(100vw-2*var(--hero-pad-x))]"
        style={{
          top: `${TOP_PAD_VH}dvh`, height: `${SLIDE_VH}dvh`, right: "var(--hero-pad-x)",
          borderRadius: "32px", overflow: "hidden",
          transform: open ? "translateX(0)" : "translateX(calc(100% + var(--hero-pad-x) + 2dvh))",
          transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)",
          background: "linear-gradient(180deg, rgba(20,33,26,0.9) 0%, rgba(10,12,9,0.95) 100%)",
          backdropFilter: "blur(20px) saturate(140%)",
          border: "1px solid rgba(255,250,240,0.08)",
          boxShadow: open ? "-30px 0 80px -20px rgba(0,0,0,0.6)" : "none",
          willChange: "transform",
        }}
      >
        {slide && (
          <>
            <div className="h-full w-full overflow-y-auto" style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}>
              <div className="relative w-full overflow-hidden" style={{ height: "35dvh" }}>
                <img src={`/images/assets/hero/${slide.imageAsset}`} alt="" draggable={false} className="absolute inset-0 h-full w-full" style={{ objectFit: "cover" }} />
                <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(180deg, rgba(10,12,9,0) 0%, rgba(10,12,9,0.85) 80%, rgba(10,12,9,1) 100%)" }} />
              </div>
              <div className="px-[3.5dvh] pb-[4dvh] pt-[1dvh]" style={{ color: "var(--color-cream)" }}>
                <div className="text-[10px] font-medium uppercase tracking-[0.36em]" style={{ fontFamily: "var(--font-ui)", color: "rgba(255,250,240,0.55)" }}>{slide.eyebrow}</div>
                <h2 className="mt-3 font-semibold uppercase" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.6dvh,4rem)", lineHeight: 0.95, letterSpacing: "-0.015em" }}>
                  {slide.titleLines.map((line, i) => <span key={i} className="block">{line}</span>)}
                </h2>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[10.5px] font-medium uppercase tracking-[0.32em]" style={{ fontFamily: "var(--font-ui)", color: "rgba(255,250,240,0.75)" }}>
                  <span><span style={{ color: "rgba(255,250,240,0.45)" }}>STYLED BY</span> <span style={{ color: "rgba(255,250,240,0.95)" }}>{slide.stylist}</span></span>
                  <span style={{ color: "rgba(255,250,240,0.3)" }}>·</span>
                  <span style={{ color: "rgba(255,250,240,0.95)" }}>{slide.season}</span>
                  <span style={{ color: "rgba(255,250,240,0.3)" }}>·</span>
                  <span style={{ color: "rgba(255,250,240,0.75)" }}>{slide.category}</span>
                </div>
                <div className="my-6 h-px w-full" style={{ background: "rgba(255,250,240,0.1)" }} />
                <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15.5, lineHeight: 1.65, color: "rgba(255,250,240,0.85)" }}>{slide.description}</p>
                <div className="my-6 h-px w-full" style={{ background: "rgba(255,250,240,0.1)" }} />
                <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                  <Stat label="CONSTRUCTION" value={slide.stats.construction} />
                  <Stat label="SILHOUETTE" value={slide.stats.silhouette} />
                  <Stat label="FABRICATION" value={slide.stats.fabrication} />
                  <Stat label="WEIGHT" value={slide.stats.weight} />
                  <Stat label="FIT" value={slide.stats.fit} />
                  <Stat label="REGION" value={slide.stats.region} />
                </div>
                <div className="my-6 h-px w-full" style={{ background: "rgba(255,250,240,0.1)" }} />
                <div className="flex flex-col gap-3">
                  {slide.press.map((p, i) => (
                    <div key={i} className="flex items-baseline gap-3">
                      <div className="flex shrink-0 items-center gap-[2px]">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <span key={s} className="text-[11px]" style={{ color: s < p.rating ? "var(--color-red)" : "rgba(255,250,240,0.18)" }}>★</span>
                        ))}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-[0.32em] shrink-0" style={{ fontFamily: "var(--font-ui)", color: "rgba(255,250,240,0.55)" }}>{p.label}</div>
                      <div className="flex-1 text-[13px] leading-tight" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "rgba(255,250,240,0.9)" }}>&ldquo;{p.quote}&rdquo;</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button" onClick={onClose} aria-label="Close details"
              className="absolute right-[3dvh] top-[3dvh] z-10 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors"
              style={{ border: "1px solid rgba(255,250,240,0.3)", background: "rgba(10,12,9,0.4)", color: "rgba(255,250,240,0.85)", cursor: "pointer" }}
            >
              <X size={14} strokeWidth={1.6} />
            </button>
          </>
        )}
      </aside>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[9.5px] font-medium uppercase tracking-[0.32em]" style={{ fontFamily: "var(--font-ui)", color: "rgba(255,250,240,0.45)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1.2, color: "rgba(255,250,240,0.95)" }}>{value}</div>
    </div>
  );
}