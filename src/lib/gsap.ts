/**
 * Central GSAP setup. Import { gsap, ScrollTrigger } from here so the
 * ScrollTrigger plugin is registered exactly once, on the client only.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
