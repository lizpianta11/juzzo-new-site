"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** height class — defaults to h-[70vh] */
  heightClass?: string;
}

export default function BottomSheet({ open, onClose, title, children, heightClass = "h-[70vh]" }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className={`absolute bottom-0 left-0 right-0 ${heightClass} max-h-[90vh] bg-[#0c0c1a] border-t border-white/[0.08] rounded-t-3xl flex flex-col overflow-hidden`}
      >
        {/* Drag handle */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/[0.15]" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  );
}
