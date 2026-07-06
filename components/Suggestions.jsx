"use client";
import Image from "next/image";
import Link from "next/link";
import { useAudioPlayer } from "./AudioPlayerContext";

// "You might also like" grid shown beneath the shared player. Each card links
// to that item's own /shared/<ref> page; the play button starts it inline
// (via the shared audio context) without leaving the current page.
export default function Suggestions({ items }) {
  const { currentTrack, playing, toggle } = useAudioPlayer();

  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item, i) => {
        const isActive = currentTrack?.slug === item.slug;
        const isPlaying = isActive && playing;
        // The 4th card completes a row at 2 cols (mobile) and 4 cols (lg), but
        // would spill onto a 2nd row at 3 cols (sm) — hide it only there.
        const hideAtSm = i === 3 ? "sm:hidden lg:flex" : "";
        return (
          <Link
            key={item.ref}
            href={`/shared/${item.ref}`}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/25 hover:bg-white/[0.06] ${hideAtSm}`}
          >
            <div className="relative aspect-square w-full overflow-hidden bg-white/5">
              <Image
                src={item.cover}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Inline play — does not trigger navigation */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggle({
                    slug: item.slug,
                    title: item.title,
                    artist: item.artist,
                    cover: item.cover,
                  });
                }}
                aria-label={isPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
                className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent-jesko text-black shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                  isPlaying
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="3" y="2" width="4" height="12" rx="1" />
                    <rect x="9" y="2" width="4" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2.5v11l9-5.5z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-0.5 p-3">
              <span className="truncate font-display text-sm font-bold text-white">
                {item.title}
              </span>
              <span className="truncate font-seriff text-xs font-medium text-white/45">
                {item.artist}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
