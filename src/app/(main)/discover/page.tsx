import MusicPage from "@/components/music/MusicPage";
import type { Track } from "@/types";

const DEMO_TRACKS: Track[] = [
  { id: "1", user_id: "u1", title: "Midnight Dreams", artist_name: "Luna Ray", audio_url: "", cover_url: "", duration: 215, genre: "Pop", play_count: 45200, created_at: "" },
  { id: "2", user_id: "u2", title: "Neon Streets", artist_name: "KVNG", audio_url: "", cover_url: "", duration: 198, genre: "Hip-Hop", play_count: 38100, created_at: "" },
  { id: "3", user_id: "u3", title: "Ocean Waves", artist_name: "Seren", audio_url: "", cover_url: "", duration: 240, genre: "Lo-Fi", play_count: 52000, created_at: "" },
  { id: "4", user_id: "u4", title: "Electric Soul", artist_name: "PRISM", audio_url: "", cover_url: "", duration: 186, genre: "Electronic", play_count: 29800, created_at: "" },
  { id: "5", user_id: "u5", title: "Golden Hour", artist_name: "Ava Lin", audio_url: "", cover_url: "", duration: 224, genre: "R&B", play_count: 61500, created_at: "" },
  { id: "6", user_id: "u6", title: "Desert Wind", artist_name: "Sahara", audio_url: "", cover_url: "", duration: 202, genre: "Indie", play_count: 17300, created_at: "" },
  { id: "7", user_id: "u7", title: "Bass Drop", artist_name: "VOID", audio_url: "", cover_url: "", duration: 175, genre: "Electronic", play_count: 43200, created_at: "" },
  { id: "8", user_id: "u8", title: "Sunset Ride", artist_name: "Kai", audio_url: "", cover_url: "", duration: 231, genre: "Pop", play_count: 35600, created_at: "" },
  { id: "9", user_id: "u9", title: "Fuego", artist_name: "Rosa", audio_url: "", cover_url: "", duration: 195, genre: "Latin", play_count: 27400, created_at: "" },
  { id: "10", user_id: "u10", title: "Moonlit Jazz", artist_name: "Miles Carter", audio_url: "", cover_url: "", duration: 312, genre: "Jazz", play_count: 14200, created_at: "" },
  { id: "11", user_id: "u11", title: "Crystal Clear", artist_name: "Echo", audio_url: "", cover_url: "", duration: 189, genre: "Alternative", play_count: 22100, created_at: "" },
  { id: "12", user_id: "u12", title: "Lagos Nights", artist_name: "Temi", audio_url: "", cover_url: "", duration: 207, genre: "Afrobeats", play_count: 48900, created_at: "" },
  { id: "13", user_id: "u13", title: "Starlight", artist_name: "Yuna", audio_url: "", cover_url: "", duration: 218, genre: "K-Pop", play_count: 56700, created_at: "" },
  { id: "14", user_id: "u14", title: "Hillside", artist_name: "Tucker", audio_url: "", cover_url: "", duration: 245, genre: "Country", play_count: 11800, created_at: "" },
  { id: "15", user_id: "u15", title: "Requiem", artist_name: "Clara", audio_url: "", cover_url: "", duration: 380, genre: "Classical", play_count: 8900, created_at: "" },
  { id: "16", user_id: "u1", title: "Dawn Chorus", artist_name: "Luna Ray", audio_url: "", cover_url: "", duration: 203, genre: "Pop", play_count: 31200, created_at: "" },
  { id: "17", user_id: "u2", title: "Crown", artist_name: "KVNG", audio_url: "", cover_url: "", duration: 182, genre: "Hip-Hop", play_count: 42300, created_at: "" },
  { id: "18", user_id: "u4", title: "Pulse", artist_name: "PRISM", audio_url: "", cover_url: "", duration: 210, genre: "Electronic", play_count: 38700, created_at: "" },
  { id: "19", user_id: "u12", title: "Jollof", artist_name: "Temi", audio_url: "", cover_url: "", duration: 195, genre: "Afrobeats", play_count: 51200, created_at: "" },
  { id: "20", user_id: "u5", title: "Silk", artist_name: "Ava Lin", audio_url: "", cover_url: "", duration: 228, genre: "R&B", play_count: 44100, created_at: "" },
  { id: "21", user_id: "u3", title: "Rain Pattern", artist_name: "Seren", audio_url: "", cover_url: "", duration: 260, genre: "Lo-Fi", play_count: 33400, created_at: "" },
  { id: "22", user_id: "u7", title: "Voltage", artist_name: "VOID", audio_url: "", cover_url: "", duration: 190, genre: "Electronic", play_count: 36800, created_at: "" },
  { id: "23", user_id: "u9", title: "Caliente", artist_name: "Rosa", audio_url: "", cover_url: "", duration: 205, genre: "Latin", play_count: 24500, created_at: "" },
  { id: "24", user_id: "u6", title: "Wildflower", artist_name: "Sahara", audio_url: "", cover_url: "", duration: 218, genre: "Indie", play_count: 19600, created_at: "" },
  { id: "25", user_id: "u13", title: "Neon Dream", artist_name: "Yuna", audio_url: "", cover_url: "", duration: 195, genre: "K-Pop", play_count: 47800, created_at: "" },
];

export default function DiscoverPage() {
  return <MusicPage tracks={DEMO_TRACKS} />;
}
