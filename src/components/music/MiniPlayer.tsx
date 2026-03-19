"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/providers/PlayerProvider";

function getCoverUrl(id: string, title: string, coverUrl?: string): string {
  if (coverUrl) return coverUrl;
  const seed = parseInt(id, 10) || title.charCodeAt(0);
  return `https://picsum.photos/seed/${seed + 100}/200/200`;
}

export default function MiniPlayer() {
  const { currentTrack, isPlaying, pause, resume, playNext } = usePlayer();

  if (!currentTrack) return null;

  const coverUrl = getCoverUrl(currentTrack.id, currentTrack.title, currentTrack.cover_url);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="mx-3 mb-1.5 rounded-2xl bg-[#1a1a2e]/90 backdrop-blur-2xl border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/40"
      >
        {/* Progress bar */}
        <div className="h-[2px] bg-white/[0.06] w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "35%" }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Album art */}
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-black/40 relative">
            <img
              src={coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="flex items-end gap-[2px]">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-[2px] bg-white rounded-full"
                      animate={{ height: [3, 9, 3] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">
              {currentTrack.title}
            </p>
            <p className="text-white/40 text-[11px] truncate">
              {currentTrack.artist_name}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={isPlaying ? pause : resume}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </motion.button>

            <button
              onClick={playNext}
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
