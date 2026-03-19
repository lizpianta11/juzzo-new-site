"use client";

import { useState } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { useDemo } from "@/providers/DemoProvider";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  /** The URL or path to share */
  url?: string;
  title?: string;
}

const SHARE_OPTIONS = [
  { icon: "📋", label: "Copy link", action: "copy" },
  { icon: "💬", label: "Send via DM", action: "dm" },
  { icon: "📱", label: "Share to story", action: "story" },
  { icon: "🐦", label: "Twitter / X", action: "twitter" },
  { icon: "📸", label: "Instagram", action: "instagram" },
  { icon: "💌", label: "iMessage", action: "imessage" },
  { icon: "📧", label: "Email", action: "email" },
  { icon: "⋯", label: "More options", action: "more" },
];

export default function ShareModal({ open, onClose, url, title }: ShareModalProps) {
  const { showToast } = useDemo();
  const [copied, setCopied] = useState(false);
  const shareUrl = url || `https://juzzo.app${typeof window !== "undefined" ? window.location.pathname : ""}`;

  const handleAction = async (action: string) => {
    if (action === "copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        showToast("Link copied! 🔗");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        showToast("Link copied! 🔗");
      }
      return;
    }

    if (action === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title || "Check this out on Juzzo!")}&url=${encodeURIComponent(shareUrl)}`, "_blank");
      onClose();
      return;
    }

    if (action === "email") {
      window.open(`mailto:?subject=${encodeURIComponent(title || "Check this out on Juzzo!")}&body=${encodeURIComponent(shareUrl)}`, "_blank");
      onClose();
      return;
    }

    if (action === "more") {
      if (navigator.share) {
        try {
          await navigator.share({ title: title || "Juzzo", url: shareUrl });
          onClose();
        } catch {
          // user cancelled
        }
      } else {
        showToast("Share sheet not available on this device");
      }
      return;
    }

    // DM, story, instagram, imessage — mock
    showToast(`Shared via ${action}! 🚀`);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Share" heightClass="h-auto">
      <div className="p-4 space-y-4 pb-8">
        {/* URL preview */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.354a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.5 8.7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{title || "Juzzo"}</p>
            <p className="text-[10px] text-white/35 truncate">{shareUrl}</p>
          </div>
        </div>

        {/* Share options grid */}
        <div className="grid grid-cols-4 gap-3">
          {SHARE_OPTIONS.map((opt) => (
            <button
              key={opt.action}
              onClick={() => handleAction(opt.action)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/[0.06] transition group"
            >
              <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-xl group-hover:bg-white/[0.1] transition">
                {opt.action === "copy" && copied ? "✅" : opt.icon}
              </div>
              <span className="text-[10px] text-white/50 font-medium text-center leading-tight">
                {opt.action === "copy" && copied ? "Copied!" : opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
