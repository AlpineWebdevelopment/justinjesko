"use client";

import { useEffect, useRef, useCallback } from "react";
import styles from "./Hero.module.css";

import { ArrowDownIcon } from "@heroicons/react/24/outline";

const PARTICLE_CONFIG = {
  desktopCount: 70,
  mobileCount: 40,
  connectDist: 120,
  mouseRadius: 150,
  drift: 0.3,
  lineColor: "0,212,255",
  lineOpacity: 0.06,
  dotMinAlpha: 0.3,
  dotMaxAlpha: 0.9,
  dotMinRadius: 1,
  dotMaxRadius: 3,
};

export default function Hero({
  title = "Justin\nJesko",
  subtitle = "DJ \u00B7 Producer \u00B7 Dreamer",
  tagline = "Coming Soon 2026",
  showScrollIndicator,
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  // ── Particle system ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    const {
      desktopCount,
      mobileCount,
      connectDist,
      mouseRadius,
      drift,
      lineColor,
      lineOpacity,
      dotMinAlpha,
      dotMaxAlpha,
      dotMinRadius,
      dotMaxRadius,
    } = PARTICLE_CONFIG;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? mobileCount : desktopCount;

    function resize() {
      sizeRef.current.w = canvas.width = section.offsetWidth;
      sizeRef.current.h = canvas.height = section.offsetHeight;
    }

    function seed() {
      const { w, h } = sizeRef.current;
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * drift,
        vy: (Math.random() - 0.5) * drift,
        r: Math.random() * (dotMaxRadius - dotMinRadius) + dotMinRadius,
        a: Math.random() * (dotMaxAlpha - dotMinAlpha) + dotMinAlpha,
      }));
    }

    function draw() {
      const { w, h } = sizeRef.current;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();

        // Connect
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${lineColor},${lineOpacity * (1 - dist / connectDist)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Mouse repel
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouseRadius) {
          p.x += mdx * 0.005;
          p.y += mdy * 0.005;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();

    function handleResize() {
      resize();
      seed();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Mouse tracking ──
  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  // ── Render ──
  const titleLines = title.split("\n");

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[calc(100vh-32px)] flex flex-col items-center justify-center overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Glow orbs */}
      <div className={`${styles.glow} ${styles.glow1}`} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glow2}`} aria-hidden="true" />

      {/* Grain overlay */}
      <div className={styles.grain} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Subtitle */}
        <p
          className="font-body font-[450] text-[clamp(0.8rem,1vw,1rem)] tracking-[0.4em] uppercase text-muted mb-6 md:mb-8"
          style={{
            animation: "fadeInUp 1s 0.2s both cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {subtitle}
        </p>

        {/* Title */}
        <h1
          className="font-display font-bold text-[clamp(3.5rem,12vw,12rem)] leading-[0.88] tracking-[-0.02em] uppercase text-white"
          style={{
            animation: "fadeInUp 1s 0.4s both cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {titleLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        {tagline && (
          <div
            className="mt-8 md:mt-10 flex items-center justify-center gap-3"
            style={{
              animation: "fadeInUp 1s 0.7s both cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span className="inline-block w-8 h-0.5 bg-accent-jesko/55" />
            <p className="font-display font-black italic text-[clamp(0.7rem,0.9vw,0.8rem)] tracking-[0.35em] uppercase text-accent-jesko/80">
              {tagline}
            </p>
            <span className="inline-block w-8 h-0.5 bg-accent-jesko/55" />
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <a
          href="#story"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{
            animation: "fadeInUp 1s 1s both cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span className="font-display font-black text-sm tracking-[0.3em] uppercase">
            Scroll Down
          </span>
          <ArrowDownIcon
            className={`size-6 stroke-[3.25] ${styles.scrollArrow}`}
          />
        </a>
      )}
    </section>
  );
}
