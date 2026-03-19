// ============================================
// Juzzo — Shared TypeScript Interfaces
// ============================================

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  pronouns: string | null;
  website: string | null;
  location: string | null;
  genres: string[];
  accent_color: string | null;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  track_count: number;
  post_count: number;
  short_count: number;
  created_at: string;
}

export interface Track {
  id: string;
  user_id: string;
  title: string;
  artist_name: string;
  audio_url: string;
  cover_url: string;
  duration: number;
  genre: string;
  play_count: number;
  created_at: string;
  profile?: Profile;
}

export interface Post {
  id: string;
  user_id: string;
  type: "text" | "image" | "carousel";
  body: string;
  images: string[];
  track_id: string | null;
  like_count: number;
  comment_count: number;
  repost_count: number;
  created_at: string;
  profile?: Profile;
  track?: Track | null;
}

export interface Short {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url: string;
  caption: string;
  track_id: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  profile?: Profile;
  track?: Track | null;
}

export interface Video {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url: string;
  title: string;
  description: string;
  duration: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  profile?: Profile;
}

export interface StorySnap {
  id: string;
  user_id: string;
  media_url: string;
  thumbnail_url: string;
  caption: string;
  type: "story" | "snap";
  expires_at: string;
  created_at: string;
  profile?: Profile;
}

/** Lightweight text update — chirps / notes / thoughts */
export interface TextNote {
  id: string;
  user_id: string;
  body: string;
  like_count: number;
  comment_count: number;
  repost_count: number;
  created_at: string;
  profile?: Profile;
  track?: Track | null;
}

// Union type for combined feed
export type FeedItem =
  | { type: "post"; data: Post; id: string }
  | { type: "short"; data: Short; id: string }
  | { type: "video"; data: Video; id: string }
  | { type: "track"; data: Track; id: string }
  | { type: "note"; data: TextNote; id: string };

export interface Like {
  id: string;
  user_id: string;
  target_type: "track" | "short" | "post" | "video" | "note";
  target_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  target_type: "track" | "short" | "post" | "video" | "note";
  target_id: string;
  body: string;
  created_at: string;
  profile?: Profile;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Repost {
  id: string;
  user_id: string;
  target_type: "track" | "short" | "post" | "video" | "note";
  target_id: string;
  created_at: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean;
  created_at: string;
  track_count?: number;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  added_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: "like" | "comment" | "follow" | "repost" | "mention";
  target_type: "track" | "short" | "post" | "video" | "comment" | null;
  target_id: string | null;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
}

export interface RuffyMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface RuffySession {
  id: string;
  user_id: string;
  title: string;
  messages: RuffyMessage[];
  created_at: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  queue: Track[];
}

// ============================================
// Chirp — Messaging Types
// ============================================

export type ChirpMessageType =
  | "text"
  | "image"
  | "video"
  | "voice"
  | "snap"
  | "shared-track"
  | "shared-post"
  | "shared-short"
  | "shared-profile"
  | "system";

export interface ChirpReaction {
  emoji: string;
  userId: string;
}

export interface ChirpMessage {
  id: string;
  conversationId: string;
  senderId: string;
  type: ChirpMessageType;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  voiceDuration?: number; // seconds
  /** For snap / disappearing messages */
  isEphemeral?: boolean;
  expiresAfter?: number; // seconds to view
  viewed?: boolean;
  /** Shared Juzzo content */
  sharedTrack?: Track;
  sharedPost?: Post;
  sharedShort?: Short;
  sharedProfile?: Profile;
  /** Reactions */
  reactions: ChirpReaction[];
  /** Read/delivery state */
  status: "sending" | "sent" | "delivered" | "read";
  createdAt: string;
}

export interface ChirpConversation {
  id: string;
  participants: Profile[];
  lastMessage?: ChirpMessage;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  updatedAt: string;
  createdAt: string;
}

// Globe-specific types
export interface GlobeNodeData {
  track: Track;
  position: [number, number, number];
  size: number;
  genreColor: string;
}

/** Integration tile for Me page */
export interface Integration {
  id: string;
  icon: string;
  label: string;
  description: string;
  href: string;
  gradient: string;
  connected: boolean;
}
