"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { RuffyMessage } from "@/types";

const RUFFY_GREETINGS = [
  "Hey! I'm Otoro 🐾 — your AI assistant on Juzzo. Ask me anything about discovering new music, getting recommendations, or navigating the platform!",
  "What's up! Otoro here 🎵 I can help you find new tracks, build playlists, learn about artists, or just chat about music. What's on your mind?",
];

const RUFFY_RESPONSES: Record<string, string> = {
  recommend: "Based on what's trending on Juzzo, you should check out 'Midnight Dreams' by Luna Sol — it's got that ethereal R&B vibe that's blowing up right now. Also try 'Neon Pulse' by Voltage! 🎶",
  playlist: "I'd love to help build a playlist! Try checking out the 'Chill Vibes' genre on the Music page — I've curated some great tracks there. You can also long-press any track to add it to your playlist! 📋",
  trending: "Right now on Juzzo: 'Bass Drop' by DJ Nova is #1, followed by 'Crystal Waves' by Aqua Flow. The Indie Rock genre is also surging — lots of fresh uploads this week! 📈",
  upload: "To upload, tap the ✨ sparkle button at the bottom right! You can upload tracks (MP3/WAV/FLAC up to 50MB) or shorts (vertical videos up to 60 seconds). Add a cover image and tags to boost discovery! 🚀",
  default: "That's a great question! I'm still learning, but I'm getting smarter every day. For now, try exploring the Music page for new discoveries, or check the Home feed for what your favorite artists are posting! 🐾",
};

function getRuffyResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("recommend") || lower.includes("suggest") || lower.includes("listen")) return RUFFY_RESPONSES.recommend;
  if (lower.includes("playlist") || lower.includes("queue")) return RUFFY_RESPONSES.playlist;
  if (lower.includes("trend") || lower.includes("popular") || lower.includes("top")) return RUFFY_RESPONSES.trending;
  if (lower.includes("upload") || lower.includes("post") || lower.includes("share")) return RUFFY_RESPONSES.upload;
  return RUFFY_RESPONSES.default;
}

function initialGreeting(): RuffyMessage {
  return {
    id: "greeting",
    role: "assistant",
    content: RUFFY_GREETINGS[0],
    timestamp: "2026-03-18T12:00:00Z",
  };
}

export default function RuffyChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<RuffyMessage[]>([initialGreeting()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: RuffyMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const resp: RuffyMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: getRuffyResponse(userMsg.content),
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, resp]);
      setTyping(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 80, scale: 0.9 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      className="fixed bottom-[8.5rem] right-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)] h-[28rem] max-h-[calc(100vh-12rem)] bg-[#0c0c1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-xs">🐾</div>
          <div>
            <p className="text-sm font-semibold text-white">Otoro AI</p>
            <p className="text-[10px] text-green-400">Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={
              m.role === "user"
                ? "max-w-[80%] px-3 py-2 rounded-2xl rounded-br-md bg-purple-600 text-white text-sm"
                : "max-w-[80%] px-3 py-2 rounded-2xl rounded-bl-md bg-white/[0.08] text-white/90 text-sm"
            }>
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-2xl rounded-bl-md bg-white/[0.08] text-white/60 text-sm flex gap-1">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/[0.06]">
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Otoro anything about music..."
            className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center text-white disabled:opacity-30 hover:scale-105 active:scale-95 transition-transform"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </form>
      </div>
    </motion.div>
  );
}
