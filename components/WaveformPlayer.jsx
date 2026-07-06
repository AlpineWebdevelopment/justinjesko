"use client";
import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useAudioPlayer } from "./AudioPlayerContext";

export default function WaveformPlayer({
  slug,
  title = "Untitled",
  artist = "Artist",
  cover = null,
  accent = "#C3FF00",
  dark = false,
  compact = false,
  lngth,
}) {
  const canvasRef = useRef(null);
  const {
    currentTrack,
    playing: ctxPlaying,
    progress: ctxProgress,
    currentTime: ctxCurrent,
    duration: ctxDuration,
    toggle,
    seek,
  } = useAudioPlayer();

  const isActive = currentTrack?.slug === slug;
  const playing = isActive && ctxPlaying;
  const progress = isActive ? ctxProgress : 0;
  const currentTime = isActive ? ctxCurrent : 0;
  const duration = isActive ? ctxDuration : 0;

  // A large fixed pool of bar heights. How many we actually draw is derived
  // from the canvas width at paint time (see draw()), so bars keep a constant
  // ~3px thickness — the dense, spiky look — on both phone and desktop widths.
  const BAR_POOL = 200;
  const BAR_GAP = 2;
  const BAR_PITCH = 5; // target px per bar (≈3px bar + 2px gap)

  const bars = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = ((hash << 5) - hash + title.charCodeAt(i)) | 0;
    }
    const seededRandom = (index) => {
      const x = Math.sin(hash + index * 9301 + 49297) * 10000;
      return x - Math.floor(x);
    };
    const raw = Array.from(
      { length: BAR_POOL },
      (_, i) => 0.15 + seededRandom(i) * 0.85,
    );
    return raw.map((v, i) => {
      const prev = raw[i - 1] ?? v;
      const next = raw[i + 1] ?? v;
      return prev * 0.2 + v * 0.6 + next * 0.2;
    });
  }, [title]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let frameId;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Derive bar count from width so thickness stays consistent everywhere.
      const count = Math.max(
        16,
        Math.min(bars.length, Math.floor(rect.width / BAR_PITCH)),
      );
      const barW = Math.max(1, (rect.width - (count - 1) * BAR_GAP) / count);
      const maxH = rect.height * 0.95;
      const playedIdx = Math.floor(progress * count);

      for (let i = 0; i < count; i++) {
        const h = bars[i] * maxH;
        const x = i * (barW + BAR_GAP);
        const y = (rect.height - h) / 2;
        ctx.fillStyle =
          i <= playedIdx
            ? accent
            : dark
              ? "rgba(255,255,255,0.16)"
              : "rgba(0,0,0,0.22)";
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, 1);
        ctx.fill();
      }
      frameId = requestAnimationFrame(draw);
    };
    draw();
    return () => frameId && cancelAnimationFrame(frameId);
  }, [bars, progress, accent, dark]);

  const togglePlay = () => {
    toggle({ slug, title, artist, cover });
  };

  const onSeek = (e) => {
    if (!isActive) {
      toggle({ slug, title, artist, cover });
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    seek((e.clientX - rect.left) / rect.width);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    }
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const playIcon = (
    <svg
      width={compact ? 16 : 18}
      height={compact ? 16 : 18}
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M4 2.5v11l9-5.5z" />
    </svg>
  );
  const pauseIcon = (
    <svg
      width={compact ? 16 : 18}
      height={compact ? 16 : 18}
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <rect x="3" y="2" width="4" height="12" rx="1" />
      <rect x="9" y="2" width="4" height="12" rx="1" />
    </svg>
  );

  return (
    <div className={`group ${compact ? "py-3 sm:py-4" : "py-4 sm:py-5"}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Cover art doubles as the play / pause control (SoundCloud/Spotify
            style) — frees the whole play-button column on narrow screens. */}
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className={`relative shrink-0 overflow-hidden rounded-lg bg-faint transition-transform duration-200 active:scale-95 cursor-pointer ${
            compact ? "w-12 h-12" : "w-14 h-14 sm:w-16 sm:h-16"
          }`}
        >
          {cover ? (
            <Image
              src={cover}
              alt={title}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <span
              className={`absolute inset-0 ${dark ? "bg-white/5" : "bg-black/5"}`}
            />
          )}
          {/* Overlay: always visible on touch + while playing; on hover for
              pointer devices. Accent tint while this track is playing. */}
          <span
            aria-hidden
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
              playing
                ? "opacity-100 text-accent-jesko"
                : "opacity-100 text-white sm:opacity-0 sm:group-hover:opacity-100"
            }`}
          >
            {playing ? pauseIcon : playIcon}
          </span>
        </button>

        <div className="flex-1 min-w-0">
          {/* Title + artist stacked */}
          <div className={`${!compact && "flex gap-2 align-center"}`}>
            <div
              className={`font-display font-bold truncate ${compact ? "text-sm" : "text-[15px] sm:text-base"} ${dark ? "text-white" : "text-black"}`}
            >
              {title}
            </div>
            <div
              className={`font-seriff font-semibold truncate text-xs sm:text-sm ${!compact && "pt-1"} ${dark ? "text-white/40" : "text-black/45"}`}
            >
              {artist}
            </div>
          </div>

          <div className="relative cursor-pointer mt-2" onClick={onSeek}>
            <canvas
              ref={canvasRef}
              className={`w-full ${compact ? "h-10" : "h-12"}`}
            />
          </div>

          <div
            className={`flex justify-between mt-1 text-[11px] sm:text-xs font-mono tabular-nums ${dark ? "text-white/30" : "text-black/30"}`}
          >
            <span>{fmt(currentTime)}</span>
            <span>{duration < 1 ? fmt(lngth) : fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
