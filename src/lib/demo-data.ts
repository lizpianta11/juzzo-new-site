import type { Profile, Track, Post, Short, Video, FeedItem, TextNote, Playlist } from "@/types";

// ============================================
// Demo Profiles
// ============================================
export const DEMO_PROFILES: Profile[] = [
  { id: "u1", username: "lunaray", display_name: "Luna Ray", avatar_url: "https://i.pravatar.cc/150?u=lunaray", banner_url: null, bio: "Dreamy pop vocalist ✨ New album dropping soon", pronouns: "she/her", website: "juzzo.app/luna", location: "Los Angeles, CA", genres: ["Dream Pop", "Alt R&B", "Lo-Fi", "Afrobeats"], accent_color: null, is_verified: true, follower_count: 12400, following_count: 320, track_count: 8, post_count: 45, short_count: 12, created_at: "2024-06-15" },
  { id: "u2", username: "kvng", display_name: "KVNG", avatar_url: "https://i.pravatar.cc/150?u=kvng", banner_url: null, bio: "Hip-hop from the underground 🎤", pronouns: null, website: null, location: "Atlanta, GA", genres: ["Hip-Hop"], accent_color: null, is_verified: true, follower_count: 34200, following_count: 180, track_count: 15, post_count: 82, short_count: 30, created_at: "2024-01-10" },
  { id: "u3", username: "seren", display_name: "Seren", avatar_url: "https://i.pravatar.cc/150?u=seren", banner_url: null, bio: "Lo-fi beats to study/relax to 🌊", pronouns: "they/them", website: null, location: null, genres: ["Lo-Fi"], accent_color: null, is_verified: false, follower_count: 8900, following_count: 450, track_count: 22, post_count: 20, short_count: 5, created_at: "2024-03-22" },
  { id: "u4", username: "prism", display_name: "PRISM", avatar_url: "https://i.pravatar.cc/150?u=prism", banner_url: null, bio: "Electronic producer | Berlin 🇩🇪", pronouns: null, website: null, location: "Berlin, DE", genres: ["Electronic"], accent_color: null, is_verified: true, follower_count: 21000, following_count: 95, track_count: 18, post_count: 30, short_count: 8, created_at: "2023-11-05" },
  { id: "u5", username: "avalin", display_name: "Ava Lin", avatar_url: "https://i.pravatar.cc/150?u=avalin", banner_url: null, bio: "R&B singer-songwriter from LA 🌅", pronouns: "she/her", website: null, location: "Los Angeles, CA", genres: ["R&B"], accent_color: null, is_verified: true, follower_count: 45600, following_count: 210, track_count: 12, post_count: 68, short_count: 22, created_at: "2024-02-14" },
  { id: "u6", username: "sahara", display_name: "Sahara", avatar_url: "https://i.pravatar.cc/150?u=sahara", banner_url: null, bio: "Indie folk & wildflowers 🌻", pronouns: null, website: null, location: null, genres: ["Indie"], accent_color: null, is_verified: false, follower_count: 3200, following_count: 580, track_count: 6, post_count: 15, short_count: 3, created_at: "2024-07-01" },
  { id: "u7", username: "void", display_name: "VOID", avatar_url: "https://i.pravatar.cc/150?u=void", banner_url: null, bio: "Bass music that hits different 🔊", pronouns: null, website: null, location: null, genres: ["Electronic"], accent_color: null, is_verified: false, follower_count: 15800, following_count: 120, track_count: 20, post_count: 40, short_count: 15, created_at: "2024-04-18" },
  { id: "u8", username: "kai", display_name: "Kai", avatar_url: "https://i.pravatar.cc/150?u=kai", banner_url: null, bio: "Pop & vibes 🎧", pronouns: "he/him", website: null, location: null, genres: ["Pop"], accent_color: null, is_verified: false, follower_count: 6700, following_count: 340, track_count: 5, post_count: 25, short_count: 10, created_at: "2024-08-20" },
  { id: "u9", username: "rosa", display_name: "Rosa", avatar_url: "https://i.pravatar.cc/150?u=rosa", banner_url: null, bio: "Latin heat 🔥 Reggaeton x Pop", pronouns: "she/her", website: null, location: null, genres: ["Latin"], accent_color: null, is_verified: true, follower_count: 28900, following_count: 150, track_count: 10, post_count: 55, short_count: 18, created_at: "2024-05-30" },
  { id: "u12", username: "temi", display_name: "Temi", avatar_url: "https://i.pravatar.cc/150?u=temi", banner_url: null, bio: "Afrobeats to the world 🌍", pronouns: null, website: null, location: "Lagos, NG", genres: ["Afrobeats"], accent_color: null, is_verified: true, follower_count: 52000, following_count: 85, track_count: 14, post_count: 90, short_count: 25, created_at: "2023-09-12" },
  { id: "u13", username: "yuna", display_name: "Yuna", avatar_url: "https://i.pravatar.cc/150?u=yuna", banner_url: null, bio: "K-Pop dreamer ✨🎵", pronouns: "she/her", website: null, location: "Seoul, KR", genres: ["K-Pop"], accent_color: null, is_verified: true, follower_count: 67000, following_count: 200, track_count: 9, post_count: 120, short_count: 40, created_at: "2024-01-25" },
];

