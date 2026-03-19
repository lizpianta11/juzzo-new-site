"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { FeedItem, Short, Profile, Track, Video } from "@/types";
import FeedCard, { ShortsRow, LongVideosRow, MusicCard } from "@/components/feed/FeedCard";
import ComposeModal from "@/components/ui/ComposeModal";
import { useDemo } from "@/providers/DemoProvider";
import { usePlayer } from "@/providers/PlayerProvider";

/* ─── Filter tabs matching the app ─── */
const FILTER_TABS = [
  { key: "foryou", label: "For You", icon: "✨" },
  { key: "notes", label: "Notes", icon: "💬" },
  { key: "posts", label: "Posts", icon: "📝" },
  { key: "shorts", label: "Shorts", icon: "🎬" },
  { key: "videos", label: "Videos", icon: "📺" },
  { key: "music", label: "Music", icon: "🎵" },
] as const;

type FilterKey = (typeof FILTER_TABS)[number]["key"];

/* ─── Story Bubbles (app-style) ─── */
function StoryBubbles({ profiles, hasMyStory }: { profiles: Profile[]; hasMyStory: boolean }) {
  const { currentUser, showToast } = useDemo();
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
      {/* Your story first */}
      <button
        onClick={() => showToast(hasMyStory ? "Opening your latest story 📸" : "Create a story from the + menu")}
        className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[68px]"
      >
        <div className={cn("w-[60px] h-[60px] rounded-full flex items-center justify-center bg-white/[0.03] relative overflow-hidden", hasMyStory ? "border-2 border-pink-400/60" : "border-2 border-dashed border-white/15")}>
          <img src={currentUser.avatar_url || "https://i.pravatar.cc/60"} alt="You" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            {hasMyStory ? (
              <span className="rounded-full bg-black/45 px-2 py-1 text-[10px] font-semibold text-white">Live</span>
            ) : (
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            )}
          </div>
        </div>
        <span className="text-[10px] text-white/35 font-medium">{hasMyStory ? "Your story" : "Add story"}</span>
      </button>
      {profiles.slice(0, 10).map((p) => (
        <Link key={p.id} href={`/profile/${p.id}`} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[68px] group">
          <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 p-[2.5px]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#050510]">
              <img
                src={p.avatar_url || `https://i.pravatar.cc/60?u=${p.id}`}
                alt={p.display_name || ""}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          </div>
          <span className="text-[10px] text-white/50 font-medium truncate w-full text-center">{p.display_name?.split(" ")[0]}</span>
        </Link>
      ))}
    </div>
  );
}

