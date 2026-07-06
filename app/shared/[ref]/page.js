import Link from "next/link";
import { notFound } from "next/navigation";
import { getByRef, getSuggestions, ITEMS } from "@/lib/tracks";
import SharedPlayer from "@/components/SharedPlayer";
import Suggestions from "@/components/Suggestions";

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

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* subtle top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[40vh] bg-linear-to-b from-accent-jesko/10 to-transparent" />

      <div className="mx-auto max-w-5xl px-5 pb-32 pt-8 sm:px-8 sm:pt-12">
        {/* Back home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body text-sm text-white/50 transition-colors hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Justin JesKØ
        </Link>

        <div className="mt-8">
          <SharedPlayer item={item} />
        </div>

        {/* You might also like */}
        <section className="mt-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
              More by Justin JesKØ
            </h2>
            <Link
              href="/"
              className="font-body text-sm text-white/40 transition-colors hover:text-accent-jesko"
            >
              View all →
            </Link>
          </div>
          <Suggestions items={suggestions} />
        </section>
      </div>
    </main>
  );
}