function getProfile(uid: string): Profile | undefined {
  return DEMO_PROFILES.find((p) => p.id === uid);
}

function coverUrl(seed: number): string {
  return `https://picsum.photos/seed/${seed + 100}/400/400`;
}

// ============================================
// Demo Tracks (25 tracks from discover page)
// ============================================
export const DEMO_TRACKS: Track[] = [
  { id: "1", user_id: "u1", title: "Midnight Dreams", artist_name: "Luna Ray", audio_url: "", cover_url: "", duration: 215, genre: "Pop", play_count: 45200, created_at: "2025-12-01", profile: getProfile("u1") },
  { id: "2", user_id: "u2", title: "Neon Streets", artist_name: "KVNG", audio_url: "", cover_url: "", duration: 198, genre: "Hip-Hop", play_count: 38100, created_at: "2025-11-28", profile: getProfile("u2") },
  { id: "3", user_id: "u3", title: "Ocean Waves", artist_name: "Seren", audio_url: "", cover_url: "", duration: 240, genre: "Lo-Fi", play_count: 52000, created_at: "2025-11-20", profile: getProfile("u3") },
  { id: "4", user_id: "u4", title: "Electric Soul", artist_name: "PRISM", audio_url: "", cover_url: "", duration: 186, genre: "Electronic", play_count: 29800, created_at: "2025-12-05", profile: getProfile("u4") },
  { id: "5", user_id: "u5", title: "Golden Hour", artist_name: "Ava Lin", audio_url: "", cover_url: "", duration: 224, genre: "R&B", play_count: 61500, created_at: "2025-10-15", profile: getProfile("u5") },
  { id: "6", user_id: "u6", title: "Desert Wind", artist_name: "Sahara", audio_url: "", cover_url: "", duration: 202, genre: "Indie", play_count: 17300, created_at: "2025-12-10", profile: getProfile("u6") },
  { id: "7", user_id: "u7", title: "Bass Drop", artist_name: "VOID", audio_url: "", cover_url: "", duration: 175, genre: "Electronic", play_count: 43200, created_at: "2025-11-05", profile: getProfile("u7") },
  { id: "8", user_id: "u8", title: "Sunset Ride", artist_name: "Kai", audio_url: "", cover_url: "", duration: 231, genre: "Pop", play_count: 35600, created_at: "2025-12-08", profile: getProfile("u8") },
  { id: "9", user_id: "u9", title: "Fuego", artist_name: "Rosa", audio_url: "", cover_url: "", duration: 195, genre: "Latin", play_count: 27400, created_at: "2025-11-18", profile: getProfile("u9") },
  { id: "10", user_id: "u4", title: "Moonlit Jazz", artist_name: "PRISM", audio_url: "", cover_url: "", duration: 312, genre: "Jazz", play_count: 14200, created_at: "2025-10-01", profile: getProfile("u4") },
  { id: "11", user_id: "u6", title: "Crystal Clear", artist_name: "Sahara", audio_url: "", cover_url: "", duration: 189, genre: "Alternative", play_count: 22100, created_at: "2025-12-12", profile: getProfile("u6") },
  { id: "12", user_id: "u12", title: "Lagos Nights", artist_name: "Temi", audio_url: "", cover_url: "", duration: 207, genre: "Afrobeats", play_count: 48900, created_at: "2025-11-22", profile: getProfile("u12") },
  { id: "13", user_id: "u13", title: "Starlight", artist_name: "Yuna", audio_url: "", cover_url: "", duration: 218, genre: "K-Pop", play_count: 56700, created_at: "2025-10-20", profile: getProfile("u13") },
  { id: "14", user_id: "u8", title: "Hillside", artist_name: "Kai", audio_url: "", cover_url: "", duration: 245, genre: "Country", play_count: 11800, created_at: "2025-12-14", profile: getProfile("u8") },
  { id: "15", user_id: "u3", title: "Requiem", artist_name: "Seren", audio_url: "", cover_url: "", duration: 380, genre: "Classical", play_count: 8900, created_at: "2025-09-15", profile: getProfile("u3") },
  { id: "16", user_id: "u1", title: "Dawn Chorus", artist_name: "Luna Ray", audio_url: "", cover_url: "", duration: 203, genre: "Pop", play_count: 31200, created_at: "2025-12-16", profile: getProfile("u1") },
  { id: "17", user_id: "u2", title: "Crown", artist_name: "KVNG", audio_url: "", cover_url: "", duration: 182, genre: "Hip-Hop", play_count: 42300, created_at: "2025-12-02", profile: getProfile("u2") },
  { id: "18", user_id: "u4", title: "Pulse", artist_name: "PRISM", audio_url: "", cover_url: "", duration: 210, genre: "Electronic", play_count: 38700, created_at: "2025-11-30", profile: getProfile("u4") },
  { id: "19", user_id: "u12", title: "Jollof", artist_name: "Temi", audio_url: "", cover_url: "", duration: 195, genre: "Afrobeats", play_count: 51200, created_at: "2025-12-04", profile: getProfile("u12") },
  { id: "20", user_id: "u5", title: "Silk", artist_name: "Ava Lin", audio_url: "", cover_url: "", duration: 228, genre: "R&B", play_count: 44100, created_at: "2025-11-25", profile: getProfile("u5") },
  { id: "21", user_id: "u3", title: "Rain Pattern", artist_name: "Seren", audio_url: "", cover_url: "", duration: 260, genre: "Lo-Fi", play_count: 33400, created_at: "2025-12-06", profile: getProfile("u3") },
  { id: "22", user_id: "u7", title: "Voltage", artist_name: "VOID", audio_url: "", cover_url: "", duration: 190, genre: "Electronic", play_count: 36800, created_at: "2025-12-09", profile: getProfile("u7") },
  { id: "23", user_id: "u9", title: "Caliente", artist_name: "Rosa", audio_url: "", cover_url: "", duration: 205, genre: "Latin", play_count: 24500, created_at: "2025-11-12", profile: getProfile("u9") },
  { id: "24", user_id: "u6", title: "Wildflower", artist_name: "Sahara", audio_url: "", cover_url: "", duration: 218, genre: "Indie", play_count: 19600, created_at: "2025-12-11", profile: getProfile("u6") },
  { id: "25", user_id: "u13", title: "Neon Dream", artist_name: "Yuna", audio_url: "", cover_url: "", duration: 195, genre: "K-Pop", play_count: 47800, created_at: "2025-12-13", profile: getProfile("u13") },
];

