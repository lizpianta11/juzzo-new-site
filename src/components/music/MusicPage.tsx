"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import MusicWorld from "./MusicWorld";
import DiscoverySections from "./DiscoverySections";
import type { Track } from "@/types";

interface MusicPageProps {
  tracks: Track[];
}

function trackRankSeed(track: Track): number {
  return `${track.id}-${track.title}-${track.artist_name}`.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export default function MusicPage({ tracks }: MusicPageProps) {
  const trending = useMemo(
    () => [...tracks].sort((a, b) => b.play_count - a.play_count).slice(0, 8),
    [tracks]
  );

  const recommended = useMemo(
    () => [...tracks].sort((a, b) => trackRankSeed(a) - trackRankSeed(b)).slice(0, 10),
    [tracks]
  );

  const popular = useMemo(
    () => [...tracks].sort((a, b) => b.play_count - a.play_count).slice(0, 15),
    [tracks]
  );

  const genres = useMemo(() => {
    const unique = new Set(tracks.map((t) => t.genre));
    return Array.from(unique);
  }, [tracks]);

  return (
    <div className="min-h-screen bg-[#050510]">
      {/* Header */}
      <header className="relative px-5 md:px-8 pt-12 md:pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            >
              Music
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/40 text-sm mt-1"
            >
              Discover the world
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2.5"
          >
            <button className="w-10 h-10 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-colors">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-colors relative">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full" />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Music World Globe */}
      <section className="relative h-[60vh] md:h-[65vh] min-h-[400px] max-h-[700px]">
        <MusicWorld tracks={tracks} />
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#050510] to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050510] to-transparent pointer-events-none z-20" />
      </section>

      {/* Discovery Sections */}
      <DiscoverySections
        trending={trending}
        genres={genres}
        recommended={recommended}
        popular={popular}
      />
    </div>
  );
}
