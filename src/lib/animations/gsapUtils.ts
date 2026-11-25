import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialized = false;

export function initGsap() {
  if (initialized) return;
  gsap.registerPlugin(ScrollTrigger);
  initialized = true;
}

// Call this once you have the Lenis instance, so ScrollTrigger
// recalculates on Lenis's virtual scroll rather than native scroll.
export function syncLenisWithScrollTrigger(lenis: {
  on: (event: string, cb: () => void) => void;
}) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    // Lenis expects ms, gsap ticker gives seconds
  });
}