// ============================================
// Demo Posts
// ============================================
export const DEMO_POSTS: Post[] = [
  { id: "p1", user_id: "u5", type: "image", body: "Golden Hour vibes in the studio today 🌅 New track coming this week!", images: [coverUrl(201)], track_id: "5", like_count: 2340, comment_count: 89, repost_count: 156, created_at: "2026-03-15T18:30:00Z", profile: getProfile("u5"), track: DEMO_TRACKS.find(t => t.id === "5") },
  { id: "p2", user_id: "u2", type: "text", body: "Just hit 30k followers 🔥 y'all are insane. Big announcement dropping tomorrow. Stay locked in. 👑", images: [], track_id: null, like_count: 4520, comment_count: 312, repost_count: 890, created_at: "2026-03-15T16:00:00Z", profile: getProfile("u2") },
  { id: "p3", user_id: "u12", type: "image", body: "Lagos to the world! 🌍 New Afrobeats EP is 80% done. Which track should I drop first?", images: [coverUrl(203), coverUrl(204)], track_id: "12", like_count: 5600, comment_count: 445, repost_count: 1200, created_at: "2026-03-15T14:00:00Z", profile: getProfile("u12"), track: DEMO_TRACKS.find(t => t.id === "12") },
  { id: "p4", user_id: "u13", type: "text", body: "Starlight just passed 50k plays!!! Thank you Juzzo fam 💜✨ This is just the beginning", images: [], track_id: "13", like_count: 8900, comment_count: 670, repost_count: 2100, created_at: "2026-03-15T12:00:00Z", profile: getProfile("u13"), track: DEMO_TRACKS.find(t => t.id === "13") },
  { id: "p5", user_id: "u1", type: "image", body: "Midnight Dreams music video shoot day 1 🎬✨ Can't wait for you all to see this", images: [coverUrl(205)], track_id: "1", like_count: 1890, comment_count: 134, repost_count: 320, created_at: "2026-03-14T22:00:00Z", profile: getProfile("u1"), track: DEMO_TRACKS.find(t => t.id === "1") },
  { id: "p6", user_id: "u9", type: "text", body: "Fuego remix ft. @temi dropping next Friday 🔥🇨🇴🇳🇬 Afro-Latin heat incoming", images: [], track_id: null, like_count: 3400, comment_count: 256, repost_count: 780, created_at: "2026-03-14T20:00:00Z", profile: getProfile("u9") },
  { id: "p7", user_id: "u4", type: "image", body: "New modular setup who dis 🎛️ Berlin studio sessions", images: [coverUrl(207)], track_id: null, like_count: 1200, comment_count: 78, repost_count: 190, created_at: "2026-03-14T18:00:00Z", profile: getProfile("u4") },
  { id: "p8", user_id: "u7", type: "text", body: "Working on something heavy. Bass that shakes dimensions. Drop date TBA 🔊💀", images: [], track_id: null, like_count: 2100, comment_count: 167, repost_count: 450, created_at: "2026-03-14T15:00:00Z", profile: getProfile("u7") },
  { id: "p9", user_id: "u3", type: "image", body: "Rainy day producing 🌧️ New lo-fi pack uploading tonight", images: [coverUrl(209)], track_id: "21", like_count: 980, comment_count: 56, repost_count: 120, created_at: "2026-03-14T12:00:00Z", profile: getProfile("u3"), track: DEMO_TRACKS.find(t => t.id === "21") },
  { id: "p10", user_id: "u6", type: "text", body: "Wildflower acoustic version is live on Juzzo 🌻🎸 Link in bio", images: [], track_id: "24", like_count: 670, comment_count: 45, repost_count: 89, created_at: "2026-03-13T20:00:00Z", profile: getProfile("u6"), track: DEMO_TRACKS.find(t => t.id === "24") },
];

