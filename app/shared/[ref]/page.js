import Link from "next/link";
import { notFound } from "next/navigation";
import { getByRef, getSuggestions, ITEMS } from "@/lib/tracks";
import JesyNav from "@/components/JesyNav";
import SharedPlayer from "@/components/SharedPlayer";
import Suggestions from "@/components/Suggestions";
import hero from "@/components/Hero.module.css";

// Signature entrance easing used across the landing page (Hero, sections).
const EASE = "cubic-bezier(0.16,1,0.3,1)";

// Pre-render every share page at build time.
export function generateStaticParams() {
  return ITEMS.map((i) => ({ ref: i.ref }));
}

export async function generateMetadata({ params }) {
  const { ref } = await params;
  const item = getByRef(ref);
  if (!item) return { title: "Not found · Justin JesKØ" };

  const host = process.env.NEXT_PUBLIC_SITE_HOST || "";
  const cover = host ? `${host}${item.cover}` : item.cover;
  const label = item.kind === "set" ? "DJ Set" : "Preview";
  const title = `${item.title} — ${item.artist}`;
  const description = `Listen to ${item.title} by ${item.artist} · ${label} on Justin JesKØ.`;

  return {
    title: `${title} · Justin JesKØ`,
    description,
    openGraph: {
      title,
      description,
      type: "music.song",
      images: [{ url: cover, width: 1200, height: 1200, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cover],
    },
  };
}

export default async function SharedPage({ params }) {
  const { ref } = await params;
  const item = getByRef(ref);
  if (!item) notFound();

  // 4 items: fills exactly one row at the 4-col (lg) and 2-col (mobile, → 2
  // rows) breakpoints; the 4th is hidden by CSS at the 3-col (sm) breakpoint.
  const suggestions = getSuggestions(ref, 4);
  const watermark = item.kind === "set" ? "DJ SET" : "PREVIEW";

  return (
    <>
      <JesyNav />

      <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
        {/* ─── Ambient backdrop, echoing the Hero ─── */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-screen overflow-hidden">
          {/* accent wash from the top */}
          <div className="absolute inset-x-0 top-0 h-[55vh] bg-linear-to-b from-accent-jesko/10 via-accent-jesko/3 to-transparent" />
          {/* breathing glow orbs (shared with the Hero) */}
          <div className={`${hero.glow} ${hero.glow1}`} aria-hidden="true" />
          <div className={`${hero.glow} ${hero.glow2}`} aria-hidden="true" />
          {/* film grain */}
          <div className={hero.grain} aria-hidden="true" />
        </div>

        {/* Oversized section watermark, as on the landing sections */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-24 -z-10 flex select-none justify-center overflow-hidden"
        >
          <span className="font-display text-[clamp(5rem,22vw,20rem)] font-bold uppercase leading-none tracking-tighter text-white/[0.035] whitespace-nowrap">
            {watermark}
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-5 pb-40 pt-28 sm:px-8 sm:pt-32">
          {/* Back home */}
          <Link
            href="/#hero"
            className="group inline-flex items-center gap-2 font-body text-sm text-white/45 transition-colors hover:text-white"
            style={{ animation: `fadeInUp 0.9s 0.05s both ${EASE}` }}
          >
            ← Back to Justin JesKØ
          </Link>

          <div
            className="mt-8"
            style={{ animation: `fadeInUp 1s 0.15s both ${EASE}` }}
          >
            <SharedPlayer item={item} />
          </div>

          {/* You might also like */}
          <section
            className="mt-20 sm:mt-24"
            style={{ animation: `fadeInUp 1s 0.35s both ${EASE}` }}
          >
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-8 bg-accent-jesko/50" />
              <span className="font-body text-xs font-[450] uppercase tracking-[0.3em] text-accent-jesko">
                More to hear
              </span>
            </div>
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-display text-[clamp(1.6rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
                More by Justin JesKØ
              </h2>
              <Link
                href="/#previews"
                className="shrink-0 font-body text-sm text-white/40 transition-colors hover:text-accent-jesko"
              >
                View all →
              </Link>
            </div>
            <Suggestions items={suggestions} />
          </section>
        </div>
      </main>
    </>
  );
}
