"use client";

import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react";
import type { Track, PlayerState } from "@/types";

interface PlayerContextType extends PlayerState {
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (v: number) => void;
  seekTo: (progress: number) => void;
  addToQueue: (track: Track) => void;
  playNext: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [queue, setQueue] = useState<Track[]>([]);

  const play = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.src = track.audio_url;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    }
  }, [volume]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    setIsPlaying(true);
    audioRef.current?.play().catch(() => {});
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const seekTo = useCallback((p: number) => {
    setProgress(p);
    if (audioRef.current && currentTrack) {
      audioRef.current.currentTime = p * currentTrack.duration;
    }
  }, [currentTrack]);

  const addToQueue = useCallback((track: Track) => {
    setQueue((q) => [...q, track]);
  }, []);

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      play(next);
    } else {
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  }, [queue, play]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        volume,
        queue,
        play,
        pause,
        resume,
        setVolume,
        seekTo,
        addToQueue,
        playNext,
        audioRef,
      }}
    >
      {children}
      {/* Global audio element — never unmounts */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current && currentTrack) {
            setProgress(audioRef.current.currentTime / currentTrack.duration);
          }
        }}
        onEnded={playNext}
        preload="auto"
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
}