// ============================================
// Demo Shorts
// ============================================
export const DEMO_SHORTS: Short[] = [
  { id: "s1", user_id: "u13", video_url: "", thumbnail_url: coverUrl(301), caption: "Starlight dance challenge ✨ Show me yours! #JuzzoChallenge", track_id: "13", view_count: 234000, like_count: 18900, comment_count: 1200, created_at: "2026-03-15T20:00:00Z", profile: getProfile("u13"), track: DEMO_TRACKS.find(t => t.id === "13") },
  { id: "s2", user_id: "u2", video_url: "", thumbnail_url: coverUrl(302), caption: "Studio freestyle 🎤 no cap", track_id: "17", view_count: 156000, like_count: 12300, comment_count: 890, created_at: "2026-03-15T17:00:00Z", profile: getProfile("u2"), track: DEMO_TRACKS.find(t => t.id === "17") },
  { id: "s3", user_id: "u5", video_url: "", thumbnail_url: coverUrl(303), caption: "Behind the scenes of Golden Hour 🌅", track_id: "5", view_count: 189000, like_count: 15600, comment_count: 980, created_at: "2026-03-15T14:30:00Z", profile: getProfile("u5"), track: DEMO_TRACKS.find(t => t.id === "5") },
  { id: "s4", user_id: "u12", video_url: "", thumbnail_url: coverUrl(304), caption: "Lagos Nights live performance 🔥🌍", track_id: "12", view_count: 312000, like_count: 24500, comment_count: 1800, created_at: "2026-03-15T11:00:00Z", profile: getProfile("u12"), track: DEMO_TRACKS.find(t => t.id === "12") },
  { id: "s5", user_id: "u9", video_url: "", thumbnail_url: coverUrl(305), caption: "Fuego choreo 💃🔥 #Fuego #Juzzo", track_id: "9", view_count: 98000, like_count: 8700, comment_count: 560, created_at: "2026-03-14T22:00:00Z", profile: getProfile("u9"), track: DEMO_TRACKS.find(t => t.id === "9") },
  { id: "s6", user_id: "u1", video_url: "", thumbnail_url: coverUrl(306), caption: "Midnight Dreams unplugged 🎸✨", track_id: "1", view_count: 67000, like_count: 5400, comment_count: 340, created_at: "2026-03-14T19:00:00Z", profile: getProfile("u1"), track: DEMO_TRACKS.find(t => t.id === "1") },
  { id: "s7", user_id: "u4", video_url: "", thumbnail_url: coverUrl(307), caption: "Modular synth jam session 🎛️", track_id: "18", view_count: 45000, like_count: 3200, comment_count: 210, created_at: "2026-03-14T16:00:00Z", profile: getProfile("u4"), track: DEMO_TRACKS.find(t => t.id === "18") },
  { id: "s8", user_id: "u8", video_url: "", thumbnail_url: coverUrl(308), caption: "Sunset Ride music video teaser 🌅🚗", track_id: "8", view_count: 78000, like_count: 6100, comment_count: 430, created_at: "2026-03-14T13:00:00Z", profile: getProfile("u8"), track: DEMO_TRACKS.find(t => t.id === "8") },
];

