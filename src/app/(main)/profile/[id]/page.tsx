import ProfileView from "@/components/profile/ProfileView";
import { DEMO_PROFILES, DEMO_TRACKS, DEMO_POSTS, DEMO_SHORTS } from "@/lib/demo-data";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = DEMO_PROFILES.find((p) => p.id === id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
              <path strokeLinecap="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-white/50">User not found</p>
          <p className="text-sm text-white/25 mt-1">This profile doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const tracks = DEMO_TRACKS.filter((t) => t.user_id === id);
  const posts = DEMO_POSTS.filter((p) => p.user_id === id);
  const shorts = DEMO_SHORTS.filter((s) => s.user_id === id);

  return <ProfileView profile={profile} tracks={tracks} posts={posts} shorts={shorts} />;
}
