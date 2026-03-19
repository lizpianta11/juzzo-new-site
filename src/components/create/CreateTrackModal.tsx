"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useDemo } from "@/providers/DemoProvider";
import { GENRES } from "@/lib/utils/constants";

interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

const WAVEFORM_BARS = [38, 72, 44, 66, 28, 53, 81, 47, 34, 69, 58, 77, 31, 63, 42, 74, 55, 36, 79, 49, 33, 68, 57, 83, 29, 62, 45, 71, 52, 39, 76, 48, 35, 64, 41, 73, 54, 32, 67, 46];

export default function CreateTrackModal({ isOpen, onClose, onPublish }: CreateTrackModalProps) {
  const { createTrack, showToast } = useDemo();
  const [hasAudio, setHasAudio] = useState(false);
  const [hasCover, setHasCover] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const canPublish = hasAudio && title.trim() && artist.trim();

  const handleSelectAudio = () => {
    setHasAudio(true);
    showToast("Audio file loaded 🎧");
  };

  const handleSelectCover = () => {
    setHasCover(true);
    showToast("Cover art added 🎨");
  };

  const handlePublish = () => {
    if (!canPublish) return;
    setIsPublishing(true);
    setTimeout(() => {
      createTrack({
        title,
        artistName: artist,
        genre,
        coverUrl: hasCover ? "https://picsum.photos/seed/cover_art/400/400" : undefined,
      });
      setHasAudio(false);
      setHasCover(false);
      setTitle("");
      setArtist("");
      setGenre("");
      setIsPublishing(false);
      onPublish();
    }, 1000);
  };

  const handleClose = () => {
    setHasAudio(false);
    setHasCover(false);
    setTitle("");
    setArtist("");
    setGenre("");
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
                <h3 className="text-sm font-bold text-white">Upload Track</h3>
                <button
                  onClick={handlePublish}
                  disabled={!canPublish || isPublishing}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                    canPublish
                      ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:opacity-90 active:scale-95"
                      : "bg-white/[0.06] text-white/25 cursor-not-allowed"
                  )}
                >
                  {isPublishing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Publish"
                  )}
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-5 space-y-5">
                {/* Audio + Cover row */}
                <div className="flex gap-4">
                  {/* Cover art */}
                  <div className="flex-shrink-0">
                    {hasCover ? (
                      <div
                        className="relative w-28 h-28 rounded-2xl overflow-hidden cursor-pointer group"
                        onClick={handleSelectCover}
                      >
                        <img src="https://picsum.photos/seed/cover_art/400/400" alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-medium">Change</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleSelectCover}
                        className="w-28 h-28 rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/40 hover:bg-purple-500/[0.04] flex flex-col items-center justify-center gap-1.5 transition-all"
                      >
                        <svg className="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-[10px] text-white/25 leading-tight text-center">Cover Art</span>
                      </button>
                    )}
                  </div>

                  {/* Audio file */}
                  <div className="flex-1">
                    {hasAudio ? (
                      <div className="h-full rounded-2xl bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-white/[0.08] p-4 flex flex-col justify-center relative">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-white/80 font-medium truncate">my_track.wav</p>
                            <p className="text-[11px] text-white/30">WAV • 3:35 • 24-bit / 48kHz</p>
                          </div>
                        </div>
                        {/* Waveform placeholder */}
                        <div className="mt-3 flex items-end gap-[2px] h-6">
                          {WAVEFORM_BARS.map((height, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-purple-500/30 rounded-full"
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => setHasAudio(false)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
                        >
                          <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleSelectAudio}
                        className="w-full h-full min-h-[112px] rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/40 hover:bg-purple-500/[0.04] flex flex-col items-center justify-center gap-2 transition-all"
                      >
                        <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-xs text-white/30">Upload Audio</p>
                        <p className="text-[10px] text-white/20">MP3, WAV, M4A, FLAC</p>
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Track title"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Artist Name *</label>
                  <input
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Your artist name"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenre(genre === g ? "" : g)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                          genre === g
                            ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                            : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.1]"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extra settings */}
                <div className="space-y-2">
                  {[
                    { label: "Add Collaborators", icon: "👥" },
                    { label: "Release Date", icon: "📅" },
                    { label: "Lyrics", icon: "📝" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => showToast(`${item.label} — coming soon`)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] transition-colors"
                    >
                      <span className="text-sm text-white/60 flex items-center gap-2">
                        <span>{item.icon}</span>
                        {item.label}
                      </span>
                      <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
