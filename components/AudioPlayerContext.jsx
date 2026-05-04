"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume before any src is loaded so the first play
    // doesn't briefly start at 100% before the sync effect runs.
    audio.volume = 0.5;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoad = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolume = () => setVolumeState(audio.volume);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoad);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("volumechange", onVolume);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoad);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("volumechange", onVolume);
    };
  }, []);

  const play = async (track) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Same track already loaded — just resume
    if (currentTrack?.slug === track.slug && audio.src) {
      audio.play().catch(() => {});
      return;
    }

    setCurrentTrack(track);

    try {
      const res = await fetch(
        `/api/jsk/token?slug=${encodeURIComponent(track.slug)}`,
      );
      if (!res.ok) throw new Error("Token request failed");
      const { url } = await res.json();

      audio.src = url;
      await audio.play().catch(() => {});
    } catch (err) {
      console.error("Failed to load audio:", err);
      setCurrentTrack(null);
    }
  };

  const pause = () => audioRef.current?.pause();

  const toggle = (track) => {
    if (currentTrack?.slug === track.slug && playing) pause();
    else play(track);
  };

  const seek = (pct) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = Math.max(0, Math.min(1, pct)) * audio.duration;
  };

  const setVolume = (v) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(1, v));
    if (audio) audio.volume = clamped;
    // The `volumechange` listener will update state, but set it here too
    // so UI responds instantly even if the audio element isn't ready yet.
    setVolumeState(clamped);
  };

  const close = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setCurrentTrack(null);
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        playing,
        currentTime,
        duration,
        progress,
        volume,
        play,
        pause,
        toggle,
        seek,
        setVolume,
        close,
      }}
    >
      {children}
      {/* Single audio element for the whole app. 
          controlsList + onContextMenu discourage saving. */}
      <audio
        ref={audioRef}
        preload="metadata"
        controlsList="nodownload noplaybackrate"
        onContextMenu={(e) => e.preventDefault()}
      />
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx)
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
};
