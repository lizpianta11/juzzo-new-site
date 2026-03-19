// Genre list used for globe clustering
export const GENRES = [
  "Pop",
  "Hip-Hop",
  "R&B",
  "Electronic",
  "Rock",
  "Indie",
  "Latin",
  "Jazz",
  "Classical",
  "Country",
  "Afrobeats",
  "K-Pop",
  "Lo-Fi",
  "Alternative",
  "Other",
] as const;

export type Genre = (typeof GENRES)[number];

// Genre → color mapping for globe regions
export const GENRE_COLORS: Record<string, string> = {
  Pop: "#FF6B9D",
  "Hip-Hop": "#C084FC",
  "R&B": "#F59E0B",
  Electronic: "#06B6D4",
  Rock: "#EF4444",
  Indie: "#10B981",
  Latin: "#F97316",
  Jazz: "#8B5CF6",
  Classical: "#6366F1",
  Country: "#D97706",
  Afrobeats: "#14B8A6",
  "K-Pop": "#EC4899",
  "Lo-Fi": "#64748B",
  Alternative: "#84CC16",
  Other: "#9CA3AF",
};

// Accepted upload formats
export const ACCEPTED_AUDIO = [".mp3", ".wav", ".m4a", ".flac"];
export const ACCEPTED_VIDEO = [".mp4", ".mov", ".webm"];
export const ACCEPTED_IMAGE = [".jpg", ".jpeg", ".png", ".webp"];

// Globe config
export const GLOBE_RADIUS = 5;
export const GLOBE_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const GLOBE_MAX_NODES = 500;