/* ─── Trending tracks ribbon ─── */
function TrendingRibbon({ tracks }: { tracks: Track[] }) {
  const { play } = usePlayer();
  const top = tracks.slice(0, 6);
  if (!top.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" /></svg>
          </div>
          Trending Now
        </h3>
        <Link href="/discover" className="text-xs text-purple-400 hover:text-purple-300 transition font-medium">See all →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {top.map((t) => {
          const cover = t.cover_url || `https://picsum.photos/seed/${parseInt(t.id) + 100}/200/200`;
          return (
            <button key={t.id} onClick={() => play(t)} className="flex-shrink-0 w-[120px] group text-left">
              <div className="w-[120px] h-[120px] rounded-2xl overflow-hidden mb-2 relative">
                <img src={cover} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-white truncate">{t.title}</p>
              <p className="text-[10px] text-white/40 truncate">{t.artist_name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Compose prompt — opens compose modal ─── */
function ComposePrompt({ onOpen }: { onOpen: () => void }) {
  const { currentUser } = useDemo();
  return (
    <div className="mx-4 mb-2">
      <button
        onClick={onOpen}
        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
          <img src={currentUser.avatar_url || "https://i.pravatar.cc/36"} alt="You" className="w-full h-full object-cover" />
        </div>
        <span className="text-sm text-white/25 flex-1">What&apos;s on your mind?</span>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5" /></svg>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
        </div>
      </button>
    </div>
  );
}

/* ─── Otoro AI button for Home screen ─── */
function OtoroButton() {
  const router = useRouter();
  return (
    <div className="mx-4 mb-3">
      <button
        onClick={() => router.push("/ruffy")}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-900/30 via-[#0c0c1a] to-cyan-900/20 border border-purple-500/15 hover:border-purple-500/30 transition-all group relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-[40px]" />
        <div className="absolute bottom-0 left-8 w-16 h-16 bg-cyan-500/8 rounded-full blur-[30px]" />

        <div className="relative flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-lg shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
            🐾
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">Otoro AI</p>
              <span className="flex items-center gap-1 text-[9px] text-green-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[11px] text-white/35">Get music recs, write captions, discover trends...</p>
          </div>
        </div>

        <svg className="w-4 h-4 text-white/20 group-hover:text-white/40 transition relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}

/* ─── Inline Music Grid (for Music filter) ─── */
function MusicGrid({ tracks }: { tracks: Track[] }) {
  return (
    <div className="space-y-4">
      {tracks.map((track, i) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.35, ease: "easeOut" }}
        >
          <MusicCard track={track} />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Empty state for filtered views ─── */
function EmptyState({ filter }: { filter: { icon: string; label: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-white/25"
    >
      <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mb-4 text-2xl">
        {filter.icon}
      </div>
      <p className="text-sm font-medium">No {filter.label.toLowerCase()} yet</p>
      <p className="text-xs text-white/15 mt-1">Content will appear here as it&apos;s shared</p>
    </motion.div>
  );
}

/* ─── Main Home Page ─── */
export default function HomePage({
  feed,
  shorts,
  profiles,
  tracks,
  videos,
}: {
  feed: FeedItem[];
  shorts: Short[];
  profiles: Profile[];
  tracks?: Track[];
  videos?: Video[];
}) {
  const { currentUser, createdNotes, createdPosts, createdShorts, createdTracks, createdVideos, createdStories } = useDemo();
  const [filter, setFilter] = useState<FilterKey>("foryou");
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mergedFeed = useMemo(() => {
    const demoFeed: FeedItem[] = [
      ...createdPosts.map((post) => ({ type: "post" as const, data: post, id: post.id })),
      ...createdShorts.map((short) => ({ type: "short" as const, data: short, id: short.id })),
      ...createdNotes.map((note) => ({ type: "note" as const, data: note, id: note.id })),
      ...createdTracks.map((track) => ({ type: "track" as const, data: track, id: `t-${track.id}` })),
      ...createdVideos.map((video) => ({ type: "video" as const, data: video, id: video.id })),
    ];
    return [...demoFeed, ...feed].sort((a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime());
  }, [createdNotes, createdPosts, createdShorts, createdTracks, createdVideos, feed]);

  const mergedShorts = useMemo(() => [...createdShorts, ...shorts], [createdShorts, shorts]);
  const mergedTracks = useMemo(() => [...createdTracks, ...(tracks || [])], [createdTracks, tracks]);

  const filtered = useMemo(() => {
    if (filter === "foryou") return mergedFeed;
    if (filter === "notes") return mergedFeed.filter((i) => i.type === "note");
    if (filter === "posts") return mergedFeed.filter((i) => i.type === "post");
    if (filter === "shorts") return mergedFeed.filter((i) => i.type === "short");
    if (filter === "videos") return mergedFeed.filter((i) => i.type === "video");
    if (filter === "music") return mergedFeed.filter((i) => i.type === "track");
    return mergedFeed;
  }, [mergedFeed, filter]);

  const trendingTracks = useMemo(() => {
    return [...mergedTracks].sort((a, b) => b.play_count - a.play_count).slice(0, 6);
  }, [mergedTracks]);

  const longVideos = useMemo(() => {
    return [...createdVideos, ...(videos || [])];
  }, [createdVideos, videos]);

  const activeFilter = FILTER_TABS.find((t) => t.key === filter)!;
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return { profiles: profiles.slice(0, 4), tracks: mergedTracks.slice(0, 4) };
    return {
      profiles: profiles.filter((profile) =>
        `${profile.display_name} ${profile.username}`.toLowerCase().includes(query)
      ).slice(0, 4),
      tracks: mergedTracks.filter((track) =>
        `${track.title} ${track.artist_name} ${track.genre}`.toLowerCase().includes(query)
      ).slice(0, 4),
    };
  }, [mergedTracks, profiles, searchQuery]);

  return (
    <div className="min-h-screen bg-[#050510]">
      {/* Header — matches app */}
      <header className="sticky top-0 z-30 bg-[#050510]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="flex items-center justify-between px-4 pt-[env(safe-area-inset-top)] h-14">
          <h1 className="text-xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Juzzo</span>
          </h1>
          <div className="flex items-center gap-1">
            {/* Search */}
            <button onClick={() => setSearchOpen(true)} className="relative p-2 hover:bg-white/5 rounded-full transition">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
            {/* Notifications */}
            <Link href="/settings" className="relative p-2 hover:bg-white/5 rounded-full transition">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
                <path strokeLinecap="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
            </Link>
            {/* Messages — Chirp */}
            <Link href="/chirp" className="relative p-2 hover:bg-white/5 rounded-full transition">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.6">
                <path strokeLinecap="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
            </Link>
            {/* User avatar */}
            <Link href="/me" className="ml-1">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/10 hover:border-purple-500/50 transition">
                <img src={currentUser.avatar_url || "https://i.pravatar.cc/32"} alt="You" className="w-full h-full object-cover" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Stories row — matches app */}
      <StoryBubbles profiles={profiles} hasMyStory={createdStories.length > 0} />

      {/* Filter tabs — matches app category pills */}
      <div className="sticky top-14 z-20 bg-[#050510]/80 backdrop-blur-2xl">
        <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 relative",
                filter === tab.key
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "bg-white/[0.06] text-white/45 hover:bg-white/10 hover:text-white/70 border border-white/[0.04]"
              )}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Combined Feed Content */}
      <div className="py-3 space-y-4">
        {/* ── For You tab ── */}
        {filter === "foryou" && (
          <>
            <OtoroButton />
            <ComposePrompt onOpen={() => setComposeOpen(true)} />
            {trendingTracks.length > 0 && <TrendingRibbon tracks={trendingTracks} />}
            <div className="px-4"><ShortsRow shorts={mergedShorts} /></div>
            {longVideos.length > 0 && <div className="px-4"><LongVideosRow videos={longVideos} /></div>}
            <div className="px-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <FeedCard key={item.id} item={item} index={i} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* ── Notes tab ── */}
        {filter === "notes" && (
          <div className="px-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <FeedCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <EmptyState filter={activeFilter} />}
          </div>
        )}

        {/* ── Posts tab ── */}
        {filter === "posts" && (
          <div className="px-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <FeedCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <EmptyState filter={activeFilter} />}
          </div>
        )}

        {/* ── Shorts tab ── */}
        {filter === "shorts" && (
          <>
            <div className="px-4"><ShortsRow shorts={mergedShorts} /></div>
            <div className="px-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <FeedCard key={item.id} item={item} index={i} />
                ))}
              </AnimatePresence>
              {filtered.length === 0 && <EmptyState filter={activeFilter} />}
            </div>
          </>
        )}

        {/* ── Videos / Long Videos tab ── */}
        {filter === "videos" && (
          <div className="px-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <FeedCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <EmptyState filter={activeFilter} />}
          </div>
        )}

        {/* ── Music tab ── */}
        {filter === "music" && (
          <>
            {trendingTracks.length > 0 && <TrendingRibbon tracks={trendingTracks} />}
            {mergedTracks.length > 0 && (
              <div className="px-4">
                <MusicGrid tracks={mergedTracks} />
              </div>
            )}
            {mergedTracks.length === 0 && <EmptyState filter={activeFilter} />}
          </>
        )}
      </div>

      {/* Compose modal */}
      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="fixed inset-x-4 top-20 z-50 mx-auto max-w-xl rounded-3xl border border-white/[0.08] bg-[#0c0c1a]/95 p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
                <svg className="w-4 h-4 text-white/35" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artists, tracks, and demo content"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                />
                <button onClick={() => setSearchOpen(false)} className="text-xs font-medium text-white/40 hover:text-white/70 transition">
                  Close
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25">Profiles</p>
                  <div className="space-y-2">
                    {searchResults.profiles.map((profile) => (
                      <Link key={profile.id} href={`/profile/${profile.id}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.06] transition">
                        <img src={profile.avatar_url || `https://i.pravatar.cc/40?u=${profile.id}`} alt={profile.display_name} className="h-10 w-10 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{profile.display_name}</p>
                          <p className="truncate text-xs text-white/35">@{profile.username}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25">Tracks</p>
                  <div className="space-y-2">
                    {searchResults.tracks.map((track) => (
                      <button key={track.id} onClick={() => { setSearchOpen(false); setFilter("music"); }} className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.03] px-3 py-2.5 text-left hover:bg-white/[0.06] transition">
                        <img src={track.cover_url || `https://picsum.photos/seed/${track.id}/80/80`} alt={track.title} className="h-10 w-10 rounded-xl object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{track.title}</p>
                          <p className="truncate text-xs text-white/35">{track.artist_name} · {track.genre}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
