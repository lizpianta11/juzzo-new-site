import { createClient } from "../client";

const supabase = createClient();

export async function getTrendingTracks(limit = 50) {
  const { data, error } = await supabase
    .from("tracks")
    .select("*, profile:profiles(*)")
    .order("play_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getTracksByGenre(genre: string, limit = 50) {
  const { data, error } = await supabase
    .from("tracks")
    .select("*, profile:profiles(*)")
    .eq("genre", genre)
    .order("play_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getTrackById(id: string) {
  const { data, error } = await supabase
    .from("tracks")
    .select("*, profile:profiles(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getTracksByUser(userId: string) {
  const { data, error } = await supabase
    .from("tracks")
    .select("*, profile:profiles(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function recordTrackPlay(trackId: string, userId?: string) {
  await supabase.from("track_plays").insert({
    track_id: trackId,
    user_id: userId ?? null,
  });
}
