"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Discover", href: "/discover", icon: "🌍" },
  { label: "Feed", href: "/feed", icon: "📹" },
  { label: "Upload", href: "/upload/track", icon: "🎵" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-black/50 backdrop-blur-xl border-r border-white/5 flex flex-col z-30">
      {/* Logo */}
      <div className="p-6">
        <Link href="/discover" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
            J
          </div>
          <span className="text-white font-bold text-xl hidden lg:block">
            Juzzo
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
