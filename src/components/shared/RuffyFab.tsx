"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RuffyChat from "@/components/shared/RuffyChat";

export default function RuffyFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[7rem] right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 active:scale-95 transition-transform"
        aria-label="Chat with Otoro AI Assistant"
      >
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      </button>

      {/* Chat overlay */}
      <AnimatePresence>
        {open && <RuffyChat onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
