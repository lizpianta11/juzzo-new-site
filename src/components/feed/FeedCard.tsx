"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { FeedItem, Post, Short, Video, TextNote, Track } from "@/types";
import { cn } from "@/lib/utils/cn";
import { useDemo } from "@/providers/DemoProvider";
import { usePlayer } from "@/providers/PlayerProvider";
import CommentDrawer from "@/components/ui/CommentDrawer";
import ShareModal from "@/components/ui/ShareModal";

/* ═══════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════ */

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Avatar({ src, name, size = 36, ring = false }: { src: string; name: string; size?: number; ring?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-full overflow-hidden flex-shrink-0 border transition-colors",
        ring ? "border-purple-500/40 hover:border-purple-400" : "border-white/10 hover:border-white/20"
      )}
      style={{ width: size, height: size }}
    >
      <img src={src} alt={name} className="w-full h-full object-cover" />
    </div>
  );
}

function TimeAgo({ date }: { date: string }) {
  const diff = new Date("2026-03-18T12:00:00Z").getTime() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return <span>now</span>;
  if (mins < 60) return <span>{mins}m</span>;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return <span>{hours}h</span>;
  const days = Math.floor(hours / 24);
  if (days < 7) return <span>{days}d</span>;
  return <span>{Math.floor(days / 7)}w</span>;
}

