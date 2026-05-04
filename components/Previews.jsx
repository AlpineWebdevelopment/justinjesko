"use client";
import useScrollReveal from "@/lib/useScrollReveal";
import useParallaxBackground from "@/lib/useParallaxBackground";
import SectionLabel from "./SectionLabel";
import WaveformPlayer from "./WaveformPlayer";

const TRACKS = [
  {
    id: 1,
    title: "BUTTERFLIES",
    artist: "Martin Garrix",
    slug: "butterflies",
    cover: "/jesko/images/butterflies.jpg",
    lngth: 270,
  },
  {
    id: 2,
    title: "GRAVITY",
    artist: "Martin Garrix",
    slug: "gravity",
    cover: "/jesko/images/gravity.jpg",
    lngth: 342,
  },
  {
    id: 3,
    title: "OUR TIME",
    artist: "Martin Garrix",
    slug: "ourtime",
    cover: "/jesko/images/ourtime.jpg",
    lngth: 240,
  },
  {
    id: 4,
    title: "SOMETHING",
    artist: "Martin Garrix",
    slug: "something",
    cover: "/jesko/images/something.jpg",
    lngth: 223,
  },
  {
    id: 5,
    title: "VODOO",
    artist: "Martin Garrix",
    slug: "vodoo",
    cover: "/jesko/images/vodoo.jpg",
    lngth: 245,
  },
];

export default function Previews() {
  const [ref, vis] = useScrollReveal(0.4);
  const [sectionRef, bgTextRef] = useParallaxBackground(1.0);

  return (
    <section
      id="previews"
      ref={sectionRef}
      className="relative bg-white text-black overflow-hidden -scroll-mt-36"
    >
      {/* Big background text */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[clamp(5rem,50vw,10rem)] min-[512px]:text-[clamp(6rem,18vw,16rem)] -rotate-90 min-[512px]:rotate-0  font-display font-bold uppercase text-black/5 whitespace-nowrap tracking-tight">
          PREVIEWS
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
          <SectionLabel text="PREVIEWS / IDs" />
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight tracking-tight mt-2">
            Work in Progress
          </h2>
          <p className="text-muted mt-3 max-w-lg font-seriff font-medium">
            Unreleased tracks currently in development. These are 30-second
            previews &mdash; the full versions are on the way.
          </p>
        </div>

        <div
          className={`mt-12 transition-all duration-1200 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="divide-y divide-black/8">
            {TRACKS.map((track, i) => (
              <div
                key={track.id}
                className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: vis ? `${400 + i * 100}ms` : "0ms" }}
              >
                <WaveformPlayer
                  slug={track.slug}
                  title={track.title}
                  artist={track.artist}
                  cover={track.cover}
                  dark={false}
                  lngth={track.lngth}
                />
              </div>
            ))}
          </div>

          <p className="text-center text-muted text-xs mt-8 font-body">
            These previews are work-in-progress demos. Final versions may
            differ.
          </p>
        </div>
      </div>
    </section>
  );
}
