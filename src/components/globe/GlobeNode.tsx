"use client";

import { useRef, useState, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Mesh } from "three";
import type { GlobeNodeData } from "@/types";

interface GlobeNodeProps {
  node: GlobeNodeData;
  onHover: (node: GlobeNodeData | null, screenPos?: { x: number; y: number }) => void;
  onClick: (node: GlobeNodeData) => void;
}

const GlobeNode = memo(function GlobeNode({ node, onHover, onClick }: GlobeNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const scale = hovered ? node.size * 1.5 : node.size;

  useFrame(() => {
    if (meshRef.current) {
      // Gentle pulse animation
      meshRef.current.scale.lerp(
        new Vector3(scale, scale, scale),
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
        const screenPos = { x: e.clientX, y: e.clientY };
        onHover(node, screenPos);
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(node);
      }}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={node.genreColor}
        emissive={node.genreColor}
        emissiveIntensity={hovered ? 0.8 : 0.3}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
});

export default GlobeNode;
