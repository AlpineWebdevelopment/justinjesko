"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAudioPlayer } from "./AudioPlayerContext";
import { getBySlug } from "@/lib/tracks";

export default function MiniPlayer() {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const {
    currentTrack,
    playing,
    currentTime,
    duration,
    progress,
    volume,
    setVolume,
    toggle,
    seek,
    close,
  } = useAudioPlayer();

  // Close the mobile options popover when tapping/clicking outside it.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menuOpen]);

  if (!currentTrack) return null;

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    seek((clientX - rect.left) / rect.width);
  };

  const handleVolume = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setVolume((clientX - rect.left) / rect.width);
  };

  const toggleMute = () => setVolume(volume > 0 ? 0 : 0.5);

  const shareTrack = async () => {
    const item = getBySlug(currentTrack.slug);
    if (!item) return;
    const url = `${window.location.origin}/shared/${item.ref}`;
    // Mobile: native share sheet (WhatsApp, Instagram, Messages...).
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentTrack.title,
          text: `${currentTrack.title} — ${currentTrack.artist}`,
          url,
        });
      } catch {
        /* user dismissed the share sheet — nothing to do */
      }
      return;
    }
    // Desktop fallback: copy the link.
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const shareable = !!getBySlug(currentTrack.slug);

  const volumeIcon =
    volume === 0 ? (
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
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    ) : volume < 0.5 ? (
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
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ) : (
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
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );

  const shareIcon = copied ? (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50
                 bg-black/90 backdrop-blur-md border-t border-white/10
                 text-white pb-[env(safe-area-inset-bottom)]"
      role="region"
      aria-label="Audio player"
    >
      <div
        className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5 sm:py-3
                      flex items-center gap-3 sm:gap-4"
      >
        {/* Cover */}
        {currentTrack.cover && (
          <div className="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-white/5">
            <Image
              src={currentTrack.cover}
              alt={currentTrack.title}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        )}

        {/* Play / pause */}
        <button
          onClick={() => toggle(currentTrack)}
          className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center
                     rounded-full bg-white text-black
                     hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
          )}
        </button>

        {/* Title + timeline */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-medium truncate">
              {currentTrack.title}
            </span>
            <span className="hidden sm:inline text-xs text-white/50 shrink-0 truncate">
              {currentTrack.artist}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-mono text-white/50 tabular-nums shrink-0">
              {fmt(currentTime)}
            </span>
            <div
              onClick={handleSeek}
              className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden cursor-pointer group"
            >
              <div
                className="h-full bg-accent-jesko rounded-full transition-[width] duration-75"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-white/50 tabular-nums shrink-0">
              {fmt(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={volume === 0 ? "Unmute" : "Mute"}
          >
            {volumeIcon}
          </button>
          <div
            onClick={handleVolume}
            className="w-20 h-1 bg-white/15 rounded-full overflow-hidden cursor-pointer"
            role="slider"
            aria-label="Volume"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(volume * 100)}
          >
            <div
              className="h-full bg-white/70 rounded-full"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>

        {/* Share — desktop inline */}
        {shareable && (
          <button
            onClick={shareTrack}
            className="hidden sm:flex shrink-0 w-8 h-8 items-center justify-center rounded-full
                       text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={copied ? "Link copied" : "Share this track"}
            title={copied ? "Link copied" : "Share"}
          >
            {shareIcon}
          </button>
        )}

        {/* More — mobile: share + volume tucked into an upward popover */}
        <div ref={menuRef} className="relative shrink-0 sm:hidden">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="More options"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="12" cy="19" r="1.7" />
            </svg>
          </button>

          {menuOpen && (
            <div
              className="absolute bottom-full right-0 mb-3 w-56 origin-bottom-right
                         rounded-xl border border-white/10 bg-black/95 backdrop-blur-md
                         p-3 shadow-2xl"
              role="menu"
            >
              {/* Volume */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full
                             text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label={volume === 0 ? "Unmute" : "Mute"}
                >
                  {volumeIcon}
                </button>
                <div
                  onClick={handleVolume}
                  className="flex-1 h-2 bg-white/15 rounded-full overflow-hidden cursor-pointer"
                  role="slider"
                  aria-label="Volume"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(volume * 100)}
                >
                  <div
                    className="h-full bg-white/70 rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>

              {/* Share */}
              {shareable && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    shareTrack();
                  }}
                  className="mt-2 w-full flex items-center gap-3 rounded-lg px-2 py-2
                             text-left text-sm text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
                  role="menuitem"
                >
                  <span className="shrink-0 w-6 flex justify-center">
                    {shareIcon}
                  </span>
                  {copied ? "Copied" : "Share"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Close */}
        <button
          onClick={close}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full
                     text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close player"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
