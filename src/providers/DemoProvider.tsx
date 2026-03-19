"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Playlist, Post, Profile, Short, StorySnap, TextNote, Track, Video } from "@/types";
import { DEMO_PROFILES, DEMO_TRACKS } from "@/lib/demo-data";

/* ─── The "logged-in" demo user — first profile ─── */
const DEMO_USER: Profile = {
  ...DEMO_PROFILES[0],
  display_name: "Luna Ray",
  username: "lunaray",
  avatar_url: "https://i.pravatar.cc/150?u=lunaray",
  banner_url: null,
  bio: "Dreamy pop vocalist ✨ New album dropping soon",
  pronouns: "she/her",
  website: "juzzo.app/luna",
  location: "Los Angeles, CA",
  genres: ["Dream Pop", "Alt R&B", "Lo-Fi", "Afrobeats"],
  accent_color: null,
  is_verified: true,
  follower_count: 12400,
  following_count: 320,
  track_count: 8,
  post_count: 45,
  short_count: 12,
};

/* ─── Interaction state ─── */
interface InteractionState {
  likes: Set<string>;       // "type:id"
  saves: Set<string>;       // "type:id"
  follows: Set<string>;     // user ids
  reposts: Set<string>;     // "type:id"
}

interface DemoContextType {
  /** The currently "logged-in" demo user */
  currentUser: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  createdNotes: TextNote[];
  createdPosts: Post[];
  createdShorts: Short[];
  createdVideos: Video[];
  createdTracks: Track[];
  createdPlaylists: Playlist[];
  createdStories: StorySnap[];
  createNote: (body: string) => void;
  createPost: (input: { body: string; images: string[] }) => void;
  createShort: (input: { caption: string; sound?: string }) => void;
  createVideo: (input: { title: string; description: string; thumbnailUrl?: string }) => void;
  createTrack: (input: { title: string; artistName: string; genre?: string; coverUrl?: string }) => void;
  createPlaylist: (input: { title: string; description: string; trackIds: string[]; coverUrl?: string }) => void;
  createStory: (input: { caption: string; mode: "story" | "snap" }) => void;

  /** Interaction helpers */
  isLiked: (type: string, id: string) => boolean;
  toggleLike: (type: string, id: string) => void;
  isSaved: (type: string, id: string) => boolean;
  toggleSave: (type: string, id: string) => void;
  isFollowing: (userId: string) => boolean;
  toggleFollow: (userId: string) => void;
  isReposted: (type: string, id: string) => boolean;
  toggleRepost: (type: string, id: string) => void;
  likedKeys: ReadonlySet<string>;
  savedKeys: ReadonlySet<string>;

  /** Toast system */
  toast: string | null;
  showToast: (msg: string) => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile>(DEMO_USER);
  const [createdNotes, setCreatedNotes] = useState<TextNote[]>([]);
  const [createdPosts, setCreatedPosts] = useState<Post[]>([]);
  const [createdShorts, setCreatedShorts] = useState<Short[]>([]);
  const [createdVideos, setCreatedVideos] = useState<Video[]>([]);
  const [createdTracks, setCreatedTracks] = useState<Track[]>([]);
  const [createdPlaylists, setCreatedPlaylists] = useState<Playlist[]>([]);
  const [createdStories, setCreatedStories] = useState<StorySnap[]>([]);
  const [interactions, setInteractions] = useState<InteractionState>({
    likes: new Set<string>(),
    saves: new Set<string>(),
    follows: new Set<string>(["u2", "u5", "u12", "u13"]), // pre-follow some
    reposts: new Set<string>(),
  });
  const [toast, setToast] = useState<string | null>(null);

