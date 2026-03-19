"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/providers/PlayerProvider";
import type { Track } from "@/types";

interface MusicWorldProps {
  tracks: Track[];
}

interface GlobeTile {
  track: Track;
  theta: number;
  phi: number;
  baseSize: number;
}

// Distribute tracks on a sphere using fibonacci spiral for even coverage
function distributeOnSphere(tracks: Track[]): GlobeTile[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return tracks.map((track, i) => {
    const y = 1 - (i / (tracks.length - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const phi = Math.acos(Math.max(-1, Math.min(1, y)));
    const maxPlays = Math.max(...tracks.map((t) => t.play_count), 1);
    const popularity = track.play_count / maxPlays;
    return {
      track,
      theta,
      phi,
      baseSize: 52 + popularity * 28,
    };
  });
}

// Project spherical coords to 2D with perspective
function projectTile(
  tile: GlobeTile,
  rotX: number,
  rotY: number,
  globeRadius: number
): { x: number; y: number; z: number; scale: number; visible: boolean } {
  // Spherical to 3D cartesian
  const sinPhi = Math.sin(tile.phi);
  let x3d = globeRadius * sinPhi * Math.cos(tile.theta);
  let y3d = globeRadius * Math.cos(tile.phi);
  let z3d = globeRadius * sinPhi * Math.sin(tile.theta);

  // Rotate around Y axis (horizontal drag)
  const cosRY = Math.cos(rotY);
  const sinRY = Math.sin(rotY);
  const rx = x3d * cosRY - z3d * sinRY;
  const rz = x3d * sinRY + z3d * cosRY;
  x3d = rx;
  z3d = rz;

  // Rotate around X axis (vertical drag)
  const cosRX = Math.cos(rotX);
  const sinRX = Math.sin(rotX);
  const ry = y3d * cosRX - z3d * sinRX;
  const rz2 = y3d * sinRX + z3d * cosRX;
  y3d = ry;
  z3d = rz2;

  // Perspective projection
  const perspective = 800;
  const projScale = perspective / (perspective + z3d + globeRadius);
  const screenX = x3d * projScale;
  const screenY = y3d * projScale;
  const depth = (z3d + globeRadius) / (2 * globeRadius); // 0=back, 1=front

  return {
    x: screenX,
    y: screenY,
    z: z3d,
    scale: projScale,
    visible: z3d > -globeRadius * 0.5,
  };
}

function CoverTile({
  tile,
  projected,
  isActive,
  isPlaying,
  onSelect,
  zoom,
}: {
  tile: GlobeTile;
  projected: { x: number; y: number; z: number; scale: number; visible: boolean };
  isActive: boolean;
  isPlaying: boolean;
  onSelect: (track: Track) => void;
  zoom: number;
}) {
  const [hovered, setHovered] = useState(false);

  if (!projected.visible) return null;

  const size = tile.baseSize * projected.scale * zoom;
  const depth01 = Math.max(0, Math.min(1, (projected.z + 200) / 400));
  const opacity = 0.15 + depth01 * 0.85;

  // Seed-based cover image (consistent per track)
  const coverSeed = parseInt(tile.track.id, 10) || tile.track.title.charCodeAt(0);
  const coverUrl = tile.track.cover_url || `https://picsum.photos/seed/${coverSeed + 100}/200/200`;

  return (
    <motion.div
      className="absolute cursor-pointer will-change-transform"
      style={{
        left: `calc(50% + ${projected.x * zoom}px)`,
        top: `calc(50% + ${projected.y * zoom}px)`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        zIndex: isActive ? 100 : Math.round(depth01 * 40),
        opacity: isActive ? 1 : opacity,
      }}
      animate={{
        scale: isActive ? 1.2 : hovered ? 1.1 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(tile.track);
      }}
    >
      {/* Active glow ring */}
      {isActive && (
        <motion.div
          className="absolute -inset-[3px] rounded-2xl"
          style={{
            background: "conic-gradient(from 0deg, #a855f7, #06b6d4, #ec4899, #a855f7)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Album cover */}
      <div
        className="relative w-full h-full rounded-xl overflow-hidden shadow-xl"
        style={{
          boxShadow: isActive
            ? "0 0 30px rgba(168,85,247,0.4), 0 8px 32px rgba(0,0,0,0.6)"
            : `0 ${4 * projected.scale}px ${16 * projected.scale}px rgba(0,0,0,${0.3 + (1 - depth01) * 0.3})`,
        }}
      >
        <img
          src={coverUrl}
          alt={tile.track.title}
          className="w-full h-full object-cover"
          draggable={false}
          loading="lazy"
        />

        {/* Dark vignette overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, transparent 40%, rgba(0,0,0,${0.15 + (1 - depth01) * 0.25}) 100%)`,
          }}
        />

        {/* Hover / active overlay */}
        <AnimatePresence>
          {(hovered || isActive) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center"
            >
              <div
                className={`rounded-full flex items-center justify-center shadow-lg ${
                  isActive && isPlaying ? "bg-white" : "bg-white/90"
                }`}
                style={{ width: Math.max(24, size * 0.35), height: Math.max(24, size * 0.35) }}
              >
                {isActive && isPlaying ? (
                  <svg
                    className="text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    style={{ width: Math.max(10, size * 0.14), height: Math.max(10, size * 0.14) }}
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg
                    className="text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      width: Math.max(10, size * 0.14),
                      height: Math.max(10, size * 0.14),
                      marginLeft: size * 0.02,
                    }}
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </div>

              {size > 55 && (
                <div className="mt-1 text-center w-full px-1.5">
                  <p className="text-white text-[10px] font-semibold truncate leading-tight drop-shadow-lg">
                    {tile.track.title}
                  </p>
                  <p className="text-white/70 text-[8px] truncate leading-tight drop-shadow-lg">
                    {tile.track.artist_name}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Playing bars indicator */}
        {isActive && isPlaying && !hovered && (
          <div className="absolute bottom-1 right-1 flex items-end gap-[2px]">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-[2.5px] bg-white rounded-full shadow-sm"
                animate={{ height: [3, 10, 3] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hover tooltip - only when zoomed enough */}
      <AnimatePresence>
        {hovered && !isActive && size > 40 && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 whitespace-nowrap z-[80] pointer-events-none"
            style={{ top: size + 6 }}
          >
            <p className="text-white text-[11px] font-semibold">{tile.track.title}</p>
            <p className="text-white/50 text-[10px]">{tile.track.artist_name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-white/30 text-[9px]">{tile.track.genre}</span>
              <span className="text-white/20 text-[9px]">·</span>
              <span className="text-white/30 text-[9px]">{tile.track.play_count.toLocaleString()} plays</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MusicWorld({ tracks }: MusicWorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(-0.3);
  const [rotY, setRotY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragLast, setDragLast] = useState({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const animFrameRef = useRef<number>(0);
  const { play, currentTrack, isPlaying, pause, resume } = usePlayer();
  const activeTrackId = currentTrack?.id ?? null;

  const GLOBE_RADIUS = 220;

  const tiles = useMemo(() => distributeOnSphere(tracks), [tracks]);

  // Auto-rotate when idle
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      if (autoRotateRef.current && !isDragging) {
        const dt = (time - lastTime) / 1000;
        setRotY((prev) => prev + dt * 0.08);
      }
      lastTime = time;
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isDragging]);

  const handleSelect = useCallback(
    (track: Track) => {
      if (currentTrack?.id === track.id) {
        isPlaying ? pause() : resume();
      } else {
        play(track);
      }
    },
    [currentTrack, isPlaying, play, pause, resume]
  );

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.06 : 0.06;
    setZoom((prev) => Math.min(2.5, Math.max(0.4, prev + delta)));
  }, []);

  // Drag to rotate
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    autoRotateRef.current = false;
    setDragLast({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragLast.x;
      const dy = e.clientY - dragLast.y;
      setRotY((prev) => prev + dx * 0.005);
      setRotX((prev) => Math.max(-1.2, Math.min(1.2, prev + dy * 0.005)));
      setDragLast({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragLast]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 2000);
  }, []);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      autoRotateRef.current = false;
      setDragLast({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragLast.x;
      const dy = e.touches[0].clientY - dragLast.y;
      setRotY((prev) => prev + dx * 0.005);
      setRotX((prev) => Math.max(-1.2, Math.min(1.2, prev + dy * 0.005)));
      setDragLast({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    },
    [isDragging, dragLast]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 2000);
  }, []);

  // Zoom controls
  const zoomIn = useCallback(() => setZoom((p) => Math.min(2.5, p + 0.25)), []);
  const zoomOut = useCallback(() => setZoom((p) => Math.max(0.4, p - 0.25)), []);
  const resetView = useCallback(() => {
    setZoom(1);
    setRotX(-0.3);
    setRotY(0);
    autoRotateRef.current = true;
  }, []);

  // Project all tiles and sort by depth
  const projected = useMemo(() => {
    return tiles
      .map((tile) => ({
        tile,
        proj: projectTile(tile, rotX, rotY, GLOBE_RADIUS),
      }))
      .sort((a, b) => a.proj.z - b.proj.z);
  }, [tiles, rotX, rotY]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* Ambient glow behind globe */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/[0.05] blur-[100px]" />
        <div className="absolute top-[40%] left-[40%] w-[250px] h-[250px] rounded-full bg-cyan-500/[0.04] blur-[80px]" />
        <div className="absolute top-[60%] left-[55%] w-[200px] h-[200px] rounded-full bg-pink-500/[0.03] blur-[70px]" />
      </div>

      {/* Globe container */}
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Render tiles sorted back-to-front */}
        {projected.map(({ tile, proj }) => (
          <CoverTile
            key={tile.track.id}
            tile={tile}
            projected={proj}
            isActive={activeTrackId === tile.track.id}
            isPlaying={isPlaying && currentTrack?.id === tile.track.id}
            onSelect={handleSelect}
            zoom={zoom}
          />
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={zoomIn}
          className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.14] transition-colors"
          aria-label="Zoom in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={zoomOut}
          className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.14] transition-colors"
          aria-label="Zoom out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path d="M5 12h14" />
          </svg>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={resetView}
          className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.14] transition-colors"
          aria-label="Reset view"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