// ============================================
// Demo Videos (long-form)
// ============================================
export const DEMO_VIDEOS: Video[] = [
  { id: "v1", user_id: "u12", video_url: "", thumbnail_url: coverUrl(401), title: "Temi - Lagos Nights (Official Music Video)", description: "The official music video for Lagos Nights. Shot on location in Lagos, Nigeria.", duration: 245, view_count: 890000, like_count: 67000, comment_count: 4500, created_at: "2026-03-10T12:00:00Z", profile: getProfile("u12") },
  { id: "v2", user_id: "u5", video_url: "", thumbnail_url: coverUrl(402), title: "Golden Hour - Studio Vlog & Making Of", description: "Take a peek behind the curtain. How Golden Hour was made from scratch.", duration: 720, view_count: 234000, like_count: 18900, comment_count: 1200, created_at: "2026-03-08T15:00:00Z", profile: getProfile("u5") },
  { id: "v3", user_id: "u2", video_url: "", thumbnail_url: coverUrl(403), title: "KVNG - Crown (Official Video)", description: "Crown. Out now on all platforms.", duration: 198, view_count: 567000, like_count: 45000, comment_count: 3200, created_at: "2026-03-05T10:00:00Z", profile: getProfile("u2") },
  { id: "v4", user_id: "u13", video_url: "", thumbnail_url: coverUrl(404), title: "A Day in My Life as a K-Pop Artist", description: "Follow me through a typical day - practice, recording, fan meet, and more!", duration: 960, view_count: 1200000, like_count: 98000, comment_count: 8900, created_at: "2026-03-01T09:00:00Z", profile: getProfile("u13") },
  { id: "v5", user_id: "u4", video_url: "", thumbnail_url: coverUrl(405), title: "PRISM Live @ Berlin Club Session", description: "Full set from my Berlin residency. 2 hours of pure electronic energy.", duration: 7200, view_count: 156000, like_count: 12000, comment_count: 890, created_at: "2026-02-25T20:00:00Z", profile: getProfile("u4") },
];

