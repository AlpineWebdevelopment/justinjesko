"use client";
import useScrollReveal from "@/lib/useScrollReveal";
import useParallaxBackground from "@/lib/useParallaxBackground_old";
import SectionLabel from "./SectionLabel";

export default function TheStory() {
  const [revealRef, vis] = useScrollReveal(0.3);
  const [sectionRef, bgTextRef] = useParallaxBackground(0.5, 1.0);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative bg-black text-white overflow-hidden -scroll-mt-16"
    >
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[clamp(5rem,50vw,10rem)] min-[512px]:text-[clamp(6rem,18vw,16rem)] -rotate-90 min-[512px]:rotate-0  [-webkit-text-stroke:2px_#ffffff40] font-display font-[650] uppercase text-transparent whitespace-nowrap tracking-tight">
          THE STOTRY
        </span>
      </div>

      <div
        ref={revealRef}
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-36"
      >
        <div
          className={`transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel text="THE STORY" dark />
        </div>

        <div className="grid md:grid-cols-[1fr_1px_1fr] gap-10 md:gap-16 mt-8">
          {/* Left column — headline */}
          <div
            className={`transition-all duration-1200 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">
              Built in silence.
              <br />
              <span className="text-accent-jesko">Aiming for impact.</span>
            </h2>

            <p className="mt-8 font-seriff text-[19px] italic text-white/60 max-w-md">
              {"\u201C"}Because what stayed constant through all of it was the
              feeling that music could say things words never fully can.
              {"\u201D"}
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block" />

          {/* Right column — body copy */}
          <div
            className={`transition-all duration-1200 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)]`}
          >
            <div className="space-y-5 text-white/70 font-body font-light leading-relaxed text-[15px] md:text-base">
              <p
                className={`transition-all duration-1200 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                {
                  "I\u0027m Justin Jesko \u2014 a DJ and producer from Hungary, building a sound rooted in energy, emotion, and momentum. I\u0027ve been making music since 2017, but the path here was anything but linear. Before fully stepping into music, I spent years building businesses, learning through failed ideas, near wins, pressure, and persistence."
                }
              </p>
              <p
                className={`transition-all duration-1200 delay-450 ease-[cubic-bezier(0.16,1,0.3,1)] ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                {
                  "That chapter shaped me. It taught me discipline, patience, and how to keep moving when things don\u0027t work the first time. Now I\u0027m bringing that same mentality into music \u2014 not to chase noise, but to build something real. No shortcuts. Because what stayed constant through all of it was the feeling that music could say things words never fully can \u2014 create memories, carry emotion, and bring people into the same moment in completely different ways. Something people can feel, remember, and return to."
                }
              </p>
              <p
                className={`transition-all duration-1200 delay-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                {
                  "2026 is the foundation year. The focus is simple: finish the music, sharpen the craft, and create a world people can connect with before asking them to believe in the name. This project is being built to last \u2014 step by step, with intention, with obsession, and with the belief that the right sound can say what words never could."
                }
              </p>
            </div>

            <p
              className={`mt-10 font-seriff font-medium italic text-accent-jesko text-2xl tracking-wide transition-all duration-1200 delay-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              This is only the beginning.
            </p>
          </div>
        </div>
      </div>
      {/* Bottom accent line */}
      {/* <div
        className={`h-px bg-linear-to-r from-transparent via-accent-jesko/40 to-transparent transition-all duration-1500 delay-700 ${
          vis ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        }`}
      /> */}
    </section>
  );
}
