"use client";
import useScrollReveal from "@/lib/useScrollReveal";
import useParallaxBackground from "@/lib/useParallaxBackground_old";
import SectionLabel from "./SectionLabel";

const EVENTS = [
  {
    date: "2026",
    items: [
      {
        month: "JUN",
        title: "First Official Release",
        type: "milestone",
        description: "Debut single dropping across all platforms.",
      },
      {
        month: "JUL",
        title: "EP Release — Chapter One",
        type: "milestone",
        description: "A body of work that sets the sonic direction.",
      },
      {
        month: "AUG",
        title: "Local Club Debut",
        type: "event",
        location: "Budapest, Hungary",
        description: "First live DJ set in front of a crowd.",
      },
      {
        month: "OCT",
        title: "Remix Competition Entry",
        type: "milestone",
        description: "Putting the sound in front of a wider audience.",
      },
      {
        month: "DEC",
        title: "End-of-Year Mix",
        type: "milestone",
        description: "A mix capturing the best of 2026.",
      },
    ],
  },
  {
    date: "2027 & BEYOND",
    items: [
      {
        month: "Q1",
        title: "Festival Demo Submissions",
        type: "goal",
        description: "Sziget, Balaton Sound, DGTL — aiming big.",
      },
      {
        month: "Q2",
        title: "International Gig",
        type: "goal",
        description: "First performance outside Hungary.",
      },
      {
        month: "—",
        title: "Tomorrowland",
        type: "dream",
        description: "The ultimate stage. Building toward it.",
      },
      {
        month: "—",
        title: "Ultra Music Festival",
        type: "dream",
        description: "Miami mainstage. One day.",
      },
    ],
  },
];

const TYPE_STYLES = {
  milestone: "bg-accent-jesko/20 text-accent-jesko",
  event: "bg-white/10 text-white",
  goal: "bg-accent-jesko/10 text-accent-jesko/80",
  dream: "bg-white/5 text-white/50",
};

const TYPE_LABELS = {
  milestone: "MILESTONE",
  event: "EVENT",
  goal: "GOAL",
  dream: "DREAM",
};

export default function Events() {
  const [revealRef, vis] = useScrollReveal(0.4);
  const [sectionRef, bgTextRef] = useParallaxBackground(0.5, 1.0);

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative bg-black text-white overflow-hidden -scroll-mt-36"
    >
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[clamp(5rem,50vw,10rem)] min-[512px]:text-[clamp(6rem,18vw,16rem)] -rotate-90 min-[512px]:rotate-0 font-display font-bold uppercase text-white/20 whitespace-nowrap tracking-tight">
          ROADMAP
        </span>
      </div>

      <div
        ref={revealRef}
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-36"
      >
        <div
          className={`transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <SectionLabel text="EVENTS & GOALS" dark />
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight tracking-tight mt-2">
            The Roadmap
          </h2>
          <p className="text-white/50 mt-3 max-w-lg font-seriff font-medium">
            Where I&apos;m heading. Milestones to hit, stages to play, and
            dreams to make true.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {EVENTS.map((group, gi) => (
            <div key={group.date}>
              <div
                className={`flex items-center gap-4 mb-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  vis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                }`}
                style={{ transitionDelay: vis ? `${300 + gi * 200}ms` : "0ms" }}
              >
                <span className="font-display font-bold text-2xl md:text-3xl text-accent-jesko">
                  {group.date}
                </span>
                {/* <div className="flex-1 h-0.5 bg-white/20" /> */}

                <div
                  className={`flex-1 h-0.5 bg-linear-to-r from-transparent via-accent-jesko/40 to-transparent transition-all duration-1500 delay-700 ${
                    vis ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                  }`}
                />
              </div>

              <div className="relative ml-4 md:ml-8">
                {/* Vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-t from-accent-jesko/5 via-white/40 to-accent-jesko/10" />

                <div className="space-y-1">
                  {group.items.map((item, i) => (
                    <div
                      key={i}
                      className={`relative pl-8 py-4 group transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        vis
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      style={{
                        transitionDelay: vis
                          ? `${500 + gi * 200 + i * 80}ms`
                          : "0ms",
                      }}
                    >
                      {/* Dot */}
                      <div
                        className={`absolute left-0 top-6 w-2 h-2 rounded-full drop-shadow-lg drop-shadow-black/50 -translate-x-[3.5px] transition-colors ${
                          item.type === "dream"
                            ? "bg-neutral-400"
                            : item.type === "event"
                              ? "bg-white"
                              : "bg-accent-jesko"
                        }`}
                      />

                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="font-mono text-xs text-white/30 w-8 shrink-0">
                          {item.month}
                        </span>
                        <h3 className="font-display font-bold text-base md:text-lg group-hover:text-accent-jesko transition-colors duration-200">
                          {item.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${TYPE_STYLES[item.type]}`}
                        >
                          {TYPE_LABELS[item.type]}
                        </span>
                      </div>

                      {item.location && (
                        <p className="ml-11 text-xs text-white/40 mt-0.5 font-body flex items-center gap-1">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {item.location}
                        </p>
                      )}

                      <p className="ml-11 text-sm text-white/40 mt-1 font-body leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
