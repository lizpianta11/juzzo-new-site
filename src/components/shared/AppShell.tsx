"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import MiniPlayer from "@/components/music/MiniPlayer";
import RuffyFab from "@/components/shared/RuffyFab";
import SparkleButton from "@/components/music/SparkleButton";
import Toast from "@/components/ui/Toast";
import CreateMenu from "@/components/create/CreateMenu";

/* ─── Bottom nav tabs — matches the app ─── */
const TABS = [
  {
    label: "Home",
    href: "/home",
    icon: (a: boolean) => (
      <svg className="w-6 h-6" fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={a ? 0 : 1.6}>
        {a ? (
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
        ) : (
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    ),
  },
  {
    label: "Music",
    href: "/discover",
    icon: (a: boolean) => (
      <svg className="w-6 h-6" fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={a ? 0 : 1.6}>
        {a ? (
          <><circle cx="8" cy="18" r="4" /><circle cx="18" cy="16" r="3" /><path d="M12 18V5l8-2v13" /></>
        ) : (
          <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    ),
  },
  {
    label: "", // Center action button placeholder
    href: "/upload/track",
    isAction: true,
    icon: (_a: boolean) => (
      <div className="w-12 h-12 -mt-4 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 active:scale-95 transition-transform">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    ),
  },
  {
    label: "Feed",
    href: "/feed",
    icon: (a: boolean) => (
      <svg className="w-6 h-6" fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={a ? 0 : 1.6}>
        {a ? (
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        ) : (
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    ),
  },
  {
    label: "Me",
    href: "/me",
    icon: (a: boolean) => (
      <svg className="w-6 h-6" fill={a ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={a ? 0 : 1.6}>
        {a ? (
          <><circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0113 0" /></>
        ) : (
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    ),
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#050510]">
      {/* Page content */}
      <main className="pb-36 max-w-2xl mx-auto">{children}</main>

      {/* Fixed bottom stack: MiniPlayer → BottomNav */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <MiniPlayer />
        <nav className="bg-black/85 backdrop-blur-2xl border-t border-white/[0.06]">
          <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
            {TABS.map((tab) => {
              const isAction = "isAction" in tab && tab.isAction;
              const active = !isAction && (
                pathname === tab.href ||
                (tab.href === "/home" && pathname === "/") ||
                (tab.href === "/feed" && pathname === "/home" && false)
              );

              if (isAction) {
                return (
                  <button
                    key="action"
                    onClick={() => setCreateMenuOpen(true)}
                    className="flex items-center justify-center w-16 h-full"
                  >
                    {tab.icon(false)}
                  </button>
                );
              }

              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors relative",
                    active ? "text-white" : "text-white/35 hover:text-white/55"
                  )}
                >
                  {tab.icon(!!active)}
                  <span className="text-[10px] font-medium">{tab.label}</span>
                  {active && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -top-[1px] w-6 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
      </div>

      {/* Ruffy AI Floating Button */}
      <RuffyFab />

      {/* Create / Upload Menu */}
      <CreateMenu isOpen={createMenuOpen} onClose={() => setCreateMenuOpen(false)} />

      {/* Global toast notifications */}
      <Toast />
    </div>
  );
}
