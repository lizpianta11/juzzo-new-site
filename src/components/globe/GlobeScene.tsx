"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useMemo } from "react";
import GlobeNode from "./GlobeNode";
import { useGlobeInteraction } from "./useGlobeInteraction";
import GlobeHoverPreview from "./GlobeHoverPreview";
import type { Track, GlobeNodeData } from "@/types";
import { GENRE_COLORS, GLOBE_RADIUS } from "@/lib/utils/constants";

interface GlobeSceneProps {
  tracks: Track[];
}

function distributeOnSphere(tracks: Track[]): GlobeNodeData[] {
  const genreGroups: Record<string, Track[]> = {};
  tracks.forEach((t) => {
    const g = t.genre || "Other";
    if (!genreGroups[g]) genreGroups[g] = [];
    genreGroups[g].push(t);
  });

  const nodes: GlobeNodeData[] = [];
  const genreKeys = Object.keys(genreGroups);

  genreKeys.forEach((genre, genreIdx) => {
    const genreTracks = genreGroups[genre];
    // Each genre gets a longitude band
    const basePhi = (genreIdx / genreKeys.length) * Math.PI * 2;

    genreTracks.forEach((track, trackIdx) => {
      const theta = ((trackIdx + 1) / (genreTracks.length + 1)) * Math.PI;
      const phi = basePhi + (Math.random() - 0.5) * 0.5;
      const r = GLOBE_RADIUS;

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.cos(theta);
      const z = r * Math.sin(theta) * Math.sin(phi);

      const maxPlays = Math.max(...tracks.map((t) => t.play_count), 1);
      const size = 0.08 + (track.play_count / maxPlays) * 0.15;

      nodes.push({
        track,
        position: [x, y, z],
        size,
        genreColor: GENRE_COLORS[genre] || GENRE_COLORS.Other,
      });
    });
  });

  return nodes;
}

export default function GlobeScene({ tracks }: GlobeSceneProps) {
  const nodes = useMemo(() => distributeOnSphere(tracks), [tracks]);
  const { hoveredNode, setHoveredNode, handleNodeClick, hoverPosition } =
    useGlobeInteraction();

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#050510"]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />

        <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={20}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          autoRotate
          autoRotateSpeed={0.3}
        />

        {nodes.map((node) => (
          <GlobeNode
            key={node.track.id}
            node={node}
            onHover={(n, pos) => {
              setHoveredNode(n);
              if (pos) hoverPosition.current = pos;
            }}
            onClick={handleNodeClick}
          />
        ))}
      </Canvas>

      <GlobeHoverPreview node={hoveredNode} position={hoverPosition.current} />
    </>
  );
}
