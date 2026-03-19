"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { Profile, Track, Post, Short } from "@/types";
import { useDemo } from "@/providers/DemoProvider";
import { usePlayer } from "@/providers/PlayerProvider";
import ShareModal from "@/components/ui/ShareModal";

/* ─── Tabs ─── */
const TABS = [
  { key: "tracks", label: "Tracks", icon: "🎵" },
  { key: "posts", label: "Posts", icon: "📝" },
  { key: "shorts", label: "Shorts", icon: "🎬" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-white">{formatCount(value)}</span>
      <span className="text-[11px] text-white/35 font-medium">{label}</span>
    </div>
  );
}

/* ─── Track row ─── */
function TrackRow({ track }: { track: Track }) {
  const { play } = usePlayer();
  const coverUrl = track.cover_url || `https://picsum.photos/seed/${parseInt(track.id) + 100}/80/80`;
  return (
    <button
      onClick={() => play(track)}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition group text-left"
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md shadow-black/30">
        <img src={coverUrl} alt={track.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{track.title}</p>
        <p className="text-[11px] text-white/35">{track.genre} · {formatCount(track.play_count)} plays</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
      </div>
    </button>
  );
}

/* ─── Mini post card ─── */
function MiniPostCard({ post }: { post: Post }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors cursor-pointer">
      {post.images && post.images.length > 0 && (
        <div className="aspect-video rounded-lg overflow-hidden mb-2">
          <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <p className="text-sm text-white/70 line-clamp-3">{post.body}</p>
      <div className="flex items-center gap-3 mt-2 text-[11px] text-white/25">
        <span className="flex items-center gap-1">♥ {formatCount(post.like_count)}</span>
        <span className="flex items-center gap-1">💬 {formatCount(post.comment_count)}</span>
      </div>
    </div>
  );
}

/* ─── Short thumbnail grid ─── */
function ShortGrid({ shorts }: { shorts: Short[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {shorts.map((s) => (
        <div key={s.id} className="relative aspect-[9/14] rounded-xl overflow-hidden bg-white/[0.06] cursor-pointer group">
          <img src={s.thumbnail_url || `https://picsum.photos/seed/${s.id}/270/480`} alt={s.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-1.5 left-1.5 right-1.5">
            <p className="text-[10px] font-medium text-white line-clamp-1">{s.caption}</p>
            <p className="text-[9px] text-white/45">{formatCount(s.view_count || 0)} views</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Empty state ─── */
function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-white/25">
      <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
          <path strokeLinecap="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859" />
        </svg>
      </div>
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}

/* ─── Main ProfileView ─── */
export default function ProfileView({
  profile,
  tracks,
  posts,
  shorts,
}: {
  profile: Profile;
  tracks: Track[];
  posts: Post[];
  shorts: Short[];
}) {
  const { isFollowing, toggleFollow, showToast } = useDemo();
  const [tab, setTab] = useState<TabKey>("tracks");
  const [shareOpen, setShareOpen] = useState(false);
  const following = isFollowing(profile.id);

  return (
    <div className="min-h-screen bg-[#050510]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#050510]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/home" className="p-2 -ml-2 hover:bg-white/5 rounded-full transition">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-base font-semibold text-white">@{profile.username}</h1>
          <button onClick={() => showToast("More options coming soon!")} className="p-2 -mr-2 hover:bg-white/5 rounded-full transition">
            <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
          </button>
        </div>
      </header>

      {/* Profile hero */}
      <div className="relative">
        {/* Banner */}
        <div className="h-32 relative overflow-hidden">
          {profile.banner_url ? (
            <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 via-[#0c0c1a] to-cyan-900/40" />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center -mt-14 pb-4 px-4">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 p-[3px] shadow-xl shadow-purple-500/20">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#050510]">
              <img
                src={profile.avatar_url || `https://i.pravatar.cc/112?u=${profile.id}`}
                alt={profile.display_name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-1.5 mt-3">
            {profile.display_name}
            {profile.is_verified && (
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
              </svg>
            )}
          </h2>
          <p className="text-sm text-white/35 font-medium">@{profile.username}</p>
          {profile.pronouns && <p className="text-xs text-white/30 mt-0.5">{profile.pronouns}</p>}
          {profile.bio && <p className="text-sm text-white/55 mt-2 text-center max-w-xs leading-relaxed">{profile.bio}</p>}

          {/* Location & Website */}
          {(profile.location || profile.website) && (
            <div className="flex items-center gap-4 mt-2 text-xs text-white/35">
              {profile.location && (
                <span className="flex items-center gap-1">📍 {profile.location}</span>
              )}
              {profile.website && (
                <span className="flex items-center gap-1 text-cyan-300/50">🔗 {profile.website}</span>
              )}
            </div>
          )}

          {/* Genre tags */}
          {profile.genres && profile.genres.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-sm">
              {profile.genres.map((g) => (
                <span key={g} className="px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/10 text-[10px] font-medium text-cyan-200/60">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-8 mt-5">
            <StatPill label="Followers" value={profile.follower_count || 0} />
            <div className="w-px h-8 bg-white/[0.06]" />
            <StatPill label="Following" value={profile.following_count || 0} />
            <div className="w-px h-8 bg-white/[0.06]" />
            <StatPill label="Tracks" value={profile.track_count || 0} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => toggleFollow(profile.id)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-semibold transition shadow-lg active:scale-95",
                following
                  ? "bg-white/[0.06] border border-white/[0.08] text-white/60 hover:bg-white/10 shadow-none"
                  : "bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 shadow-purple-500/20"
              )}
            >
              {following ? "Following" : "Follow"}
            </button>
            <button
              onClick={() => setShareOpen(true)}
              className="px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white/80 transition active:scale-95"
            >
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Content tabs */}
      <div className="sticky top-14 z-20 bg-[#050510]/80 backdrop-blur-2xl border-b border-white/[0.06] mt-4">
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 py-3.5 text-xs font-semibold transition-colors relative whitespace-nowrap flex items-center justify-center gap-1.5",
                tab === t.key ? "text-white" : "text-white/35 hover:text-white/55"
              )}
            >
              <span>{t.icon}</span>
              {t.label}
              {tab === t.key && (
                <motion.div
                  layoutId="profileTabIndicator"
                  className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 py-4 pb-36">
        <AnimatePresence mode="wait">
          {tab === "tracks" && (
            <motion.div key="tracks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1">
              {tracks.length > 0 ? tracks.map((t) => <TrackRow key={t.id} track={t} />) : <EmptyState text="No tracks yet" />}
            </motion.div>
          )}
          {tab === "posts" && (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {posts.length > 0 ? posts.map((p) => <MiniPostCard key={p.id} post={p} />) : <EmptyState text="No posts yet" />}
            </motion.div>
          )}
          {tab === "shorts" && (
            <motion.div key="shorts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {shorts.length > 0 ? <ShortGrid shorts={shorts} /> : <EmptyState text="No shorts yet" />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share modal */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`${profile.display_name} on Juzzo`}
        url={`https://juzzo.app/profile/${profile.id}`}
      />
    </div>
  );
}
