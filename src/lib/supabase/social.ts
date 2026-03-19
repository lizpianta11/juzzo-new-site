import { createClient } from "./client";

const supabase = createClient();

// ==================== Likes ====================
export async function toggleLike(targetType: "track" | "short", targetId: string, userId: string) {
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
    return false; // unliked
  }

  await supabase.from("likes").insert({ user_id: userId, target_type: targetType, target_id: targetId });
  return true; // liked
}

// ==================== Comments ====================
export async function addComment(targetType: "track" | "short", targetId: string, userId: string, body: string) {
  const { data, error } = await supabase
    .from("comments")
    .insert({ user_id: userId, target_type: targetType, target_id: targetId, body })
    .select("*, profile:profiles(*)")
    .single();

  if (error) throw error;
  return data;
}

export async function getComments(targetType: "track" | "short", targetId: string, page = 0, limit = 20) {
  const { data, error } = await supabase
    .from("comments")
    .select("*, profile:profiles(*)")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) throw error;
  return data;
}

// ==================== Follows ====================
export async function toggleFollow(followerId: string, followingId: string) {
  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .single();

  if (existing) {
    await supabase.from("follows").delete().eq("id", existing.id);
    return false; // unfollowed
  }

  await supabase.from("follows").insert({ follower_id: followerId, following_id: followingId });
  return true; // followed
}

// ==================== Reposts ====================
export async function toggleRepost(targetType: "track" | "short", targetId: string, userId: string) {
  const { data: existing } = await supabase
    .from("reposts")
    .select("id")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();

  if (existing) {
    await supabase.from("reposts").delete().eq("id", existing.id);
    return false;
  }

  await supabase.from("reposts").insert({ user_id: userId, target_type: targetType, target_id: targetId });
  return true;
}

// ==================== Save / Bookmark ====================
export async function toggleSaveTrack(userId: string, trackId: string) {
  const { data: existing } = await supabase
    .from("saved_tracks")
    .select("id")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .single();

  if (existing) {
    await supabase.from("saved_tracks").delete().eq("id", existing.id);
    return false;
  }

  await supabase.from("saved_tracks").insert({ user_id: userId, track_id: trackId });
  return true;
}

export async function toggleSaveShort(userId: string, shortId: string) {
  const { data: existing } = await supabase
    .from("saved_shorts")
    .select("id")
    .eq("user_id", userId)
    .eq("short_id", shortId)
    .single();

  if (existing) {
    await supabase.from("saved_shorts").delete().eq("id", existing.id);
    return false;
  }

  await supabase.from("saved_shorts").insert({ user_id: userId, short_id: shortId });
  return true;
}
