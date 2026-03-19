"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SparkleButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3">
      {/* Expanded menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href="/upload/track"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/10 text-white text-sm hover:bg-white/[0.15] transition-colors shadow-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Upload Track
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.05 }}
            >
              <Link
                href="/upload/short"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/10 text-white text-sm hover:bg-white/[0.15] transition-colors shadow-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Upload Short
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main sparkle button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-violet-500 to-cyan-400" />

        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
        />

        {/* Icon */}
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative z-10"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* Sparkle particles */}
        {!open && (
          <>
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                x: [0, -8, 0],
                y: [0, -12, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              style={{ top: 8, right: 10 }}
            />
            <motion.div
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              animate={{
                x: [0, 6, 0],
                y: [0, -10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              style={{ top: 6, left: 12 }}
            />
            <motion.div
              className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full"
              animate={{
                x: [0, -6, 0],
                y: [0, 8, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 1.3 }}
              style={{ bottom: 10, right: 8 }}
            />
          </>
        )}
      </motion.button>
    </div>
  );
}
