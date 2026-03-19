"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/providers/PlayerProvider";
import type { GlobeNodeData } from "@/types";

export function useGlobeInteraction() {
  const [hoveredNode, setHoveredNode] = useState<GlobeNodeData | null>(null);
  const hoverPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const router = useRouter();
  const { play } = usePlayer();

  const handleNodeClick = useCallback(
    (node: GlobeNodeData) => {
      // Start playback immediately via PlayerProvider
      play(node.track);
    },
    [play]
  );

  const navigateToArtist = useCallback(
    (userId: string) => {
      router.push(`/profile/${userId}`);
    },
    [router]
  );

  return {
    hoveredNode,
    setHoveredNode,
    handleNodeClick,
    navigateToArtist,
    hoverPosition,
  };
}