function VerifiedBadge({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} className="text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   Interactive Actions Bar (shared by all cards)
   ═══════════════════════════════════════════════ */

function Actions({
  type,
  id,
  likes,
  comments,
  reposts,
  showRepost = true,
  title,
}: {
  type: string;
  id: string;
  likes: number;
  comments: number;
  reposts?: number;
  showRepost?: boolean;
  title?: string;
}) {
  const { isLiked, toggleLike, isSaved, toggleSave, isReposted, toggleRepost } = useDemo();
  const [commentOpen, setCommentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const liked = isLiked(type, id);
  const saved = isSaved(type, id);
  const reposted = isReposted(type, id);

  return (
    <>
      <div className="flex items-center gap-0.5 sm:gap-1 text-white/40 text-xs">
        {/* Like */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleLike(type, id); }}
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 active:scale-90",
            liked ? "text-pink-400" : "hover:bg-white/[0.06] hover:text-pink-400"
          )}
        >
          <motion.svg
            className="w-[18px] h-[18px]"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </motion.svg>
          <span className="text-[12px] font-medium tabular-nums">{formatCount(likes + (liked ? 1 : 0))}</span>
        </button>

        {/* Comment */}
        <button
          onClick={(e) => { e.stopPropagation(); setCommentOpen(true); }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-cyan-400 transition-all active:scale-90"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.86 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
          <span className="text-[12px] font-medium tabular-nums">{formatCount(comments)}</span>
        </button>

        {/* Repost */}
        {showRepost && reposts !== undefined && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleRepost(type, id); }}
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all active:scale-90",
              reposted ? "text-green-400" : "hover:bg-white/[0.06] hover:text-green-400"
            )}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
            </svg>
            <span className="text-[12px] font-medium tabular-nums">{formatCount((reposts || 0) + (reposted ? 1 : 0))}</span>
          </button>
        )}

        {/* Share */}
        <button
          onClick={(e) => { e.stopPropagation(); setShareOpen(true); }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/[0.06] hover:text-blue-400 transition-all active:scale-90"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-12.814a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0 12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>

        {/* Save — pushed right */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleSave(type, id); }}
          className={cn(
            "ml-auto px-2 py-1.5 rounded-lg transition-all active:scale-90",
            saved ? "text-yellow-400" : "hover:bg-white/[0.06] hover:text-yellow-400"
          )}
        >
          <motion.svg
            className="w-[18px] h-[18px]"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            animate={saved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <path strokeLinecap="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </motion.svg>
        </button>
      </div>

      {/* Modals */}
      <CommentDrawer open={commentOpen} onClose={() => setCommentOpen(false)} targetType={type} targetId={id} initialCount={comments} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title={title} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   CARD: Text Note
   ═══════════════════════════════════════════════ */

function NoteCard({ note }: { note: TextNote }) {
  const router = useRouter();
  const { play } = usePlayer();
  const avatar = note.profile?.avatar_url || "https://i.pravatar.cc/40";
  const name = note.profile?.display_name || "User";
  const username = note.profile?.username || "user";
  const verified = note.profile?.is_verified;

  return (
    <div className="group bg-white/[0.025] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/[0.03]">
      <div className="flex items-start gap-3">
        <button onClick={() => router.push(`/profile/${note.user_id}`)} className="flex-shrink-0 hover:opacity-80 transition-opacity">
          <Avatar src={avatar} name={name} size={40} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => router.push(`/profile/${note.user_id}`)} className="text-sm font-semibold text-white truncate hover:underline decoration-white/30 underline-offset-2">
              {name}
            </button>
            {verified && <VerifiedBadge />}
            <span className="text-[11px] text-white/25">@{username}</span>
            <span className="text-[11px] text-white/15">·</span>
            <span className="text-[11px] text-white/25"><TimeAgo date={note.created_at} /></span>
          </div>
          <p className="text-[15px] text-white/85 leading-relaxed mt-1.5 whitespace-pre-wrap break-words">{note.body}</p>

          {note.track && (
            <button
              onClick={() => play(note.track!)}
              className="w-full flex items-center gap-3 mt-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-purple-500/20 transition-all text-left group/track"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img src={note.track.cover_url || `https://picsum.photos/seed/${parseInt(note.track.id) + 100}/80/80`} alt={note.track.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover/track:bg-black/30 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 text-white opacity-0 group-hover/track:opacity-100 transition-opacity ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{note.track.title}</p>
                <p className="text-[10px] text-white/40 truncate">{note.track.artist_name}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center flex-shrink-0 transition-colors shadow-md shadow-purple-500/20">
                <svg className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </button>
          )}

          <div className="mt-3">
            <Actions type="note" id={note.id} likes={note.like_count} comments={note.comment_count} reposts={note.repost_count} title={note.body.slice(0, 60)} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CARD: Image / Text Post
   ═══════════════════════════════════════════════ */

function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const { play } = usePlayer();
  const { showToast } = useDemo();
  const avatar = post.profile?.avatar_url || "https://i.pravatar.cc/40";
  const name = post.profile?.display_name || "User";
  const username = post.profile?.username || "user";
  const verified = post.profile?.is_verified;
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  return (
    <div className="group bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.045] hover:border-white/[0.1] transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/[0.03]">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/profile/${post.user_id}`)} className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <Avatar src={avatar} name={name} size={40} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <button onClick={() => router.push(`/profile/${post.user_id}`)} className="text-sm font-semibold text-white truncate hover:underline decoration-white/30 underline-offset-2">
                {name}
              </button>
              {verified && <VerifiedBadge />}
            </div>
            <p className="text-[11px] text-white/25">@{username} · <TimeAgo date={post.created_at} /></p>
          </div>
          <button onClick={() => showToast("More options coming soon")} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/20 hover:text-white/50 transition-all active:scale-90">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
          </button>
        </div>

        {post.body && <p className="text-[15px] text-white/80 leading-relaxed whitespace-pre-wrap break-words">{post.body}</p>}
      </div>

      {/* Image grid — responsive */}
      {post.images && post.images.length > 0 && (
        <div className={cn(
          "grid gap-0.5 mx-0",
          post.images.length === 1 ? "grid-cols-1" : "grid-cols-2",
        )}>
          {post.images.slice(0, 4).map((src, i) => (
            <div
              key={i}
              className={cn(
                "relative bg-white/[0.04] overflow-hidden cursor-pointer group/img",
                post.images.length === 1 && "aspect-[16/10]",
                post.images.length > 1 && "aspect-square",
                post.images.length === 3 && i === 0 && "row-span-2 aspect-auto"
              )}
              onClick={() => showToast("Image viewer coming soon!")}
            >
              {!imgLoaded[i] && <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />}
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover group-hover/img:scale-[1.03] transition-transform duration-500"
                onLoad={() => setImgLoaded((s) => ({ ...s, [i]: true }))}
              />
            </div>
          ))}
        </div>
      )}

      <div className="p-4 pt-3 space-y-2.5">
        {post.track && (
          <button
            onClick={() => play(post.track!)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-purple-500/20 transition-all text-left group/track"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
              <img src={post.track.cover_url || `https://picsum.photos/seed/${parseInt(post.track.id) + 100}/80/80`} alt={post.track.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover/track:bg-black/30 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 text-white opacity-0 group-hover/track:opacity-100 transition-opacity ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{post.track.title}</p>
              <p className="text-[10px] text-white/40 truncate">{post.track.artist_name}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center flex-shrink-0 transition-colors shadow-md shadow-purple-500/20">
              <svg className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </button>
        )}
        <Actions type="post" id={post.id} likes={post.like_count} comments={post.comment_count} reposts={post.repost_count} title={post.body?.slice(0, 60)} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CARD: Short (vertical video in feed)
   ═══════════════════════════════════════════════ */

function ShortCard({ short: s }: { short: Short }) {
  const router = useRouter();
  const { isLiked, toggleLike, isSaved, toggleSave, showToast } = useDemo();
  const [commentOpen, setCommentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const avatar = s.profile?.avatar_url || "https://i.pravatar.cc/24";
  const name = s.profile?.display_name || "User";
  const verified = s.profile?.is_verified;
  const liked = isLiked("short", s.id);
  const saved = isSaved("short", s.id);

  return (
    <div className="group bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.1] transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/[0.03]">
      <div className="relative aspect-[9/14] sm:aspect-[9/12] bg-white/[0.04]">
        <img src={s.thumbnail_url || `https://picsum.photos/seed/${s.id}/360/640`} alt={s.caption} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5" />

        {/* Play overlay */}
        <button
          onClick={() => showToast("Video player opening...")}
          className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
        >
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/play:opacity-100 transition-all group-hover/play:scale-100 scale-75 shadow-2xl">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </button>

        {/* Right-side actions */}
        <div className="absolute right-2.5 bottom-20 flex flex-col items-center gap-3.5">
          <button onClick={(e) => { e.stopPropagation(); toggleLike("short", s.id); }} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
            <motion.div
              className={cn("w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors", liked ? "bg-pink-500/30" : "bg-white/10 hover:bg-white/15")}
              animate={liked ? { scale: [1, 1.2, 1] } : {}}
            >
              <svg className={cn("w-5 h-5", liked ? "text-pink-400" : "text-white")} fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            </motion.div>
            <span className={cn("text-[10px] font-semibold tabular-nums", liked ? "text-pink-400" : "text-white/90")}>{formatCount(s.like_count + (liked ? 1 : 0))}</span>
          </button>

          <button onClick={(e) => { e.stopPropagation(); setCommentOpen(true); }} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
            <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.86 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
            </div>
            <span className="text-[10px] text-white/90 font-semibold tabular-nums">{formatCount(s.comment_count)}</span>
          </button>

          <button onClick={(e) => { e.stopPropagation(); setShareOpen(true); }} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
            <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-12.814a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0 12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
            </div>
            <span className="text-[10px] text-white/90 font-semibold">Share</span>
          </button>

          <button onClick={(e) => { e.stopPropagation(); toggleSave("short", s.id); }} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
            <motion.div
              className={cn("w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors", saved ? "bg-yellow-500/30" : "bg-white/10 hover:bg-white/15")}
              animate={saved ? { scale: [1, 1.2, 1] } : {}}
            >
              <svg className={cn("w-5 h-5", saved ? "text-yellow-400" : "text-white")} fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </motion.div>
            <span className={cn("text-[10px] font-semibold", saved ? "text-yellow-400" : "text-white/90")}>Save</span>
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-14 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <button onClick={() => router.push(`/profile/${s.user_id}`)} className="hover:opacity-80 transition-opacity">
              <Avatar src={avatar} name={name} size={28} />
            </button>
            <button onClick={() => router.push(`/profile/${s.user_id}`)} className="text-xs font-semibold text-white truncate hover:underline decoration-white/30 underline-offset-2">
              {name}
            </button>
            {verified && <VerifiedBadge size={12} />}
          </div>
          <p className="text-[13px] sm:text-sm text-white font-medium line-clamp-2 leading-snug">{s.caption}</p>
          {s.track && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
              <span className="text-[10px] text-white/50 truncate">{s.track.title} — {s.track.artist_name}</span>
            </div>
          )}
          <p className="text-[10px] text-white/30 mt-1">{formatCount(s.view_count)} views</p>
        </div>
      </div>

      <CommentDrawer open={commentOpen} onClose={() => setCommentOpen(false)} targetType="short" targetId={s.id} initialCount={s.comment_count} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title={s.caption} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CARD: Long Video — YouTube-style premium card
   ═══════════════════════════════════════════════ */

function LongVideoCard({ video }: { video: Video }) {
  const router = useRouter();
  const { showToast } = useDemo();
  const avatar = video.profile?.avatar_url || "https://i.pravatar.cc/36";
  const name = video.profile?.display_name || "Creator";
  const verified = video.profile?.is_verified;

  return (
    <div className="group bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/[0.04] hover:-translate-y-0.5">
      {/* Wide landscape thumbnail */}
      <button
        onClick={() => showToast("Opening video player...")}
        className="relative aspect-video w-full bg-white/[0.04] cursor-pointer overflow-hidden block"
      >
        <img
          src={video.thumbnail_url || `https://picsum.photos/seed/${video.id}/640/360`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

        {/* Duration badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] text-white font-semibold tracking-wide tabular-nums border border-white/[0.08]">
          {formatDuration(video.duration)}
        </div>

        {/* LIVE-style badge for long content */}
        {video.duration > 3600 && (
          <div className="absolute top-2.5 left-2.5 bg-purple-600/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] text-white font-bold uppercase tracking-wider">
            Long Form
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-75 shadow-2xl border border-white/10">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>

        {/* Progress bar hint (for visual richness) — deterministic per video */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/[0.08]">
          <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-r-full" style={{ width: `${(video.id.charCodeAt(video.id.length - 1) % 60) + 15}%` }} />
        </div>
      </button>

      {/* Video metadata */}
      <div className="p-3.5 sm:p-4 space-y-3">
        <div className="flex items-start gap-3">
          <button onClick={() => router.push(`/profile/${video.user_id}`)} className="flex-shrink-0 hover:opacity-80 transition-opacity mt-0.5">
            <Avatar src={avatar} name={name} size={38} ring />
          </button>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => showToast("Opening video player...")}
              className="text-sm sm:text-[15px] font-semibold text-white line-clamp-2 leading-snug text-left hover:text-white/90 transition-colors"
            >
              {video.title}
            </button>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <button onClick={() => router.push(`/profile/${video.user_id}`)} className="text-[12px] text-white/40 hover:text-white/60 transition-colors hover:underline decoration-white/20 underline-offset-2">
                {name}
              </button>
              {verified && <VerifiedBadge size={12} />}
              <span className="text-[11px] text-white/20">·</span>
              <span className="text-[12px] text-white/30 tabular-nums">{formatCount(video.view_count)} views</span>
              <span className="text-[11px] text-white/20">·</span>
              <span className="text-[12px] text-white/30"><TimeAgo date={video.created_at} /></span>
            </div>
            {video.description && (
              <p className="text-[12px] text-white/30 mt-1.5 line-clamp-2 leading-relaxed">{video.description}</p>
            )}
          </div>
        </div>
        <Actions type="video" id={video.id} likes={video.like_count} comments={video.comment_count} title={video.title} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CARD: Music / Track card in feed
   ═══════════════════════════════════════════════ */

export function MusicCard({ track }: { track: Track }) {
  const router = useRouter();
  const { play } = usePlayer();
  const cover = track.cover_url || `https://picsum.photos/seed/${parseInt(track.id) + 100}/400/400`;
  const avatar = track.profile?.avatar_url || "https://i.pravatar.cc/36";
  const name = track.profile?.display_name || track.artist_name;
  const verified = track.profile?.is_verified;

  return (
    <div className="group bg-white/[0.025] border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/[0.03]">
      {/* Album cover — responsive aspect */}
      <button
        onClick={() => play(track)}
        className="relative w-full aspect-square sm:aspect-[16/9] bg-white/[0.04] cursor-pointer overflow-hidden block"
      >
        <img src={cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-75 shadow-2xl shadow-purple-500/30">
            <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>

        {/* Duration / genre badge */}
        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] text-white/80 font-semibold uppercase tracking-wide">
          {track.genre}
        </div>
        <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] text-white font-semibold tabular-nums">
          {formatDuration(track.duration)}
        </div>
      </button>

      <div className="p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/profile/${track.user_id}`)} className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <Avatar src={avatar} name={name} size={38} ring />
          </button>
          <div className="flex-1 min-w-0">
            <button onClick={() => play(track)} className="text-sm font-semibold text-white truncate block w-full text-left hover:text-purple-300 transition-colors">
              {track.title}
            </button>
            <div className="flex items-center gap-1.5 mt-0.5">
              <button onClick={() => router.push(`/profile/${track.user_id}`)} className="text-[12px] text-white/40 hover:text-white/60 transition-colors hover:underline decoration-white/20 underline-offset-2 truncate">
                {name}
              </button>
              {verified && <VerifiedBadge size={12} />}
              <span className="text-[11px] text-white/20">·</span>
              <span className="text-[12px] text-white/30 tabular-nums">{formatCount(track.play_count)} plays</span>
            </div>
          </div>
          <button
            onClick={() => play(track)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0 hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-purple-500/20"
          >
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </button>
        </div>
        <Actions type="track" id={track.id} likes={track.play_count} comments={0} showRepost={false} title={track.title} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Shorts Row — horizontal scroll
   ═══════════════════════════════════════════════ */

export function ShortsRow({ shorts }: { shorts: Short[] }) {
  const { showToast } = useDemo();
  if (!shorts.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
          Shorts
        </h3>
        <Link href="/feed" className="text-xs text-purple-400 hover:text-purple-300 transition font-medium">See all →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
        {shorts.map((s) => {
          const avatar = s.profile?.avatar_url || `https://i.pravatar.cc/24?u=${s.id}`;
          const name = s.profile?.display_name || "User";
          return (
            <button
              key={s.id}
              onClick={() => showToast("Opening short...")}
              className="flex-shrink-0 w-[120px] sm:w-[130px] group cursor-pointer text-left snap-start"
            >
              <div className="relative aspect-[9/14] rounded-2xl overflow-hidden bg-white/[0.04]">
                <img src={s.thumbnail_url || `https://picsum.photos/seed/${s.id}/280/500`} alt={s.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-1 mb-0.5">
                    <div className="w-4 h-4 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                      <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[9px] font-medium text-white/80 truncate">{name}</span>
                  </div>
                  <p className="text-[10px] font-medium text-white line-clamp-2 leading-tight">{s.caption}</p>
                  <p className="text-[8px] text-white/40 mt-0.5 tabular-nums">{formatCount(s.view_count)} views</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Long Videos Row — horizontal scroll
   ═══════════════════════════════════════════════ */

export function LongVideosRow({ videos }: { videos: Video[] }) {
  const { showToast } = useDemo();
  if (!videos.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v12H4V4zm0 14h16v2H4v-2z" /></svg>
          </div>
          Long Videos
        </h3>
        <button onClick={() => showToast("All videos coming soon")} className="text-xs text-purple-400 hover:text-purple-300 transition font-medium">See all →</button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
        {videos.map((v) => {
          const name = v.profile?.display_name || "Creator";
          const verified = v.profile?.is_verified;
          return (
            <button
              key={v.id}
              onClick={() => showToast("Opening video player...")}
              className="flex-shrink-0 w-[260px] sm:w-[300px] group cursor-pointer text-left snap-start"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/[0.04]">
                <img
                  src={v.thumbnail_url || `https://picsum.photos/seed/${v.id}/640/360`}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-white font-semibold tabular-nums">
                  {formatDuration(v.duration)}
                </div>
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
              <div className="mt-2 pr-1">
                <p className="text-xs font-semibold text-white line-clamp-2 leading-snug group-hover:text-white/90">{v.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-white/35">{name}</span>
                  {verified && <VerifiedBadge size={10} />}
                  <span className="text-[10px] text-white/20">·</span>
                  <span className="text-[10px] text-white/30 tabular-nums">{formatCount(v.view_count)} views</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main FeedCard Dispatcher
   ═══════════════════════════════════════════════ */

export default function FeedCard({ item, index }: { item: FeedItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.35, ease: "easeOut" }}
      layout
    >
      {item.type === "note" && <NoteCard note={item.data} />}
      {item.type === "post" && <PostCard post={item.data} />}
      {item.type === "short" && <ShortCard short={item.data} />}
      {item.type === "video" && <LongVideoCard video={item.data} />}
      {item.type === "track" && <MusicCard track={item.data} />}
    </motion.div>
  );
}
