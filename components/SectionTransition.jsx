"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function SectionTransition({
  children,
  fromColor = "#000",
  className = "",
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["256px end", "640px end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className={`relative ${className}`}>
      {children}
      <motion.div
        aria-hidden
        style={{ opacity, backgroundColor: fromColor }}
        className="pointer-events-none absolute inset-0 z-50"
      />
    </section>
  );
}
