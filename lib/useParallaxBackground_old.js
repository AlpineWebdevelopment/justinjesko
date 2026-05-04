"use client";
import { useEffect, useRef } from "react";

/**
 * useParallaxBackground
 * Attach to a section wrapper — returns a ref for the section and a ref for the BG text.
 * The BG text gets a parallax translateY (moves slower than scroll) and fades out
 * as the section scrolls away from the viewport center.
 *
 * @param {number} speed  – parallax multiplier (0 = fixed, 0.3 = subtle, 0.5 = strong)
 * @param {number} fadeStrength – how aggressively opacity drops (0.6–1.0 typical)
 */
export default function useParallaxBackground(
  speed = 0.35,
  fadeStrength = 0.75,
) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    // Set initial GPU-accelerated properties
    text.style.willChange = "transform, opacity";

    let ticking = false;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionH = rect.height;

      // How far the section center is from the viewport center
      const sectionCenter = rect.top + sectionH / 2;
      const viewportCenter = windowH / 2;
      const offset = sectionCenter - viewportCenter;

      // Parallax: shift the text at a fraction of the scroll offset
      // Negative speed so text moves *against* scroll direction (classic parallax feel)
      const y = offset * speed;

      // Fade: opacity goes from 1 (centered) → 0 (scrolled away)
      const normalizedDistance =
        Math.abs(offset) / (Math.max(sectionH, windowH) / 2);
      const opacity = Math.max(
        0,
        Math.min(1, 1 - normalizedDistance * fadeStrength),
      );

      text.style.transform = `translate3d(0, ${y}px, 0)`;
      text.style.opacity = opacity;

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    // Also recalc on resize (viewport change)
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update(); // initial position

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      text.style.willChange = "auto";
    };
  }, [speed, fadeStrength]);

  return [sectionRef, textRef];
}
