"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useAudioPlayer } from "./AudioPlayerContext";

const ACCENT = "#C3FF00";

// Bespoke, large-format player for the /shared/<ref> landing hero. Shares the
// global audio context (and the bottom MiniPlayer) with the rest of the site,
// so a track started here keeps playing as the visitor browses on.
export default function SharedPlayer({ item }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const {
    currentTrack,
    playing: ctxPlaying,
    progress: ctxProgress,
    currentTime: ctxCurrent,
    duration: ctxDuration,
    play,
    toggle,
    seek,
  } = useAudioPlayer();

  const track = useMemo(
    () => ({
      slug: item.slug,
      title: item.title,
      artist: item.artist,
      cover: item.cover,
    }),
    [item.slug, item.title, item.artist, item.cover],
  );

  const isActive = currentTrack?.slug === item.slug;
  const playing = isActive && ctxPlaying;
  const progress = isActive ? ctxProgress : 0;
  const currentTime = isActive ? ctxCurrent : 0;
  const duration = isActive ? ctxDuration : 0;

  // Attempt to auto-start the shared track on load. Browsers block autoplay
  // with sound without a user gesture — the promise rejection is swallowed by
  // the context, and the big Play button remains for a one-tap start.
  useEffect(() => {
    play(track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const BAR_COUNT = 120;
  const BAR_GAP = 2;

  const bars = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < item.title.length; i++) {
      hash = ((hash << 5) - hash + item.title.charCodeAt(i)) | 0;
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
  }, [item.title]);

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
      const maxH = rect.height * 0.95;
      const playedIdx = Math.floor(progress * bars.length);
      for (let i = 0; i < bars.length; i++) {
        const h = bars[i] * maxH;
        const x = i * (barW + BAR_GAP);
        const y = (rect.height - h) / 2;
        ctx.fillStyle = i <= playedIdx ? ACCENT : "rgba(255,255,255,0.16)";
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, 1);
        ctx.fill();
      }
      frameId = requestAnimationFrame(draw);
    };
    draw();
    return () => frameId && cancelAnimationFrame(frameId);
  }, [bars, progress]);

  const onSeek = (e) => {
    if (!isActive) {
      toggle(track);
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
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${sec
        .toString()
        .padStart(2, "0")}`;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
      {/* Blurred cover ambiance behind the card */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <Image
          src={item.cover}
          alt=""
          fill
          sizes="100vw"
          aria-hidden
          className="scale-125 object-cover blur-3xl"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="flex flex-col gap-8 p-6 sm:p-10 md:flex-row md:items-center">
        {/* Cover */}
        <div className="relative mx-auto aspect-square w-56 shrink-0 overflow-hidden rounded-2xl bg-white/5 shadow-2xl sm:w-64 md:mx-0">
          <Image
            src={item.cover}
            alt={item.title}
            fill
            sizes="256px"
            priority
            className="object-cover"
          />
        </div>

        {/* Meta + controls */}
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full border border-accent-jesko/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-jesko">
            {item.kind === "set" ? "DJ Set" : "Preview"}
          </span>

          <h1 className="mt-4 truncate font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {item.title}
          </h1>
          <p className="mt-2 font-seriff text-lg font-medium text-white/50">
            {item.artist}
            {item.date ? ` · ${item.date}` : ""}
          </p>

          {/* Waveform */}
          <div
            className="relative mt-8 cursor-pointer"
            onClick={onSeek}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <canvas ref={canvasRef} className="h-16 w-full sm:h-20" />
          </div>
          <div className="mt-1 flex justify-between font-mono text-xs text-white/40">
            <span>{fmt(currentTime)}</span>
            <span>{duration < 1 ? fmt(item.lngth) : fmt(duration)}</span>
          </div>

          {/* Buttons */}
          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={() => toggle(track)}
              className="flex h-14 items-center gap-3 rounded-full bg-accent-jesko px-7 font-display font-bold text-black transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="3" y="2" width="4" height="12" rx="1" />
                  <rect x="9" y="2" width="4" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 2.5v11l9-5.5z" />
                </svg>
              )}
              {playing ? "Pause" : "Play"}
            </button>

            <button
              onClick={copyLink}
              className="flex h-14 items-center gap-2 rounded-full border border-white/20 px-6 font-body text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5 cursor-pointer"
              aria-label="Copy share link"
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Copy link
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
