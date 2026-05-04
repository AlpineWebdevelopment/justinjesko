"use client";
import { useEffect, useRef } from "react";

/**
 * useParallaxBackground
 *
 * The background text stays locked to the vertical center of the *viewport*
 * (not the section) while the section is in view, then fades out as the
 * section leaves. The text is still a child of the section, so
 * `overflow-hidden` on the section clips it naturally.
 *
 * @param {number} fadeStrength – how aggressively opacity drops (0.5–1.0)
 */
export default function useParallaxBackground(fadeStrength = 0.7) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    text.style.willChange = "transform, opacity";

    let ticking = false;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionH = rect.height;

      // Where the section's center currently sits in the viewport
      const sectionCenter = rect.top + sectionH / 2;
      const viewportCenter = windowH / 2;

      // How much to shift the text so it appears at the viewport center.
      // The text is already flex-centered in the section (at sectionCenter),
      // so we compensate by the difference.
      const offset = viewportCenter - sectionCenter;

      // Fade based on how far the section has scrolled out of view.
      // 0 = section perfectly centered, 1 = section completely off-screen
      const normalizedDistance =
        Math.abs(viewportCenter - sectionCenter) /
        (Math.max(sectionH, windowH) / 2);
      const opacity = Math.max(
        0,
        Math.min(1, 1 - normalizedDistance * fadeStrength),
      );

      text.style.transform = `translate3d(0, ${offset}px, 0)`;
      text.style.opacity = opacity;

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      text.style.willChange = "auto";
    };
  }, [fadeStrength]);

  return [sectionRef, textRef];
}
