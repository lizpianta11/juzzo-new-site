"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useDemo } from "@/providers/DemoProvider";
import { DEMO_TRACKS } from "@/lib/demo-data";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

export default function CreatePlaylistModal({ isOpen, onClose, onPublish }: CreatePlaylistModalProps) {
  const { createPlaylist, showToast } = useDemo();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasCover, setHasCover] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [showTrackPicker, setShowTrackPicker] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const canSave = title.trim().length > 0;

  const toggleTrack = (id: string) => {
    setSelectedTracks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handlePublish = () => {
    if (!canSave) return;
    setIsPublishing(true);
    setTimeout(() => {
      createPlaylist({
        title,
        description,
        trackIds: selectedTracks,
        coverUrl: hasCover ? "https://picsum.photos/seed/playlist_cover/400/400" : undefined,
      });
      setTitle("");
      setDescription("");
      setHasCover(false);
      setSelectedTracks([]);
      setIsPublishing(false);
      onPublish();
    }, 800);
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setHasCover(false);
    setSelectedTracks([]);
    setShowTrackPicker(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="fixed inset-x-4 top-[6%] z-[91] mx-auto max-w-lg max-h-[88vh] flex flex-col"
          >
            <div className="rounded-3xl bg-[#0c0c1a]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col max-h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
                <button onClick={handleClose} className="text-sm text-white/50 hover:text-white/80 transition-colors font-medium">
                  Cancel
                </button>
                <h3 className="text-sm font-bold text-white">New Playlist</h3>
                <button
                  onClick={handlePublish}
                  disabled={!canSave || isPublishing}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                    canSave
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:opacity-90 active:scale-95"
                      : "bg-white/[0.06] text-white/25 cursor-not-allowed"
                  )}
                >
                  {isPublishing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-5 space-y-5">
                {/* Cover + info row */}
                <div className="flex gap-4">
                  {/* Cover */}
                  {hasCover ? (
                    <div
                      className="relative w-28 h-28 rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0"
                      onClick={() => setHasCover(false)}
                    >
                      <img src="https://picsum.photos/seed/playlist_cover/400/400" alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white font-medium">Change</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setHasCover(true);
                        showToast("Cover added 🖼️");
                      }}
                      className="w-28 h-28 flex-shrink-0 rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] flex flex-col items-center justify-center gap-1.5 transition-all"
                    >
                      <svg className="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <span className="text-[10px] text-white/25">Cover</span>
                    </button>
                  )}

                  {/* Title + description */}
                  <div className="flex-1 space-y-3">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Playlist name *"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-emerald-500/50 transition-colors"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/25 resize-none outline-none focus:border-emerald-500/50 transition-colors h-16"
                    />
                  </div>
                </div>

                {/* Add tracks */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      Tracks ({selectedTracks.length})
                    </label>
                    <button
                      onClick={() => setShowTrackPicker(!showTrackPicker)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {showTrackPicker ? "Done" : "+ Add Tracks"}
                    </button>
                  </div>

                  {/* Selected tracks list */}
                  {selectedTracks.length > 0 && !showTrackPicker && (
                    <div className="space-y-1.5 mb-3">
                      {selectedTracks.map((id, i) => {
                        const track = DEMO_TRACKS.find((t) => t.id === id);
                        if (!track) return null;
                        return (
                          <div key={id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                            <span className="text-xs text-white/20 w-5 text-center font-mono">{i + 1}</span>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs">🎵</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white/80 font-medium truncate">{track.title}</p>
                              <p className="text-[11px] text-white/35 truncate">{track.artist_name}</p>
                            </div>
                            <button
                              onClick={() => toggleTrack(id)}
                              className="w-6 h-6 rounded-full hover:bg-white/[0.08] flex items-center justify-center transition-colors"
                            >
                              <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Track picker */}
                  {showTrackPicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 max-h-60 overflow-y-auto rounded-xl border border-white/[0.06] p-1.5"
                    >
                      {DEMO_TRACKS.slice(0, 15).map((track) => {
                        const isSelected = selectedTracks.includes(track.id);
                        return (
                          <button
                            key={track.id}
                            onClick={() => toggleTrack(track.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                              isSelected ? "bg-emerald-500/10" : "hover:bg-white/[0.04]"
                            )}
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                              isSelected ? "border-emerald-500 bg-emerald-500" : "border-white/20"
                            )}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className={cn("text-sm font-medium truncate", isSelected ? "text-emerald-300" : "text-white/70")}>
                                {track.title}
                              </p>
                              <p className="text-[11px] text-white/30 truncate">{track.artist_name} • {track.genre}</p>
                            </div>
                            <span className="text-[11px] text-white/20 flex-shrink-0">
                              {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, "0")}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Empty state */}
                  {selectedTracks.length === 0 && !showTrackPicker && (
                    <button
                      onClick={() => setShowTrackPicker(true)}
                      className="w-full py-8 rounded-xl border border-dashed border-white/[0.08] hover:border-emerald-500/30 flex flex-col items-center justify-center gap-2 transition-all"
                    >
                      <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <p className="text-xs text-white/30">Add tracks to your playlist</p>
                    </button>
                  )}
                </div>

                {/* Visibility */}
                <button
                  onClick={() => showToast("Visibility settings — coming soon")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] transition-colors"
                >
                  <span className="text-sm text-white/60 flex items-center gap-2">
                    <span>🌐</span>
                    Visibility
                  </span>
                  <span className="text-xs text-white/30 flex items-center gap-1">
                    Public
                    <svg className="w-3.5 h-3.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
