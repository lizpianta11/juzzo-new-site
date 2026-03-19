"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useDemo } from "@/providers/DemoProvider";

interface CreateShortVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

export default function CreateShortVideoModal({ isOpen, onClose, onPublish }: CreateShortVideoModalProps) {
  const { createShort, showToast } = useDemo();
  const [hasVideo, setHasVideo] = useState(false);
  const [caption, setCaption] = useState("");
  const [sound, setSound] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSelectVideo = () => {
    setHasVideo(true);
    showToast("Video selected 🎬");
  };

  const handlePublish = () => {
    if (!hasVideo) return;
    setIsPublishing(true);
    setTimeout(() => {
      createShort({ caption, sound });
      setHasVideo(false);
      setCaption("");
      setSound("");
      setIsPublishing(false);
      onPublish();
    }, 1000);
  };

  const handleClose = () => {
    setHasVideo(false);
    setCaption("");
    setSound("");
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
                <h3 className="text-sm font-bold text-white">New Short</h3>
                <button
                  onClick={handlePublish}
                  disabled={!hasVideo || isPublishing}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                    hasVideo
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-90 active:scale-95"
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
                {/* Video area */}
                {hasVideo ? (
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-white/[0.08]">
                    {/* Mock video thumbnail */}
                    <div className="aspect-[9/14] flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-3">
                        <svg className="w-10 h-10 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-sm text-white/60 font-medium">my_short_video.mp4</p>
                      <p className="text-xs text-white/30 mt-1">9:16 • 0:28 • 1080×1920</p>
                    </div>
                    {/* Remove */}
                    <button
                      onClick={() => setHasVideo(false)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSelectVideo}
                    className="w-full aspect-[9/14] rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] flex flex-col items-center justify-center gap-3 transition-all"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-white/50 font-medium">Upload a Short Video</p>
                      <p className="text-[11px] text-white/25 mt-1">MP4, MOV, WebM • Vertical 9:16</p>
                    </div>
                  </button>
                )}

                {/* Caption */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Caption</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe your short..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 resize-none outline-none focus:border-cyan-500/50 transition-colors h-20"
                  />
                </div>

                {/* Sound / music */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Sound / Music</label>
                  <button
                    onClick={() => {
                      setSound("Midnight Dreams — Luna Ray");
                      showToast("Track linked 🎵");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/30 transition-colors"
                  >
                    {sound ? (
                      <>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                          <span className="text-sm">🎵</span>
                        </div>
                        <span className="text-sm text-white/80 flex-1 text-left">{sound}</span>
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                          </svg>
                        </div>
                        <span className="text-sm text-white/30 flex-1 text-left">Add a sound or track</span>
                        <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Additional options */}
                <div className="space-y-2">
                  {[
                    { label: "Add Hashtags", icon: "#" },
                    { label: "Audience Settings", icon: "🌐" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => showToast(`${item.label} — coming soon`)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] transition-colors"
                    >
                      <span className="text-sm text-white/60 flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
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
