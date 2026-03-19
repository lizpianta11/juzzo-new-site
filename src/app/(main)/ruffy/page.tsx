"use client";

import { useRouter } from "next/navigation";

export default function RuffyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#050510] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#050510]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-sm">🐾</div>
            <div>
              <p className="text-sm font-semibold text-white">Otoro AI</p>
              <p className="text-[10px] text-green-400">Online — your AI assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Full-page chat */}
      <div className="flex-1 relative">
        <RuffyFullPage />
      </div>
    </div>
  );
}

/* Full-page version of Ruffy (no overlay positioning) */
import { useState, useRef, useEffect } from "react";
import type { RuffyMessage } from "@/types";

const GREETINGS = [
  "Hey! I'm Otoro 🐾 — your AI music assistant on Juzzo. Ask me anything about discovering new music, getting recommendations, or navigating the platform!",
  "What's up! Otoro here 🎵 I can help you find new tracks, build playlists, learn about artists, or just chat about music. What's on your mind?",
];

const RESPONSES: Record<string, string> = {
  recommend: "Based on what's trending on Juzzo, you should check out 'Midnight Dreams' by Luna Sol — it's got that ethereal R&B vibe that's blowing up right now. Also try 'Neon Pulse' by Voltage! 🎶",
  playlist: "I'd love to help build a playlist! Try checking out the 'Chill Vibes' genre on the Music page — I've curated some great tracks there. You can also long-press any track to add it to your playlist! 📋",
  trending: "Right now on Juzzo: 'Bass Drop' by DJ Nova is #1, followed by 'Crystal Waves' by Aqua Flow. The Indie Rock genre is also surging — lots of fresh uploads this week! 📈",
  upload: "To upload, tap the ✨ sparkle button at the bottom right! You can upload tracks (MP3/WAV/FLAC up to 50MB) or shorts (vertical videos up to 60 seconds). Add a cover image and tags to boost discovery! 🚀",
  default: "That's a great question! I'm still learning, but I'm getting smarter every day. For now, try exploring the Music page for new discoveries, or check the Home feed for what your favorite artists are posting! 🐾",
};

function getResponse(msg: string): string {
  const l = msg.toLowerCase();
  if (l.includes("recommend") || l.includes("suggest") || l.includes("listen")) return RESPONSES.recommend;
  if (l.includes("playlist") || l.includes("queue")) return RESPONSES.playlist;
  if (l.includes("trend") || l.includes("popular") || l.includes("top")) return RESPONSES.trending;
  if (l.includes("upload") || l.includes("post") || l.includes("share")) return RESPONSES.upload;
  return RESPONSES.default;
}

function initialGreeting(): RuffyMessage {
  return {
    id: "greeting",
    role: "assistant",
    content: GREETINGS[0],
    timestamp: "2026-03-18T12:00:00Z",
  };
}

function RuffyFullPage() {
  const [messages, setMessages] = useState<RuffyMessage[]>([initialGreeting()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: RuffyMessage = { id: crypto.randomUUID(), role: "user", content: input.trim(), timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: getResponse(userMsg.content), timestamp: new Date().toISOString() }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={m.role === "user"
              ? "max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-purple-600 text-white text-sm"
              : "max-w-[80%] px-4 py-2.5 rounded-2xl rounded-bl-md bg-white/[0.08] text-white/90 text-sm"
            }>
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-white/[0.08] text-white/60 text-sm flex gap-1">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {["Recommend music", "What's trending?", "How to upload?", "Build a playlist"].map((s) => (
          <button
            key={s}
            onClick={() => { setInput(s); }}
            className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs text-white/50 hover:bg-white/10 hover:text-white/70 whitespace-nowrap transition"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="p-4 pb-40 border-t border-white/[0.06]">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Otoro anything about music..."
            className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
          <button type="submit" disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center text-white disabled:opacity-30 hover:scale-105 active:scale-95 transition-transform">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
