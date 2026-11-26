"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Heart, Plus, MousePointer, ArrowRight } from "lucide-react";
import { LOOKS } from "@/lib/data/lookbook";

const N = LOOKS.length;
const FIRST = 1;
const AUTO_ROTATE_MS = 4500;

// Runway perspective scales (Model height maximized to 98% of stage for full dramatic stature)
const KX = [1.16, 0.72, 0.46, 0.31, 0.20, 0.12, 0.06];
const KF = [1.02, 0.95, 0.88, 0.82, 0.76, 0.71, 0.67];
const KH = [1, 0.72, 0.52, 0.40, 0.31, 0.24, 0.18]; // Active model = 98% of stage height
const KB = [0, 0, 1.2, 3.5, 7, 11, 16];
const KO = [1, 1, 0.95, 0.9, 0.75, 0.45, 0];

const wrap = (x: number, n: number) => ((x % n) + n) % n;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export default function LookbookRunway() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const modelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cartCountRef = useRef<HTMLSpanElement | null>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Runway physics refs
  const targetRef = useRef(0);
  const pRef = useRef(0);
  const dirtyRef = useRef(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance looks
  const advance = useCallback(() => {
    targetRef.current = Math.round(targetRef.current) + 1;
    dirtyRef.current = true;
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      advance();
    }, AUTO_ROTATE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, advance]);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, base = 0;
    let last = 0;
    let mx = 0, my = 0, cx = 0, cy = 0;
    let down = false, sx = 0, st = 0, moved = 0;
    let raf = 0;

    const modelState = LOOKS.map(() => ({ f: "", o: "" }));

    function size() {
      if (!stage) return;
      W = stage.clientWidth;
      H = stage.clientHeight;
      if (W === 0 || H === 0) return;
      // Generous model baseline: base = H so active model is bold and tall
      base = H;
      modelRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = W * 0.95 + "px"; // width matches source 1408x768 aspect
        el.style.height = base + "px";
        el.style.overflow = "visible";
      });
      dirtyRef.current = true;
    }

    function paint() {
      if (W === 0 || H === 0) return;
      const currentP = pRef.current;

      modelRefs.current.forEach((el, i) => {
        if (!el) return;
        let d = wrap(i - currentP, N);
        if (d > N - 1) d -= N;
        const k = clamp(d + 1, 0, 6);
        const a = Math.floor(k);
        const b = Math.min(6, a + 1);
        const t = k - a;
        const mix = (arr: number[]) => arr[a] + (arr[b] - arr[a]) * t;

        const h = mix(KH) * H;
        const s = h / base;
        const w = (1408 / 768) * h;
        const x = mix(KX) * W - w * 0.45;
        const y = mix(KF) * H - h;

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;

        const f = mix(KB) / Math.max(s, 0.1);
        const fs = f < 0.2 ? "none" : `blur(${f.toFixed(1)}px)`;
        const o = mix(KO).toFixed(3);
        const state = modelState[i];
        if (fs !== state.f) { state.f = fs; el.style.filter = fs; }
        if (o !== state.o) { state.o = o; el.style.opacity = o; }
        el.style.zIndex = String(100 - Math.round(d * 10));
      });
    }

    function frame(now: number) {
      const dt = Math.min(50, now - last) || 16;
      last = now;
      const was = pRef.current;

      if (calm) pRef.current = targetRef.current;
      else pRef.current += (targetRef.current - pRef.current) * (1 - Math.exp(-dt * 0.0075));

      if (Math.abs(targetRef.current - pRef.current) < 0.0004) pRef.current = targetRef.current;

      // Update current active index for React state
      const currentIdx = wrap(Math.round(pRef.current), N);
      setActiveIdx((prev) => (prev !== currentIdx ? currentIdx : prev));

      if (pRef.current !== was || dirtyRef.current) {
        dirtyRef.current = false;
        paint();
      }

      cx += (mx - cx) * 0.35;
      cy += (my - cy) * 0.35;
      ring!.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;

      raf = requestAnimationFrame(frame);
    }

    const PULL = () => Math.max(160, W * 0.22);

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") ring!.style.opacity = "1";
    };
    const onPointerLeave = () => {
      ring!.style.opacity = "0";
    };
    const onPointerMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      targetRef.current = st + dx / PULL();
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a") || t.closest("button")) return;
      down = true;
      sx = e.clientX;
      st = targetRef.current;
      moved = 0;
      try { stage.setPointerCapture(e.pointerId); } catch {}
      ring!.style.transform += " scale(1.15)";
    };
    const release = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      if (moved < 6) {
        const els = document.elementsFromPoint(e.clientX, e.clientY);
        const hit = els.find((x) => x instanceof HTMLElement && x.dataset.modelIdx !== undefined) as HTMLElement | undefined;
        if (hit) {
          let d = wrap(Number(hit.dataset.modelIdx) - targetRef.current, N);
          d = Math.round(d);
          if (d > 0 && d < N) targetRef.current = Math.round(targetRef.current) + d;
        }
      } else {
        targetRef.current = Math.round(targetRef.current);
      }
    };

    const onResize = () => size();

    stage.addEventListener("pointerenter", onPointerEnter);
    stage.addEventListener("pointerleave", onPointerLeave);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    window.addEventListener("resize", onResize);

    size();
    paint();
    requestAnimationFrame(() => { size(); paint(); });

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerenter", onPointerEnter);
      stage.removeEventListener("pointerleave", onPointerLeave);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointerup", release);
      stage.removeEventListener("pointercancel", release);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const currentLook = LOOKS[activeIdx] || LOOKS[0];

  const toggleFav = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.setAttribute("aria-pressed", btn.getAttribute("aria-pressed") !== "true" ? "true" : "false");
  };

  const addToCart = () => {
    if (cartCountRef.current) {
      cartCountRef.current.textContent = String(Number(cartCountRef.current.textContent) + 1);
    }
  };

  return (
    <section
      style={{
        position: "relative",
        height: "100dvh",
        minHeight: 640,
        background: "var(--color-cream)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          height: "100%",
        }}
        className="max-md:!grid-cols-1 max-md:!grid-rows-[1fr_260px]"
      >
        {/* ── STAGE (LHS) ── */}
        <div
          ref={stageRef}
          tabIndex={0}
          aria-label="Runway looks."
          style={{
            position: "relative",
            overflow: "hidden",
            minWidth: 0,
            touchAction: "pan-y",
            userSelect: "none",
            cursor: "none",
            background:
              "linear-gradient(transparent 60%, rgba(255,250,240,0.72) 100%), linear-gradient(90deg, #f4efe4 0%, #ece6d6 38%, #f1ece0 62%, #fbf8f0 100%)",
          }}
        >
          {/* Models Runway */}
          <div style={{ position: "absolute", inset: 0 }}>
            {LOOKS.map((look, i) => (
              <div
                key={look.id}
                data-model-idx={i}
                ref={(el) => { modelRefs.current[i] = el; }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 0,
                  height: 0,
                  overflow: "visible",
                  transformOrigin: "0 0",
                  willChange: "transform",
                }}
              >
                <img
                  src={`/assets/lookbook/models/${look.modelImage}`}
                  alt=""
                  draggable={false}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "bottom",
                    pointerEvents: "none",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Runway Header */}
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              left: "clamp(24px, 5vw, 84px)",
              top: "clamp(40px, 7dvh, 70px)",
              width: "min(460px, 42vw)",
              pointerEvents: "none",
            }}
            className="max-sm:!left-5 max-sm:!top-5 max-sm:!w-[calc(100%-2.5rem)]"
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(2.2rem, 3.8vw, 3.4rem)",
                letterSpacing: "0.04em",
                color: "var(--color-ink)",
                lineHeight: 1,
              }}
            >
              SS26 Runway
            </h2>
            <p
              className="max-sm:!hidden"
              style={{
                marginTop: "1.2rem",
                fontFamily: "var(--font-ui)",
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "rgba(26,26,26,0.58)",
              }}
            >
              Engineered for motion, cut for the city. The VOLT &amp; ASH line crosses six lines of the wardrobe, built to hold its shape wherever the day takes it.
            </p>
          </div>

          {/* Look indicator & direct link */}
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              left: "clamp(24px, 5vw, 84px)",
              bottom: "clamp(40px, 7dvh, 70px)",
            }}
            className="max-sm:!left-5 max-sm:!bottom-5"
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                fontFamily: "var(--font-ui)",
                fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
                letterSpacing: "0.08em",
                gap: "0.4em",
                pointerEvents: "none",
                color: "var(--color-ink)",
              }}
            >
              <span style={{ fontWeight: 300 }}>Look</span>
              <span style={{ fontWeight: 600, color: "var(--color-red)" }}>
                {String(FIRST + activeIdx).padStart(2, "0")}
              </span>
            </div>

            <Link
              href={`/collections/${currentLook.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "0.8rem",
                fontFamily: "var(--font-ui)",
                fontSize: 11.5,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                paddingBottom: 3,
                borderBottom: "1px solid var(--color-red)",
                color: "var(--color-red)",
              }}
            >
              <span>Shop the look</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Custom Lucide Interactive Cursor Ring */}
          <div
            ref={ringRef}
            style={{
              position: "absolute",
              zIndex: 30,
              left: 0,
              top: 0,
              width: 52,
              height: 52,
              margin: "-26px 0 0 -26px",
              borderRadius: "50%",
              pointerEvents: "none",
              opacity: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 250, 240, 0.45)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(26, 26, 26, 0.35)",
              color: "var(--color-ink)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              transition: "opacity 0.22s ease, transform 0.15s ease",
            }}
            className="max-sm:!hidden"
          >
            <MousePointer size={18} strokeWidth={1.8} className="rotate-[-20deg]" />
          </div>
        </div>

        {/* ── RAIL (RHS: Only shows exactly the 2 products of the ACTIVE look) ── */}
        <aside
          aria-label="Pieces in this look"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#ece6d6",
            borderLeft: "1px solid rgba(26,26,26,0.08)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
          className="max-md:!flex-row max-md:!border-l-0 max-md:!border-t"
        >
          {currentLook.products.slice(0, 2).map((item, i) => (
            <article
              key={`${currentLook.id}-${item.name}`}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "24px 28px",
                background: i % 2 === 0 ? "var(--color-cream)" : "#f3eee2",
                borderBottom: i === 0 ? "1px solid rgba(26,26,26,0.08)" : "none",
                position: "relative",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
              className="max-md:!border-b-0 max-md:!border-r max-md:!p-4"
            >
              {/* Top Row: Favorite button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  aria-pressed="false"
                  aria-label={`Save ${item.name}`}
                  onClick={toggleFav}
                  style={{
                    color: "var(--color-ink)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <Heart size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Product Image Stage */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 0,
                  padding: "10px 0",
                }}
              >
                <img
                  src={`/assets/lookbook/products/${item.image}`}
                  alt={item.name}
                  draggable={false}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.08))",
                  }}
                />
              </div>

              {/* Bottom Row: Name, Price, Add to Cart */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "end",
                  gap: "6px",
                  paddingTop: 12,
                  borderTop: "1px solid rgba(26,26,26,0.06)",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontWeight: 600,
                      fontSize: 11.5,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-ink)",
                    }}
                  >
                    {item.name}
                  </h3>
                  <span
                    style={{
                      display: "block",
                      marginTop: 4,
                      fontFamily: "var(--font-ui)",
                      fontSize: 14,
                      color: "var(--color-ink)",
                      fontWeight: 500,
                    }}
                  >
                    {item.price}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label={`Add ${item.name} to cart`}
                  onClick={addToCart}
                  style={{
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-cream)",
                    background: "var(--color-ink)",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-red)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-ink)")}
                >
                  <Plus size={16} strokeWidth={2} />
                </button>
              </div>
            </article>
          ))}
        </aside>
      </div>

      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
        Cart items added: <span ref={cartCountRef}>0</span>
      </span>
    </section>
  );
}
