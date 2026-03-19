"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GlobeNodeData } from "@/types";

interface GlobeHoverPreviewProps {
  node: GlobeNodeData | null;
  position: { x: number; y: number };
}

export default function GlobeHoverPreview({ node, position }: GlobeHoverPreviewProps) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: position.x + 16,
            top: position.y - 20,
          }}
        >
          <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl min-w-[200px]">
            <div className="flex items-center gap-3">
              {node.track.cover_url ? (
                <img
                  src={node.track.cover_url}
                  alt={node.track.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg"
                  style={{ backgroundColor: node.genreColor }}
                />
              )}
              <div>
                <p className="text-white text-sm font-semibold truncate max-w-[160px]">
                  {node.track.title}
                </p>
                <p className="text-white/60 text-xs truncate max-w-[160px]">
                  {node.track.artist_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: node.genreColor }}
              />
              <span className="text-white/40 text-xs">{node.track.genre}</span>
              <span className="text-white/40 text-xs ml-auto">
                {node.track.play_count.toLocaleString()} plays
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
