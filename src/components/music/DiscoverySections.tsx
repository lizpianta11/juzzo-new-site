"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { usePlayer } from "@/providers/PlayerProvider";
import type { Track } from "@/types";

interface DiscoverySectionsProps {
  trending: Track[];
  genres: string[];
  recommended: Track[];
  popular: Track[];
}

function getCoverUrl(track: Track): string {
  if (track.cover_url) return track.cover_url;
  const seed = parseInt(track.id, 10) || track.title.charCodeAt(0);
  return `https://picsum.photos/seed/${seed + 100}/200/200`;
}

const GENRE_COLORS: Record<string, string> = {
  "Hip Hop": "from-orange-500/30 to-red-500/30",
  Pop: "from-pink-500/30 to-rose-500/30",
  "R&B": "from-purple-500/30 to-violet-500/30",
  Electronic: "from-cyan-500/30 to-blue-500/30",
  Jazz: "from-amber-500/30 to-yellow-500/30",
  Rock: "from-red-500/30 to-orange-500/30",
  Classical: "from-indigo-500/30 to-purple-500/30",
  Latin: "from-yellow-500/30 to-green-500/30",
  Country: "from-amber-600/30 to-orange-500/30",
  Reggae: "from-green-500/30 to-emerald-500/30",
  Metal: "from-gray-500/30 to-zinc-500/30",
  Folk: "from-lime-500/30 to-green-500/30",
  Blues: "from-blue-500/30 to-indigo-500/30",
  Indie: "from-teal-500/30 to-cyan-500/30",
  Afrobeats: "from-orange-500/30 to-yellow-500/30",
};

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center justify-between px-5 mb-3">
      <h3 className="text-white font-bold text-lg">{title}</h3>
      {count !== undefined && (
        <button className="text-white/40 text-sm hover:text-white/60 transition-colors">
          See all
        </button>
      )}
    </div>
  );
}

function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {children}
    </div>
  );
}

function TrackCard({ track }: { track: Track }) {
  const { play, currentTrack, isPlaying, pause, resume } = usePlayer();
  const isActive = currentTrack?.id === track.id;
  const coverUrl = getCoverUrl(track);

  const handleClick = () => {
    if (isActive) {
      isPlaying ? pause() : resume();
    } else {
      play(track);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="flex-shrink-0 w-[140px] group text-left"
    >
      <div className="relative w-[140px] h-[140px] rounded-2xl overflow-hidden mb-2 shadow-lg shadow-black/30">
        <img
          src={coverUrl}
          alt={track.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            {isActive && isPlaying ? (
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </div>
        </div>
        {/* Active indicator */}
        {isActive && (
          <div className="absolute bottom-2 left-2 flex items-end gap-[2px]">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-[3px] bg-white rounded-full"
                animate={isPlaying ? { height: [4, 14, 4] } : { height: 4 }}
                transition={isPlaying ? { duration: 0.5, repeat: Infinity, delay: i * 0.12 } : {}}
              />
            ))}
          </div>
        )}
      </div>
      <p className={`text-[13px] font-semibold truncate ${isActive ? "text-purple-400" : "text-white"}`}>
        {track.title}
      </p>
      <p className="text-white/40 text-[11px] truncate">{track.artist_name}</p>
    </motion.button>
  );
}

function GenreChip({ genre }: { genre: string }) {
  const gradient = GENRE_COLORS[genre] || "from-white/10 to-white/5";
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`flex-shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-br ${gradient} border border-white/[0.06] backdrop-blur-sm hover:border-white/[0.12] transition-colors`}
    >
      <span className="text-white/80 text-sm font-medium whitespace-nowrap">{genre}</span>
    </motion.button>
  );
}

function PopularTrackRow({ track, rank }: { track: Track; rank: number }) {
  const { play, currentTrack, isPlaying, pause, resume } = usePlayer();
  const isActive = currentTrack?.id === track.id;
  const coverUrl = getCoverUrl(track);

  const handleClick = () => {
    if (isActive) {
      isPlaying ? pause() : resume();
    } else {
      play(track);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.03] transition-colors w-full text-left"
    >
      <span className="text-white/20 text-sm font-mono w-5 text-right">{rank}</span>
      <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-md shadow-black/30">
        <img
          src={coverUrl}
          alt={track.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-semibold truncate ${isActive ? "text-purple-400" : "text-white"}`}>
          {track.title}
        </p>
        <p className="text-white/40 text-[11px] truncate">{track.artist_name}</p>
      </div>
      <div className="text-white/20 text-[11px] flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <polygon points="5,3 19,12 5,21" />
        </svg>
        {track.play_count >= 1000 ? `${(track.play_count / 1000).toFixed(1)}k` : track.play_count}
      </div>
    </motion.button>
  );
}

export default function DiscoverySections({
  trending,
  genres,
  recommended,
  popular,
}: DiscoverySectionsProps) {
  return (
    <div className="space-y-8 pb-44">
      {/* Trending */}
      <section>
        <SectionHeader title="Trending Now" count={trending.length} />
        <HorizontalScroller>
          {trending.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </HorizontalScroller>
      </section>

      {/* Genres */}
      <section>
        <SectionHeader title="Browse Genres" />
        <HorizontalScroller>
          {genres.map((genre) => (
            <GenreChip key={genre} genre={genre} />
          ))}
        </HorizontalScroller>
      </section>

      {/* Recommended */}
      <section>
        <SectionHeader title="Recommended for You" count={recommended.length} />
        <HorizontalScroller>
          {recommended.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </HorizontalScroller>
      </section>

      {/* Popular tracks list */}
      <section>
        <SectionHeader title="Popular Tracks" count={popular.length} />
        <div>
          {popular.slice(0, 10).map((track, idx) => (
            <PopularTrackRow key={track.id} track={track} rank={idx + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
