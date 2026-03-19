"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/providers/PlayerProvider";

export default function FloatingPlayer() {
  const { currentTrack, isPlaying, progress, pause, resume, playNext, setVolume, volume } =
    usePlayer();

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-3 max-w-screen-xl mx-auto">
          {/* Track info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {currentTrack.cover_url ? (
              <img
                src={currentTrack.cover_url}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover shadow-lg"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500" />
            )}
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {currentTrack.title}
              </p>
              <p className="text-white/50 text-xs truncate">
                {currentTrack.artist_name}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={isPlaying ? pause : resume}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
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
            </button>

            <button
              onClick={playNext}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,4 15,12 5,20" />
                <rect x="17" y="4" width="2" height="16" />
              </svg>
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <svg className="w-4 h-4 text-white/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-purple-500"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
