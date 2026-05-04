"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/jesko/#hero", numeral: "i" },
  {
    label: "Story",
    href: "/jesko/#story",
    numeral: "ii",
    subtitle: "Upcoming shows",
  },
  {
    label: "Music",
    href: "/jesko/#previews",
    numeral: "iii",
    subtitle: "New Release",
  },
  {
    label: "Roadmap",
    href: "/jesko/#events",
    numeral: "iv",
    subtitle: "Merch",
  },
  { label: "Contact", href: "/jesko/#contact", numeral: "v" },
]; // add SHOP later

const footerLeft = [
  { label: "Studio A", href: "#" },
  { label: "Studio B", href: "#" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Spotify", href: "#" },
  { label: "Twitter", href: "#" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Floating top bar */}
      <header className="fixed inset-x-0 top-0 z-90 flex items-center justify-between p-6 mix-blend-difference pointer-events-none">
        <Link
          href="/jesko/#hero"
          className="pointer-events-auto font-display text-white font-bold text-[clamp(1rem,2vw,2.5rem)] tracking-tight h-16"
        >
          <div className="relative w-32 h-full">
            <Image
              src={"/jesko/logo/jesko_w.svg"}
              alt="JESKO"
              fill
              className="object-cover"
              loading="eager"
              priority
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="pointer-events-auto relative h-10 w-10 flex items-center justify-center cursor-pointer"
        >
          <span
            className={`absolute block h-2 w-8 bg-white transition-transform duration-500 ${
              open ? "rotate-225" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute block h-2 w-8 bg-white transition-transform duration-500 ${
              open ? "rotate-315" : "translate-y-1.5"
            }`}
          />
        </button>
      </header>

      {/* Fullscreen menu */}
      <div
        className={`fixed inset-0 z-80 bg-black text-white flex flex-col transition-opacity duration-500 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Middle: image + nav, vertically centered, never overflows */}
        <div className="flex-1 min-h-0 flex items-center justify-center px-6 md:px-16 pt-24 pb-6 overflow-y-auto">
          <div className="w-full max-w-7xl flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Portrait image */}
            <div className="hidden md:block w-5/12 shrink-0">
              <div className="relative aspect-4/5 w-full bg-neutral-900 overflow-hidden">
                {/* Swap for <Image src="/menu.jpg" alt="" fill className="object-cover" /> */}
              </div>
            </div>

            {/* Nav list */}
            <nav className="w-full md:w-7/12 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 md:gap-6 border-b border-white/20 py-3 md:py-4 hover:border-white transition-colors"
                >
                  <span className="text-xs italic tracking-widest text-white/50 w-4 shrink-0">
                    {item.numeral}
                  </span>
                  <span className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-none">
                    {item.label}
                  </span>
                  {item.subtitle && (
                    <span className="text-xs md:text-sm text-white/60 ml-auto hidden sm:block">
                      {item.subtitle}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-end justify-between text-xs md:text-sm uppercase tracking-widest px-6 md:px-16 pb-6">
          <div className="flex gap-4 md:gap-8">
            {footerLeft.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="hover:text-white/70 transition"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 md:gap-8">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="hover:text-white/70 transition"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
