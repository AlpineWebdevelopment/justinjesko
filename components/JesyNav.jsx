"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Links point at the real homepage section ids (see each section component's
// `id=`). Using "/#id" (not "#id") so the menu also works from sub-routes like
// /shared/<ref> — it routes home, then scrolls to the section.
// Each item has its own image shown in the menu panel when it's hovered
// (desktop) — placeholders for now; swap the src's for real section art.
const navItems = [
  {
    label: "Home",
    href: "/#hero",
    numeral: "i",
    image: "/jesko/images/set01.jpg",
  },
  {
    label: "Story",
    href: "/#story",
    numeral: "ii",
    subtitle: "The journey",
    image: "/jesko/images/someoneyouloved.jpg",
  },
  {
    label: "Music",
    href: "/#previews",
    numeral: "iii",
    subtitle: "Previews & IDs",
    image: "/jesko/images/butterflies.jpg",
  },
  {
    label: "Sets",
    href: "/#sets",
    numeral: "iv",
    subtitle: "Live mixes",
    image: "/jesko/images/set03.jpg",
  },
  {
    label: "Roadmap",
    href: "/#events",
    numeral: "v",
    subtitle: "Goals & shows",
    image: "/jesko/images/gravity.jpg",
  },
  {
    label: "Contact",
    href: "/#contact",
    numeral: "vi",
    subtitle: "Get in touch",
    image: "/jesko/images/vodoo.jpg",
  },
]; // add SHOP later

const footerLinks = [
  { label: "Newsletter", href: "/#signup" },
  { label: "Bookings", href: "/#contact" },
];

// Placeholder social URLs — swap for the real profiles.
const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Spotify", href: "https://open.spotify.com" },
  { label: "Twitter", href: "https://x.com" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  // Index of the nav item whose image is currently shown in the menu panel.
  const [activeIdx, setActiveIdx] = useState(0);

  // Close and reset the panel image to the default for the next open. Reset
  // happens here (not in an effect) to avoid cascading re-renders.
  const closeMenu = () => {
    setOpen(false);
    setActiveIdx(0);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setActiveIdx(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Floating top bar */}
      <header className="fixed inset-x-0 top-0 z-90 flex items-center justify-between p-6 mix-blend-difference pointer-events-none">
        <Link
          href="/#hero"
          onClick={closeMenu}
          className="pointer-events-auto font-display text-white font-bold text-[clamp(1rem,2vw,2.5rem)] tracking-tight h-16"
        >
          <div className="relative w-32 h-full">
            <Image
              src={"/jesko/logo/jesko_w.svg"}
              alt="JESKO"
              fill
              className="object-contain object-left"
              loading="eager"
              priority
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => (open ? closeMenu() : setOpen(true))}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="pointer-events-auto relative h-10 w-10 flex items-center justify-center cursor-pointer"
        >
          <span
            className={`absolute block h-2 w-8 bg-white transition-all duration-500 ${
              open ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute block h-2 w-8 bg-white transition-all duration-500 ${
              open ? "-rotate-45" : "translate-y-1.5"
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
          <div className="w-full max-w-7xl flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Image — banner on mobile, portrait on desktop. Crossfades to the
                hovered link's image (desktop). Placeholders for now. */}
            <div
              className={`w-full md:w-5/12 shrink-0 transition-all duration-700 ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: open ? "120ms" : "0ms" }}
            >
              <div className="relative w-full h-36 md:h-auto md:aspect-4/5 overflow-hidden rounded-xl md:rounded-2xl bg-neutral-900">
                {navItems.map((item, i) => (
                  <Image
                    key={item.image}
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className={`object-cover transition-opacity duration-500 ${
                      i === activeIdx ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                <span className="absolute bottom-4 left-4 font-seriff text-xl font-semibold italic tracking-tight">
                  {navItems[activeIdx].label}
                </span>
              </div>
            </div>

            {/* Nav list */}
            <nav
              className="w-full md:w-7/12 flex flex-col"
              onMouseLeave={() => setActiveIdx(0)}
            >
              {navItems.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  onMouseEnter={() => setActiveIdx(i)}
                  onFocus={() => setActiveIdx(i)}
                  style={{
                    transitionDelay: open ? `${180 + i * 60}ms` : "0ms",
                  }}
                  className={`group flex items-baseline gap-4 md:gap-6 border-b border-white/20 py-3 md:py-4 hover:border-white transition-all duration-500 ${
                    open
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <span className="text-xs italic tracking-widest text-white/50 w-5 shrink-0">
                    {item.numeral}
                  </span>
                  <span className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-none transition-transform duration-300 group-hover:translate-x-2">
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
        <div className="shrink-0 flex items-end justify-between gap-4 text-xs md:text-sm uppercase tracking-widest px-6 md:px-16 pb-6">
          <div className="flex gap-4 md:gap-8">
            {footerLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={closeMenu}
                className="text-white/70 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 md:gap-8">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