// ============================================
// Build Combined Feed
// ============================================
export function buildCombinedFeed(): FeedItem[] {
  // Include some tracks as feed items so the Music filter has content
  const feedTracks = DEMO_TRACKS.slice(0, 8);
  const items: FeedItem[] = [
    ...DEMO_POSTS.map((p) => ({ type: "post" as const, data: p, id: p.id })),
    ...DEMO_SHORTS.map((s) => ({ type: "short" as const, data: s, id: s.id })),
    ...DEMO_VIDEOS.map((v) => ({ type: "video" as const, data: v, id: v.id })),
    ...DEMO_NOTES.map((n) => ({ type: "note" as const, data: n, id: n.id })),
    ...feedTracks.map((t) => ({ type: "track" as const, data: t, id: `t-${t.id}` })),
  ];
  // Sort by created_at desc
  items.sort((a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime());
  return items;
}

// ============================================
// Demo Text Notes (chirps / thoughts)
// ============================================
export const DEMO_NOTES: TextNote[] = [
  { id: "n1", user_id: "u2", body: "just finished writing something special at 3am. can't sleep. won't sleep. music first. 🎤🔥", like_count: 1890, comment_count: 134, repost_count: 420, created_at: "2026-03-16T03:30:00Z", profile: getProfile("u2") },
  { id: "n2", user_id: "u13", body: "listening to my own album on repeat because I genuinely love it??? is that allowed 😭💜", like_count: 5670, comment_count: 312, repost_count: 1200, created_at: "2026-03-16T01:15:00Z", profile: getProfile("u13") },
  { id: "n3", user_id: "u5", body: "r&b at sunset hits different. that's the tweet.", like_count: 3400, comment_count: 89, repost_count: 560, created_at: "2026-03-15T19:45:00Z", profile: getProfile("u5") },
  { id: "n4", user_id: "u12", body: "Lagos → London → LA. three cities, three sessions, one EP. the world is small when you have wifi and a mic 🌍🎧", like_count: 4200, comment_count: 256, repost_count: 890, created_at: "2026-03-15T15:30:00Z", profile: getProfile("u12") },
  { id: "n5", user_id: "u9", body: "who else plays their unreleased songs for their cat to see if they vibe with it 🐱🎵", like_count: 7800, comment_count: 670, repost_count: 2300, created_at: "2026-03-15T13:00:00Z", profile: getProfile("u9") },
  { id: "n6", user_id: "u1", body: "new mic day ✨🎙️ about to record something magical", like_count: 2100, comment_count: 78, repost_count: 310, created_at: "2026-03-15T10:00:00Z", profile: getProfile("u1") },
  { id: "n7", user_id: "u4", body: "the synth I just designed sounds like the inside of a spaceship. releasing it as a free pack on Juzzo this weekend 🛸", like_count: 3200, comment_count: 189, repost_count: 670, created_at: "2026-03-14T23:00:00Z", profile: getProfile("u4") },
  { id: "n8", user_id: "u7", body: "bass so deep it registered on a seismograph. not joking. 🔊📊", like_count: 1400, comment_count: 98, repost_count: 230, created_at: "2026-03-14T17:30:00Z", profile: getProfile("u7") },
  { id: "n9", user_id: "u3", body: "rain + lo-fi + hot cocoa = perfect production day ☕🌧️", like_count: 980, comment_count: 45, repost_count: 120, created_at: "2026-03-14T14:00:00Z", profile: getProfile("u3") },
  { id: "n10", user_id: "u8", body: "collab with @rosa coming sooner than you think 👀🔥", like_count: 2800, comment_count: 345, repost_count: 780, created_at: "2026-03-14T11:00:00Z", profile: getProfile("u8"), track: DEMO_TRACKS.find(t => t.id === "8") },
];

// ============================================
// Demo Playlists
// ============================================
export const DEMO_PLAYLISTS: Playlist[] = [
  { id: "pl1", user_id: "u1", title: "Late Night Vibes", description: "Songs for 2am sessions", cover_url: null, is_public: true, created_at: "2026-02-10", track_count: 18 },
  { id: "pl2", user_id: "u1", title: "Workout Heat", description: "Energy tracks for the gym", cover_url: null, is_public: true, created_at: "2026-01-20", track_count: 24 },
  { id: "pl3", user_id: "u1", title: "Chill Lo-Fi", description: "Study & relax beats", cover_url: null, is_public: true, created_at: "2025-12-05", track_count: 32 },
];
