"use client";
import useScrollReveal from "@/lib/useScrollReveal";

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com/justinjesko",
    icon: "M16 3H8a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5V8a5 5 0 00-5-5zm3.5 13a3.5 3.5 0 01-3.5 3.5H8A3.5 3.5 0 014.5 16V8A3.5 3.5 0 018 4.5h8a3.5 3.5 0 013.5 3.5v8zm-3-8.25a.75.75 0 110-1.5.75.75 0 010 1.5zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.5a3 3 0 110-6 3 3 0 010 6z",
  },
  {
    name: "SoundCloud",
    href: "https://soundcloud.com/justinjesko",
    icon: "M1 18v-3a1 1 0 012 0v3a1 1 0 01-2 0zm4 0v-6a1 1 0 012 0v6a1 1 0 01-2 0zm4 0V9a1 1 0 012 0v9a1 1 0 01-2 0zm4 0V6a1 1 0 012 0v12a1 1 0 01-2 0zm6-12a5 5 0 00-4 2V6a1 1 0 00-2 0v12h6a5 5 0 000-10z",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@justinjesko",
    icon: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@justinjesko",
    icon: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 007.04 6.3 6.34 6.34 0 005.58-6.3V8.7a8.24 8.24 0 004.82 1.56V6.8a4.83 4.83 0 01-1-.11z",
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/artist/justinjesko",
    icon: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  },
];

export default function SocialFooter() {
  const [ref, vis] = useScrollReveal(0.3);

  return (
    <footer
      id="footer"
      ref={ref}
      className="relative bg-black text-white overflow-hidden pb-10 md:pb-14"
    >
      {/* Top accent line */}
      {/* <div className="h-px bg-linear-to-r from-transparent via-accent-jesko/30 to-transparent" /> */}

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-28 pb-10 md:pb-14">
        {/* Social links */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-bold tracking-tight mb-8">
            Follow the journey.
          </h2>

          <div className="flex items-center gap-3 sm:gap-4">
            {SOCIALS.map((s, i) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className={`group flex items-center justify-center size-12 sm:size-16 rounded-lg border-2 border-white/10 text-white/50 hover:text-accent-jesko hover:border-accent-jesko/40 transition-all duration-300 ${
                  vis ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
                style={{ transitionDelay: vis ? `${40 + i * 80}ms` : "0ms" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="group-hover:scale-110 transition-transform duration-200 size-4.5 sm:size-6 lg:size-8"
                >
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-1200 delay-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            vis ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-sm lg:text-base tracking-widest uppercase">
              Justin Jesko
            </span>
            <span className="bg-accent-jesko size-1.5 lg:size-2 rounded-full"></span>
            <span className="text-white/40 text-xs lg:text-sm font-body">
              DJ &middot; Producer
            </span>
          </div>

          <nav className="flex items-center gap-6 text-xs lg:text-sm text-white/40 font-body">
            <a href="#story" className="hover:text-white/70 transition-colors">
              Story
            </a>
            <a
              href="#previews"
              className="hover:text-white/70 transition-colors"
            >
              Music
            </a>
            <a href="#events" className="hover:text-white/70 transition-colors">
              Events
            </a>
            <a href="#sets" className="hover:text-white/70 transition-colors">
              DJ Sets
            </a>
            <a
              href="#contact"
              className="hover:text-white/70 transition-colors"
            >
              Contact
            </a>
          </nav>

          <p className="text-white/40 text-xs lg:text-sm font-body">
            &copy; {new Date().getFullYear()} Justin Jesko. All rights reserved.
          </p>
        </div>
      </div>
      <div
        className={`h-0.5 bg-linear-to-r from-transparent via-accent-jesko/40 to-transparent transition-all duration-1500 delay-700 ${
          vis ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        }`}
      />
    </footer>
  );
}
