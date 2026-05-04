"use client";
import useScrollReveal from "@/lib/useScrollReveal";
import useParallaxBackground from "@/lib/useParallaxBackground";
import SectionLabel from "./SectionLabel";
import WaveformPlayer from "./WaveformPlayer";

const SETS = [
  {
    id: 1,
    title: "First Set Ever",
    artist: "Justin Jesko",
    duration: "58 min",
    date: "Jan 2026",
    slug: "set1",
    cover: "/jesko/images/set01.jpg",
    lngth: 3467,
  },
  {
    id: 2,
    title: "Second Set",
    artist: "Justin Jesko",
    duration: "56 min",
    date: "Feb 2026",
    slug: "set2",
    cover: "/jesko/images/set02.jpg",
    lngth: 3359,
  },
  {
    id: 3,
    title: "Third Set",
    artist: "Justin Jesko",
    duration: "63 min",
    date: "Apr 2026",
    slug: "set3",
    cover: "/jesko/images/set03.jpg",
    lngth: 3772,
  },
];

export default function DJSets() {
  const [ref, vis] = useScrollReveal(0.5);
  const [sectionRef, bgTextRef] = useParallaxBackground(1.0);

  return (
    <section
      id="sets"
      ref={sectionRef}
      className="relative bg-white text-black overflow-hidden -scroll-mt-36"
    >
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[clamp(5rem,50vw,10rem)] min-[512px]:text-[clamp(6rem,18vw,16rem)] -rotate-90 min-[512px]:rotate-0  [-webkit-text-stroke:2px_#00000012] font-display font-[650] uppercase text-transparent whitespace-nowrap tracking-tight">
          DJ SETS
        </span>
      </div>

      <div
        ref={ref}
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-36"
      >
        <div
          className={`transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel text="DJ SETS" />
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight tracking-tight mt-2">
            Mixes & Live Sets
          </h2>
          <p className="text-muted mt-3 max-w-lg font-seriff font-medium">
            Full-length DJ sets you can stream right here or request a download
            for offline listening.
          </p>
        </div>

        <div
          className={`mt-12 transition-all duration-1200 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-2">
            {SETS.map((set, i) => (
              <div
                key={set.id}
                className={`bg-black/2 rounded-xl px-5 py-2 transition-all duration-700 hover:bg-black/4 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionProperty: "opacity, transform, background-color",
                  transitionDelay: vis
                    ? `${400 + i * 120}ms, ${400 + i * 120}ms, 0ms`
                    : "0ms, 0ms, 0ms",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted font-body">
                    {set.date} &middot; {set.duration}
                  </span>
                </div>
                <WaveformPlayer
                  slug={set.slug}
                  title={set.title}
                  artist={set.artist}
                  cover={set.cover}
                  dark={false}
                  compact
                  lngth={set.lngth}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
