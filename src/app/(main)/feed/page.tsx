import HomePage from "@/components/home/HomePage";
import { buildCombinedFeed, DEMO_SHORTS, DEMO_PROFILES, DEMO_TRACKS, DEMO_VIDEOS } from "@/lib/demo-data";

export default function FeedPage() {
  const feed = buildCombinedFeed();
  return <HomePage feed={feed} shorts={DEMO_SHORTS} profiles={DEMO_PROFILES} tracks={DEMO_TRACKS} videos={DEMO_VIDEOS} />;
}
