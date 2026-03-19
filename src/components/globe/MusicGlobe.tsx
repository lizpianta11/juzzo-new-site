"use client";

import { Suspense, lazy } from "react";
import type { Track } from "@/types";

const GlobeScene = lazy(() => import("./GlobeScene"));

interface MusicGlobeProps {
  tracks: Track[];
}

export default function MusicGlobe({ tracks }: MusicGlobeProps) {
  return (
    <div className="relative w-full h-full min-h-[600px]">
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-full min-h-[600px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-purple-500 animate-spin" />
              <p className="text-white/60 text-sm">Loading the universe...</p>
            </div>
          </div>
        }
      >
        <GlobeScene tracks={tracks} />
      </Suspense>
    </div>
  );
}