  const nextId = useCallback((prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, []);
  const nowIso = () => new Date().toISOString();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setCurrentUser((u) => ({ ...u, ...updates }));
    showToast("Profile updated!");
  }, [showToast]);

  const createNote = useCallback((body: string) => {
    const next: TextNote = {
      id: nextId("note"),
      user_id: currentUser.id,
      body: body.trim(),
      like_count: 0,
      comment_count: 0,
      repost_count: 0,
      created_at: nowIso(),
      profile: currentUser,
    };
    setCreatedNotes((prev) => [next, ...prev]);
    setCurrentUser((user) => ({ ...user, post_count: user.post_count + 1 }));
    showToast("Note posted! ✨");
  }, [currentUser, nextId, showToast]);

  const createPost = useCallback((input: { body: string; images: string[] }) => {
    const next: Post = {
      id: nextId("post"),
      user_id: currentUser.id,
      type: input.images.length > 1 ? "carousel" : input.images.length === 1 ? "image" : "text",
      body: input.body.trim(),
      images: input.images,
      track_id: null,
      like_count: 0,
      comment_count: 0,
      repost_count: 0,
      created_at: nowIso(),
      profile: currentUser,
      track: null,
    };
    setCreatedPosts((prev) => [next, ...prev]);
    setCurrentUser((user) => ({ ...user, post_count: user.post_count + 1 }));
    showToast("Post published! 🎉");
  }, [currentUser, nextId, showToast]);

  const createShort = useCallback((input: { caption: string; sound?: string }) => {
    const linkedTrack = DEMO_TRACKS.find((track) =>
      input.sound ? input.sound.toLowerCase().includes(track.title.toLowerCase()) : false
    );
    const next: Short = {
      id: nextId("short"),
      user_id: currentUser.id,
      video_url: "",
      thumbnail_url: `https://picsum.photos/seed/${Date.now()}/540/960`,
      caption: input.caption.trim() || "New short on Juzzo",
      track_id: linkedTrack?.id ?? null,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      created_at: nowIso(),
      profile: currentUser,
      track: linkedTrack,
    };
    setCreatedShorts((prev) => [next, ...prev]);
    setCurrentUser((user) => ({ ...user, short_count: user.short_count + 1 }));
    showToast("Short published! 🔥");
  }, [currentUser, nextId, showToast]);

  const createTrack = useCallback((input: { title: string; artistName: string; genre?: string; coverUrl?: string }) => {
    const next: Track = {
      id: nextId("track"),
      user_id: currentUser.id,
      title: input.title.trim(),
      artist_name: input.artistName.trim(),
      audio_url: "",
      cover_url: input.coverUrl || `https://picsum.photos/seed/${Date.now() + 1}/400/400`,
      duration: 215,
      genre: input.genre || "Pop",
      play_count: 0,
      created_at: nowIso(),
      profile: currentUser,
    };
    setCreatedTracks((prev) => [next, ...prev]);
    setCurrentUser((user) => ({ ...user, track_count: user.track_count + 1 }));
    showToast("Track published! 🎵");
  }, [currentUser, nextId, showToast]);

  const createVideo = useCallback((input: { title: string; description: string; thumbnailUrl?: string }) => {
    const next: Video = {
      id: nextId("video"),
      user_id: currentUser.id,
      video_url: "",
      thumbnail_url: input.thumbnailUrl || `https://picsum.photos/seed/${Date.now() + 2}/960/540`,
      title: input.title.trim(),
      description: input.description.trim(),
      duration: 754,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      created_at: nowIso(),
      profile: currentUser,
    };
    setCreatedVideos((prev) => [next, ...prev]);
    showToast("Video published! 🎥");
  }, [currentUser, nextId, showToast]);

  const createPlaylist = useCallback((input: { title: string; description: string; trackIds: string[]; coverUrl?: string }) => {
    const next: Playlist = {
      id: nextId("playlist"),
      user_id: currentUser.id,
      title: input.title.trim(),
      description: input.description.trim() || null,
      cover_url: input.coverUrl || null,
      is_public: true,
      created_at: nowIso(),
      track_count: input.trackIds.length,
    };
    setCreatedPlaylists((prev) => [next, ...prev]);
    showToast("Playlist created! 🎶");
  }, [currentUser.id, nextId, showToast]);

  const createStory = useCallback((input: { caption: string; mode: "story" | "snap" }) => {
    const next: StorySnap = {
      id: nextId(input.mode),
      user_id: currentUser.id,
      media_url: "",
      thumbnail_url: `https://picsum.photos/seed/${Date.now() + 3}/480/800`,
      caption: input.caption.trim() || (input.mode === "snap" ? "New snap" : "New story"),
      type: input.mode,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: nowIso(),
      profile: currentUser,
    };
    setCreatedStories((prev) => [next, ...prev]);
    showToast(input.mode === "snap" ? "Snap sent! 👻" : "Story posted! 📸");
  }, [currentUser, nextId, showToast]);

  /* --- toggle helpers --- */
  const toggle = (set: Set<string>, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  };

  const isLiked = useCallback((t: string, id: string) => interactions.likes.has(`${t}:${id}`), [interactions.likes]);
  const toggleLike = useCallback((t: string, id: string) => {
    const key = `${t}:${id}`;
    const wasLiked = interactions.likes.has(key);
    setInteractions((s) => ({ ...s, likes: toggle(s.likes, key) }));
    showToast(wasLiked ? "Removed like" : "Liked! ❤️");
  }, [interactions.likes, showToast]);

  const isSaved = useCallback((t: string, id: string) => interactions.saves.has(`${t}:${id}`), [interactions.saves]);
  const toggleSave = useCallback((t: string, id: string) => {
    const key = `${t}:${id}`;
    const wasSaved = interactions.saves.has(key);
    setInteractions((s) => ({ ...s, saves: toggle(s.saves, key) }));
    showToast(wasSaved ? "Removed from saved" : "Saved! 🔖");
  }, [interactions.saves, showToast]);

  const isFollowing = useCallback((uid: string) => interactions.follows.has(uid), [interactions.follows]);
  const toggleFollow = useCallback((uid: string) => {
    const wasFollowing = interactions.follows.has(uid);
    setInteractions((s) => ({ ...s, follows: toggle(s.follows, uid) }));
    showToast(wasFollowing ? "Unfollowed" : "Following! 🎉");
  }, [interactions.follows, showToast]);

  const isReposted = useCallback((t: string, id: string) => interactions.reposts.has(`${t}:${id}`), [interactions.reposts]);
  const toggleRepost = useCallback((t: string, id: string) => {
    const key = `${t}:${id}`;
    const was = interactions.reposts.has(key);
    setInteractions((s) => ({ ...s, reposts: toggle(s.reposts, key) }));
    showToast(was ? "Removed repost" : "Reposted! 🔁");
  }, [interactions.reposts, showToast]);

  return (
    <DemoContext.Provider
      value={{
        currentUser,
        updateProfile,
        createdNotes,
        createdPosts,
        createdShorts,
        createdVideos,
        createdTracks,
        createdPlaylists,
        createdStories,
        createNote,
        createPost,
        createShort,
        createVideo,
        createTrack,
        createPlaylist,
        createStory,
        isLiked,
        toggleLike,
        isSaved,
        toggleSave,
        isFollowing,
        toggleFollow,
        isReposted,
        toggleRepost,
        likedKeys: interactions.likes,
        savedKeys: interactions.saves,
        toast,
        showToast,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
