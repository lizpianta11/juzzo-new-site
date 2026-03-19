import MePage from "@/components/me/MePage";
import { DEMO_TRACKS, DEMO_POSTS, DEMO_SHORTS, DEMO_PLAYLISTS } from "@/lib/demo-data";

export default function MeRoute() {
  // Filter content for the demo user (u1 = Luna Ray)
  const myTracks = DEMO_TRACKS.filter((t) => t.user_id === "u1");
  const myPosts = DEMO_POSTS.filter((p) => p.user_id === "u1");
  const myShorts = DEMO_SHORTS.filter((s) => s.user_id === "u1");
  const myPlaylists = DEMO_PLAYLISTS.filter((pl) => pl.user_id === "u1");

  return (
    <MePage
      tracks={myTracks}
      posts={myPosts}
      shorts={myShorts}
      playlists={myPlaylists}
    />
  );
}
