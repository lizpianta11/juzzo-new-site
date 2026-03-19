"use client";

import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { Track, Post, Short, Playlist } from "@/types";
import { useDemo } from "@/providers/DemoProvider";
import { usePlayer } from "@/providers/PlayerProvider";
import EditProfileModal from "@/components/ui/EditProfileModal";
import ShareModal from "@/components/ui/ShareModal";
import CreateMenu from "@/components/create/CreateMenu";

/* ─── Tabs ─── */
const TABS = [
  { key: "tracks", label: "Tracks", icon: "🎵" },
  { key: "posts", label: "Posts", icon: "📝" },
  { key: "shorts", label: "Shorts", icon: "🎬" },
  { key: "playlists", label: "Playlists", icon: "📋" },
  { key: "liked", label: "Liked", icon: "♥" },
  { key: "saved", label: "Saved", icon: "🔖" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

/* ═══════════════════════════════════════════════
   STAT COLUMN — premium stat display
   ═══════════════════════════════════════════════ */
function StatColumn({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-5 py-1">
      <span className="text-xl font-bold text-white tracking-tight">{formatCount(value)}</span>
      <span className="text-[11px] text-white/30 font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   QUICK ACCESS GRID — premium module cards
   ═══════════════════════════════════════════════ */
type QuickAccessLinkItem = {
  icon: string;
  label: string;
  desc: string;
  href: string;
  gradient: string;
  badge?: string;
};

type QuickAccessActionItem = {
  icon: string;
  label: string;
  desc: string;
  action: string;
  gradient: string;
  badge?: string;
};

type QuickAccessItem = QuickAccessLinkItem | QuickAccessActionItem;

const QUICK_ACCESS: QuickAccessItem[] = [
  { icon: "🎵", label: "My Playlists", desc: "Jump to your mixes", action: "playlists", gradient: "from-pink-600 to-rose-500" },
  { icon: "📊", label: "Analytics", desc: "Track your growth", action: "analytics", gradient: "from-blue-600 to-indigo-500" },
  { icon: "🎙️", label: "Creator Tools", desc: "Manage content", action: "creator-tools", gradient: "from-amber-500 to-orange-600" },
  { icon: "🔔", label: "Notifications", desc: "12 unread", action: "notifications", gradient: "from-pink-500 to-red-500", badge: "12" },
  { icon: "⚙️", label: "Settings", desc: "Account & privacy", href: "/settings", gradient: "from-slate-500 to-slate-600" },
  { icon: "🎨", label: "Themes", desc: "Customize look", action: "themes", gradient: "from-violet-500 to-purple-600" },
  { icon: "📤", label: "Upload", desc: "Share content", action: "upload", gradient: "from-emerald-500 to-green-600" },
  { icon: "🌍", label: "Discover", desc: "Music globe", href: "/discover", gradient: "from-cyan-500 to-blue-600" },
];

function hasHref(item: QuickAccessItem): item is QuickAccessItem & { href: string } {
  return "href" in item && typeof item.href === "string";
}

function QuickAccessGrid({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {QUICK_ACCESS.map((item) => (
        hasHref(item) ? (
          <Link
            key={item.label}
            href={item.href}
            className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-200 overflow-hidden active:scale-[0.97]"
          >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 bg-gradient-to-br", item.gradient)} />
            <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-xl shadow-lg relative", item.gradient)}>
              {item.icon}
              {"badge" in item && item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                  {item.badge}
                </span>
              )}
            </div>
            <div className="text-center relative">
              <p className="text-sm font-semibold text-white group-hover:text-white transition">{item.label}</p>
              <p className="text-[11px] text-white/30 mt-0.5">{item.desc}</p>
            </div>
            <svg className="w-4 h-4 text-white/10 group-hover:text-white/30 transition absolute top-3 right-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </Link>
        ) : (
          <button
            key={item.label}
            onClick={() => onAction(item.action)}
            className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-200 overflow-hidden active:scale-[0.97]"
          >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 bg-gradient-to-br", item.gradient)} />
            <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-xl shadow-lg relative", item.gradient)}>
              {item.icon}
              {"badge" in item && item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                  {item.badge}
                </span>
              )}
            </div>
            <div className="text-center relative">
              <p className="text-sm font-semibold text-white group-hover:text-white transition">{item.label}</p>
              <p className="text-[11px] text-white/30 mt-0.5">{item.desc}</p>
            </div>
            <svg className="w-4 h-4 text-white/10 group-hover:text-white/30 transition absolute top-3 right-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        )
      ))}
    </div>
  );
}

function FeatureModal({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} className="fixed inset-x-4 top-[10%] z-[86] mx-auto max-w-2xl rounded-3xl border border-white/[0.08] bg-[#0c0c1a]/95 p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-1 text-sm text-white/35">{subtitle}</p>
              </div>
              <button onClick={onClose} className="rounded-full bg-white/[0.06] p-2 text-white/40 hover:bg-white/[0.1] hover:text-white/70 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   RUFFY.AI CARD — AI email & inbox system
   ═══════════════════════════════════════════════ */
function RuffyAiCard() {
  const ACTIONS = [
    { label: "View Inbox", icon: "📥", desc: "3 unread", href: "/inbox" },
    { label: "Compose Email", icon: "✏️", desc: "New message", href: "/inbox?compose=true" },
    { label: "Smart Replies", icon: "⚡", desc: "AI-drafted", href: "/inbox?tab=ai" },
    { label: "Priority Messages", icon: "🔥", desc: "Important first", href: "/inbox?tab=priority" },
  ];

  return (
    <div className="rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-950/40 via-[#0a0a1e] to-indigo-950/20 relative overflow-hidden">
      {/* Ambient glows — blue/indigo tones for email */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.08] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/[0.06] rounded-full blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/[0.04] rounded-full blur-[60px]" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3.5">
            {/* Envelope + AI icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/25 relative">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {/* AI sparkle badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-400/30">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Ruffy.ai</h3>
              <p className="text-[11px] text-blue-300/60 font-medium mt-0.5">AI Email &amp; Inbox Manager</p>
            </div>
          </div>
          <Link
            href="/inbox"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-sm font-semibold text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Open Inbox
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-white/40 mb-4 max-w-lg">Manage your inbox, send emails, and connect your social communications — all powered by AI.</p>

        {/* Inbox stats strip */}
        <div className="flex items-center gap-4 mb-5 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.04]">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
            <span className="text-white/50">3 unread</span>
          </div>
          <div className="w-px h-4 bg-white/[0.06]" />
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
            <span className="text-white/50">1 priority</span>
          </div>
          <div className="w-px h-4 bg-white/[0.06]" />
          <div className="flex items-center gap-2 text-[12px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-white/50">2 AI drafts ready</span>
          </div>
        </div>

        {/* Action grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-blue-500/20 transition-all duration-200 active:scale-[0.97]"
            >
              <span className="text-lg">{action.icon}</span>
              <div>
                <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition leading-tight">{action.label}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONTENT SUB-COMPONENTS — track, post, short, playlist
   ═══════════════════════════════════════════════ */

function TrackRow({ track }: { track: Track }) {
  const { play } = usePlayer();
  const coverUrl = track.cover_url || `https://picsum.photos/seed/${parseInt(track.id) + 100}/80/80`;
  return (
    <button
      onClick={() => play(track)}
      className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/[0.04] transition-all group text-left active:scale-[0.99]"
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-black/40">
        <img src={coverUrl} alt={track.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{track.title}</p>
        <p className="text-[12px] text-white/30 mt-0.5">{track.genre} · {formatCount(track.play_count)} plays</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:bg-white/[0.1]">
        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
      </div>
    </button>
  );
}

function MiniPostCard({ post }: { post: Post }) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all cursor-pointer group">
      {post.images && post.images.length > 0 && (
        <div className="aspect-video rounded-xl overflow-hidden mb-3">
          <img src={post.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        </div>
      )}
      <p className="text-sm text-white/65 line-clamp-3 leading-relaxed">{post.body}</p>
      <div className="flex items-center gap-4 mt-3 text-[12px] text-white/25">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
          {formatCount(post.like_count)}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.86 4.023 2.273 5.48" /></svg>
          {formatCount(post.comment_count)}
        </span>
      </div>
    </div>
  );
}

function ShortGrid({ shorts }: { shorts: Short[] }) {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
      {shorts.map((s) => (
        <div key={s.id} className="relative aspect-[9/14] rounded-2xl overflow-hidden bg-white/[0.06] cursor-pointer group">
          <img src={s.thumbnail_url || `https://picsum.photos/seed/${s.id}/270/480`} alt={s.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-[11px] font-medium text-white line-clamp-1">{s.caption}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{formatCount(s.view_count || 0)} views</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const { showToast } = useDemo();
  return (
    <button
      onClick={() => showToast("Playlist opened!")}
      className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer group text-left active:scale-[0.99]"
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-black/30 bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{playlist.title}</p>
        <p className="text-[12px] text-white/30 mt-0.5">{playlist.track_count || 0} tracks{playlist.description && ` · ${playlist.description}`}</p>
      </div>
      <svg className="w-4 h-4 text-white/15 group-hover:text-white/35 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
    </button>
  );
}

function EmptyState({ text, subtitle }: { text: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-white/20">
      <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
        <svg className="w-9 h-9 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
          <path strokeLinecap="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859" />
        </svg>
      </div>
      <p className="text-sm font-medium text-white/30">{text}</p>
      {subtitle && <p className="text-[13px] text-white/15 mt-1.5 text-center max-w-xs">{subtitle}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN ME PAGE
   ═══════════════════════════════════════════════ */
export default function MePage({
  tracks,
  posts,
  shorts,
  playlists = [],
}: {
  tracks: Track[];
  posts: Post[];
  shorts: Short[];
  playlists?: Playlist[];
}) {
  const {
    currentUser,
    createdTracks,
    createdPosts,
    createdShorts,
    createdPlaylists,
    likedKeys,
    savedKeys,
    showToast,
  } = useDemo();
  const [tab, setTab] = useState<TabKey>("tracks");
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<null | "analytics" | "creator-tools" | "notifications" | "themes">(null);

  const allTracks = useMemo(() => [...createdTracks, ...tracks], [createdTracks, tracks]);
  const allPosts = useMemo(() => [...createdPosts, ...posts], [createdPosts, posts]);
  const allShorts = useMemo(() => [...createdShorts, ...shorts], [createdShorts, shorts]);
  const allPlaylists = useMemo(() => [...createdPlaylists, ...playlists], [createdPlaylists, playlists]);

  const likedTracks = useMemo(() => allTracks.filter((item) => likedKeys.has(`track:${item.id}`)), [allTracks, likedKeys]);
  const likedPosts = useMemo(() => allPosts.filter((item) => likedKeys.has(`post:${item.id}`)), [allPosts, likedKeys]);
  const likedShorts = useMemo(() => allShorts.filter((item) => likedKeys.has(`short:${item.id}`)), [allShorts, likedKeys]);
  const savedTracks = useMemo(() => allTracks.filter((item) => savedKeys.has(`track:${item.id}`)), [allTracks, savedKeys]);
  const savedPosts = useMemo(() => allPosts.filter((item) => savedKeys.has(`post:${item.id}`)), [allPosts, savedKeys]);
  const savedShorts = useMemo(() => allShorts.filter((item) => savedKeys.has(`short:${item.id}`)), [allShorts, savedKeys]);

  const handleQuickAction = (action: string) => {
    if (action === "playlists") {
      setTab("playlists");
      showToast("Jumped to your playlists");
      return;
    }
    if (action === "upload") {
      setCreateMenuOpen(true);
      return;
    }
    if (action === "analytics" || action === "creator-tools" || action === "notifications" || action === "themes") {
      setActivePanel(action);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510]">
      {/* ─── Top bar ─── */}
      <header className="sticky top-0 z-30 bg-[#050510]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
          <h1 className="text-lg font-bold text-white tracking-tight">Profile</h1>
          <div className="flex items-center gap-1">
            <Link href="/upload/track" className="p-2.5 hover:bg-white/[0.06] rounded-xl transition-colors group">
              <svg className="w-5 h-5 text-white/40 group-hover:text-white/70 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </Link>
            <Link href="/settings" className="p-2.5 hover:bg-white/[0.06] rounded-xl transition-colors group">
              <svg className="w-5 h-5 text-white/40 group-hover:text-white/70 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Profile Hero ─── */}
      <div className="relative">
        {/* Banner — taller, richer, more premium */}
        <div className="h-44 md:h-52 relative overflow-hidden">
          {currentUser.banner_url ? (
            <img src={currentUser.banner_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/60 via-[#0c0c20] to-cyan-900/50" />
          )}
          {/* Multi-layer glow overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(168,85,247,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(6,182,212,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(236,72,153,0.12),transparent_50%)]" />
          {/* Bottom fade into page */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050510] to-transparent" />
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        </div>

        {/* Profile identity card — overlaps banner */}
        <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 p-[3.5px] shadow-2xl shadow-purple-500/25 ring-4 ring-[#050510]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#050510]">
                  <img
                    src={currentUser.avatar_url || "https://i.pravatar.cc/144"}
                    alt={currentUser.display_name || "You"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Identity + actions */}
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Name block */}
                <div className="min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2 tracking-tight">
                    {currentUser.display_name}
                    {currentUser.is_verified && (
                      <svg className="w-6 h-6 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                      </svg>
                    )}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-white/35 font-medium">@{currentUser.username}</p>
                    {currentUser.pronouns && (
                      <span className="text-xs text-white/20 bg-white/[0.04] px-2.5 py-0.5 rounded-full">{currentUser.pronouns}</span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => setEditOpen(true)}
                    className="px-7 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-sm font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 hover:opacity-95 transition-all active:scale-95"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShareOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-sm font-medium text-white/60 hover:bg-white/[0.1] hover:text-white/85 hover:border-white/[0.15] transition-all active:scale-95"
                  >
                    Share
                  </button>
                </div>
              </div>

              {/* Bio */}
              {currentUser.bio && (
                <p className="text-[15px] text-white/50 mt-3 max-w-lg leading-relaxed">{currentUser.bio}</p>
              )}

              {/* Meta: location, website */}
              {(currentUser.location || currentUser.website) && (
                <div className="flex items-center gap-5 mt-3 text-[13px] text-white/30">
                  {currentUser.location && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {currentUser.location}
                    </span>
                  )}
                  {currentUser.website && (
                    <span className="flex items-center gap-1.5 text-cyan-300/40 hover:text-cyan-300/70 transition cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.338a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
                      </svg>
                      {currentUser.website}
                    </span>
                  )}
                </div>
              )}

              {/* Genre tags */}
              {currentUser.genres && currentUser.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentUser.genres.map((g) => (
                    <span key={g} className="px-3 py-1 rounded-full bg-cyan-400/[0.08] border border-cyan-400/[0.08] text-[11px] font-medium text-cyan-200/50">
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-6 flex items-center">
            <div className="flex items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <StatColumn label="Followers" value={currentUser.follower_count || 0} />
              <div className="w-px h-8 bg-white/[0.06]" />
              <StatColumn label="Following" value={currentUser.following_count || 0} />
              <div className="w-px h-8 bg-white/[0.06]" />
              <StatColumn label="Tracks" value={currentUser.track_count || 0} />
              <div className="w-px h-8 bg-white/[0.06]" />
              <StatColumn label="Posts" value={currentUser.post_count || 0} />
              <div className="w-px h-8 bg-white/[0.06]" />
              <StatColumn label="Shorts" value={currentUser.short_count || 0} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Page body — wider, better spacing ─── */}
      <div className="max-w-5xl mx-auto px-6 mt-10 space-y-10 pb-36">

        {/* Ruffy.ai — AI email & inbox */}
        <section>
          <RuffyAiCard />
        </section>

        {/* Quick Access Grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-[0.2em]">Quick Access</h3>
            <Link href="/settings" className="text-xs text-white/25 hover:text-white/50 transition font-medium">
              Manage →
            </Link>
          </div>
          <QuickAccessGrid onAction={handleQuickAction} />
        </section>

        {/* Content Tabs */}
        <section>
          {/* Tab bar */}
          <div className="sticky top-14 z-20 bg-[#050510]/90 backdrop-blur-2xl border-b border-white/[0.06] -mx-6 px-6 mb-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "py-4 px-4 text-[13px] font-semibold transition-colors relative whitespace-nowrap flex items-center gap-2",
                    tab === t.key ? "text-white" : "text-white/30 hover:text-white/55"
                  )}
                >
                  <span className="text-sm">{t.icon}</span>
                  {t.label}
                  {tab === t.key && (
                    <motion.div
                      layoutId="meTabIndicator"
                      className="absolute bottom-0 inset-x-2 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {tab === "tracks" && (
              <motion.div key="tracks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-1">
                {allTracks.length > 0 ? allTracks.map((t) => <TrackRow key={t.id} track={t} />) : <EmptyState text="No tracks yet" subtitle="Upload your first track to get started!" />}
              </motion.div>
            )}
            {tab === "posts" && (
              <motion.div key="posts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allPosts.length > 0 ? allPosts.map((p) => <MiniPostCard key={p.id} post={p} />) : <EmptyState text="No posts yet" subtitle="Share what's on your mind!" />}
              </motion.div>
            )}
            {tab === "shorts" && (
              <motion.div key="shorts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {allShorts.length > 0 ? <ShortGrid shorts={allShorts} /> : <EmptyState text="No shorts yet" subtitle="Create your first short video!" />}
              </motion.div>
            )}
            {tab === "playlists" && (
              <motion.div key="playlists" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-1">
                {allPlaylists.length > 0 ? allPlaylists.map((pl) => <PlaylistCard key={pl.id} playlist={pl} />) : <EmptyState text="No playlists yet" subtitle="Create a playlist to organize your music!" />}
              </motion.div>
            )}
            {tab === "liked" && (
              <motion.div key="liked" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
                {likedTracks.length > 0 && <div className="space-y-1">{likedTracks.map((item) => <TrackRow key={item.id} track={item} />)}</div>}
                {likedPosts.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{likedPosts.map((item) => <MiniPostCard key={item.id} post={item} />)}</div>}
                {likedShorts.length > 0 && <ShortGrid shorts={likedShorts} />}
                {likedTracks.length === 0 && likedPosts.length === 0 && likedShorts.length === 0 && (
                  <EmptyState text="Liked content" subtitle="Tracks, posts, and shorts you like will appear here." />
                )}
              </motion.div>
            )}
            {tab === "saved" && (
              <motion.div key="saved" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
                {savedTracks.length > 0 && <div className="space-y-1">{savedTracks.map((item) => <TrackRow key={item.id} track={item} />)}</div>}
                {savedPosts.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{savedPosts.map((item) => <MiniPostCard key={item.id} post={item} />)}</div>}
                {savedShorts.length > 0 && <ShortGrid shorts={savedShorts} />}
                {savedTracks.length === 0 && savedPosts.length === 0 && savedShorts.length === 0 && (
                  <EmptyState text="Saved items" subtitle="Content you save will appear here for easy access." />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Modals */}
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`${currentUser.display_name} on Juzzo`}
        url={`https://juzzo.app/profile/${currentUser.id}`}
      />
      <CreateMenu isOpen={createMenuOpen} onClose={() => setCreateMenuOpen(false)} />
      <FeatureModal open={activePanel === "analytics"} onClose={() => setActivePanel(null)} title="Creator Analytics" subtitle="Working demo stats for your profile and recent uploads.">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Profile visits", value: "18.4K", detail: "+12% this week" },
            { label: "Track plays", value: "94.1K", detail: "+8 new saves today" },
            { label: "Short views", value: "67K", detail: "Midnight Dreams unplugged is trending" },
            { label: "Share taps", value: "1.2K", detail: "Profile link copied 84 times" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/25">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-xs text-emerald-300/70">{card.detail}</p>
            </div>
          ))}
        </div>
      </FeatureModal>
      <FeatureModal open={activePanel === "creator-tools"} onClose={() => setActivePanel(null)} title="Creator Tools" subtitle="Demo shortcuts for publishing and organizing your content.">
        <div className="grid gap-3">
          <button onClick={() => { setActivePanel(null); setCreateMenuOpen(true); }} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-left hover:bg-white/[0.06] transition">
            <p className="text-sm font-semibold text-white">Open Create Menu</p>
            <p className="mt-1 text-xs text-white/35">Publish a note, post, short, track, or playlist with mock state.</p>
          </button>
          <button onClick={() => { setActivePanel(null); setTab("tracks"); }} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-left hover:bg-white/[0.06] transition">
            <p className="text-sm font-semibold text-white">Review My Tracks</p>
            <p className="mt-1 text-xs text-white/35">Jump to the tracks tab and play your latest uploads.</p>
          </button>
          <button onClick={() => { setActivePanel(null); setShareOpen(true); }} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-left hover:bg-white/[0.06] transition">
            <p className="text-sm font-semibold text-white">Share Profile</p>
            <p className="mt-1 text-xs text-white/35">Open the working share sheet for your public profile link.</p>
          </button>
        </div>
      </FeatureModal>
      <FeatureModal open={activePanel === "notifications"} onClose={() => setActivePanel(null)} title="Notifications" subtitle="Mock inbox cards for common creator activity.">
        <div className="space-y-3">
          {[
            "KVNG liked your track Midnight Dreams",
            "Ava Lin shared your profile with collaborators",
            "12 new plays landed from Discover in the last hour",
            "Yuna commented on your latest short",
          ].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl text-lg", index % 2 === 0 ? "bg-pink-500/15" : "bg-cyan-500/15")}>
                {index % 2 === 0 ? "🔔" : "✨"}
              </div>
              <p className="text-sm text-white/75">{item}</p>
            </div>
          ))}
        </div>
      </FeatureModal>
      <FeatureModal open={activePanel === "themes"} onClose={() => setActivePanel(null)} title="Theme Presets" subtitle="Demo-only appearance presets until a backend-backed settings model exists.">
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Neon Pulse", colors: "from-fuchsia-500 to-cyan-400" },
            { name: "Sunset Tape", colors: "from-orange-500 to-rose-500" },
            { name: "Ocean Glass", colors: "from-cyan-500 to-blue-500" },
            { name: "Midnight Bloom", colors: "from-violet-500 to-pink-500" },
          ].map((theme) => (
            <button key={theme.name} onClick={() => showToast(`${theme.name} preview applied`)} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-left hover:bg-white/[0.06] transition">
              <div className={cn("h-20 rounded-xl bg-gradient-to-br", theme.colors)} />
              <p className="mt-3 text-sm font-semibold text-white">{theme.name}</p>
            </button>
          ))}
        </div>
      </FeatureModal>
    </div>
  );
}
