"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const TABS = [
  {
    label: "Home",
    href: "/discover",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.8}>
        {active ? (
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
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.8}>
        {active ? (
          <>
            <circle cx="8" cy="18" r="4" />
            <circle cx="18" cy="16" r="3" />
            <path d="M12 18V5l8-2v13" />
          </>
        ) : (
          <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    ),
    isActive: true,
  },
  {
    label: "Feed",
    href: "/feed",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.8}>
        {active ? (
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        ) : (
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    ),
  },
  {
    label: "Me",
    href: "/profile/me",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.8}>
        {active ? (
          <>
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0113 0" />
          </>
        ) : (
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-black/70 backdrop-blur-2xl border-t border-white/[0.06]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {TABS.map((tab) => {
          const active = tab.isActive || pathname === tab.href;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors relative",
                active ? "text-white" : "text-white/40 hover:text-white/60"
              )}
            >
              {tab.icon(active)}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-[1px] w-5 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area bottom for mobile */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
