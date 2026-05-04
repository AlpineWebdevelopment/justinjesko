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

  const BAR_COUNT = compact ? 60 : 100;
  const BAR_GAP = 2;

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
      { length: BAR_COUNT },
      (_, i) => 0.15 + seededRandom(i) * 0.85,
    );
    return raw.map((v, i) => {
      const prev = raw[i - 1] ?? v;
      const next = raw[i + 1] ?? v;
      return prev * 0.2 + v * 0.6 + next * 0.2;
    });
  }, [title, BAR_COUNT]);

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

      const barW = Math.max(
        1,
        (rect.width - (bars.length - 1) * BAR_GAP) / bars.length,
      );
      const maxH = rect.height * 0.9;
      const playedIdx = Math.floor(progress * bars.length);

      for (let i = 0; i < bars.length; i++) {
        const h = bars[i] * maxH;
        const x = i * (barW + BAR_GAP);
        const y = (rect.height - h) / 2;
        ctx.fillStyle =
          i <= playedIdx
            ? accent
            : dark
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.12)";
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

  return (
    <div className={`group ${compact ? "py-4" : "py-5"}`}>
      <div className="flex items-center gap-4">
        {cover && (
          <div
            className={`relative shrink-0 rounded-lg overflow-hidden ${compact ? "w-12 h-12" : "w-16 h-16"} bg-faint`}
          >
            <Image
              src={cover}
              alt={title}
              fill
              sizes={compact ? "48px" : "64px"}
              className="object-cover"
            />
          </div>
        )}

        <button
          onClick={togglePlay}
          className={`shrink-0 flex items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            compact ? "w-10 h-10" : "w-12 h-12"
          } ${
            dark
              ? "border-white/30 text-white hover:border-accent-jesko hover:text-accent-jesko"
              : "border-black/20 text-black hover:border-accent-jesko hover:text-accent-jesko"
          }`}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg
              width={compact ? 14 : 16}
              height={compact ? 14 : 16}
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg
              width={compact ? 14 : 16}
              height={compact ? 14 : 16}
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className={`font-display font-bold truncate ${compact ? "text-sm" : "text-base"} ${dark ? "text-white" : "text-black"}`}
            >
              {title}
            </span>
            <span
              className={`text-sm shrink-0 ${dark ? "text-white/40" : "text-black/40"} font-seriff font-semibold`}
            >
              {artist}
            </span>
          </div>

          <div className="relative cursor-pointer" onClick={onSeek}>
            <canvas
              ref={canvasRef}
              className={`w-full ${compact ? "h-8" : "h-10"}`}
            />
          </div>

          <div
            className={`flex justify-between mt-1 text-xs font-mono ${dark ? "text-white/30" : "text-black/30"}`}
          >
            <span>{fmt(currentTime)}</span>
            <span>{duration < 1 ? fmt(lngth) : fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
