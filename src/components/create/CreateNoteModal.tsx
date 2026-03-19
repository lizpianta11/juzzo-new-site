"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useDemo } from "@/providers/DemoProvider";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

const MAX_CHARS = 280;

export default function CreateNoteModal({ isOpen, onClose, onPublish }: CreateNoteModalProps) {
  const { currentUser, createNote } = useDemo();
  const [body, setBody] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const charCount = body.length;
  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100);
  const isOver = charCount > MAX_CHARS;

  const handlePublish = () => {
    if (!body.trim() || isOver) return;
    setIsPublishing(true);
    setTimeout(() => {
      createNote(body);
      setBody("");
      setIsPublishing(false);
      onPublish();
    }, 800);
  };

  const handleClose = () => {
    setBody("");
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
            className="fixed inset-x-4 top-[10%] z-[91] mx-auto max-w-lg"
          >
            <div className="rounded-3xl bg-[#0c0c1a]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <button onClick={handleClose} className="text-sm text-white/50 hover:text-white/80 transition-colors font-medium">
                  Cancel
                </button>
                <h3 className="text-sm font-bold text-white">New Note</h3>
                <button
                  onClick={handlePublish}
                  disabled={!body.trim() || isOver || isPublishing}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                    body.trim() && !isOver
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 active:scale-95"
                      : "bg-white/[0.06] text-white/25 cursor-not-allowed"
                  )}
                >
                  {isPublishing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Post"
                  )}
                </button>
              </div>

              {/* Composer */}
              <div className="p-5">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={currentUser.avatar_url || ""}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/[0.06]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-1">{currentUser.display_name}</p>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="What's on your mind?"
                      autoFocus
                      className="w-full bg-transparent text-white text-[15px] placeholder-white/25 resize-none outline-none min-h-[120px] leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
                {/* Quick action icons */}
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-full hover:bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-amber-400 transition-colors" title="Add hashtag">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.6 19.5m-2.1-19.5l-3.6 19.5" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full hover:bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-blue-400 transition-colors" title="Mention">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full hover:bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-cyan-400 transition-colors" title="Link track">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                  </button>
                </div>

                {/* Character counter */}
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeOpacity={0.08} strokeWidth={2.5} />
                      <circle
                        cx="12" cy="12" r="10" fill="none"
                        stroke={isOver ? "#ef4444" : charPercent > 80 ? "#f59e0b" : "#a855f7"}
                        strokeWidth={2.5}
                        strokeDasharray={62.83}
                        strokeDashoffset={62.83 - (62.83 * charPercent) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  {charCount > 0 && (
                    <span className={cn("text-xs font-medium", isOver ? "text-red-400" : "text-white/30")}>
                      {MAX_CHARS - charCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
