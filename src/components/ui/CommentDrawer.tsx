"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BottomSheet from "@/components/ui/BottomSheet";
import { DEMO_PROFILES } from "@/lib/demo-data";
import { useDemo } from "@/providers/DemoProvider";

interface CommentDrawerProps {
  open: boolean;
  onClose: () => void;
  targetType: string;
  targetId: string;
  initialCount: number;
}

interface DemoComment {
  id: string;
  body: string;
  author: string;
  avatar: string;
  username: string;
  verified: boolean;
  time: string;
  likes: number;
}

const SEED_COMMENTS: DemoComment[] = [
  { id: "c1", body: "This is absolutely fire 🔥🔥🔥", author: "KVNG", avatar: "https://i.pravatar.cc/40?u=kvng", username: "kvng", verified: true, time: "2h", likes: 234 },
  { id: "c2", body: "Can't stop replaying this!!", author: "Ava Lin", avatar: "https://i.pravatar.cc/40?u=avalin", username: "avalin", verified: true, time: "4h", likes: 156 },
  { id: "c3", body: "The vibes are immaculate ✨", author: "Seren", avatar: "https://i.pravatar.cc/40?u=seren", username: "seren", verified: false, time: "6h", likes: 89 },
  { id: "c4", body: "Instant follow after hearing this", author: "Kai", avatar: "https://i.pravatar.cc/40?u=kai", username: "kai", verified: false, time: "8h", likes: 45 },
  { id: "c5", body: "Need more of this energy 🫶", author: "Rosa", avatar: "https://i.pravatar.cc/40?u=rosa", username: "rosa", verified: true, time: "12h", likes: 312 },
];

export default function CommentDrawer({ open, onClose, targetType, targetId, initialCount }: CommentDrawerProps) {
  const { currentUser, showToast } = useDemo();
  const [comments, setComments] = useState<DemoComment[]>(SEED_COMMENTS);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newComment: DemoComment = {
      id: crypto.randomUUID(),
      body: input.trim(),
      author: currentUser.display_name,
      avatar: currentUser.avatar_url || "https://i.pravatar.cc/40",
      username: currentUser.username,
      verified: currentUser.is_verified,
      time: "now",
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
    setInput("");
    showToast("Comment posted!");
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={`${initialCount + comments.length - SEED_COMMENTS.length} Comments`} heightClass="h-[75vh]">
      {/* Comment input */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
            <img src={currentUser.avatar_url || "https://i.pravatar.cc/32"} alt="You" className="w-full h-full object-cover" />
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-xs font-semibold text-white disabled:opacity-30 hover:opacity-90 transition"
            >
              Post
            </button>
          </form>
        </div>
      </div>

      {/* Comments list */}
      <div className="p-4 space-y-4">
        {comments.map((c, i) => (
          <motion.div
            key={c.id}
            initial={i === 0 && c.time === "now" ? { opacity: 0, y: -10 } : false}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
              <img src={c.avatar} alt={c.author} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white">{c.author}</span>
                {c.verified && (
                  <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                  </svg>
                )}
                <span className="text-[10px] text-white/25">· {c.time}</span>
              </div>
              <p className="text-sm text-white/70 mt-0.5 leading-relaxed">{c.body}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <button className="text-[10px] text-white/30 hover:text-pink-400 transition flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {c.likes > 0 && c.likes}
                </button>
                <button className="text-[10px] text-white/30 hover:text-white/60 transition">Reply</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </BottomSheet>
  );
}
