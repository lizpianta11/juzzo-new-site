"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDemo } from "@/providers/DemoProvider";

export default function Toast() {
  const { toast } = useDemo();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="fixed bottom-44 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full bg-white/[0.12] backdrop-blur-2xl border border-white/[0.1] text-sm font-medium text-white shadow-2xl shadow-black/30"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
