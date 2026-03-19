"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDemo } from "@/providers/DemoProvider";

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
}

const POST_TYPES = [
  { key: "note", label: "Note", icon: "💬", placeholder: "What's on your mind?" },
  { key: "post", label: "Post", icon: "📝", placeholder: "Share something with your followers..." },
] as const;

export default function ComposeModal({ open, onClose }: ComposeModalProps) {
  const { currentUser, createNote, createPost } = useDemo();
  const [type, setType] = useState<"note" | "post">("note");
  const [body, setBody] = useState("");

  if (!open) return null;

  const currentType = POST_TYPES.find((t) => t.key === type)!;

  const handlePost = () => {
    if (!body.trim()) return;
    if (type === "note") createNote(body);
    else createPost({ body, images: [] });
    setBody("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        className="absolute inset-x-4 top-[8%] max-w-lg mx-auto bg-[#0c0c1a] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <button onClick={onClose} className="text-sm text-white/50 hover:text-white transition">
            Cancel
          </button>
          <div className="flex gap-1 bg-white/[0.04] rounded-full p-0.5">
            {POST_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  type === t.key
                    ? "bg-white text-black"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={handlePost}
            disabled={!body.trim()}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-sm font-semibold text-white disabled:opacity-30 hover:opacity-90 transition"
          >
            Post
          </button>
        </div>

        {/* Compose area */}
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
              <img src={currentUser.avatar_url || "https://i.pravatar.cc/40"} alt="You" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-semibold text-white">{currentUser.display_name}</span>
                {currentUser.is_verified && (
                  <svg className="w-3.5 h-3.5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                  </svg>
                )}
                <span className="text-[11px] text-white/30">@{currentUser.username}</span>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                maxLength={type === "note" ? 280 : 2000}
                placeholder={currentType.placeholder}
                autoFocus
                className="w-full bg-transparent text-[15px] text-white/85 placeholder:text-white/20 focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/[0.08] transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5" /></svg>
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/[0.08] transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/[0.08] transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" /></svg>
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/[0.08] transition">
                    🎵
                  </button>
                </div>
                <span className="text-[10px] text-white/20">
                  {body.length}/{type === "note" ? 280 : 2000}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
