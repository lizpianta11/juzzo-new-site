"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useDemo } from "@/providers/DemoProvider";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onPublish }: CreatePostModalProps) {
  const { currentUser, createPost, showToast } = useDemo();
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const PLACEHOLDER_IMAGES = [
    "https://picsum.photos/seed/j1/600/600",
    "https://picsum.photos/seed/j2/600/600",
    "https://picsum.photos/seed/j3/600/600",
  ];

  const handleAddImage = () => {
    if (images.length >= 10) return;
    const next = PLACEHOLDER_IMAGES[images.length % PLACEHOLDER_IMAGES.length];
    setImages((prev) => [...prev, next]);
    showToast("Image added 📸");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!caption.trim() && images.length === 0) return;
    setIsPublishing(true);
    setTimeout(() => {
      createPost({ body: caption, images });
      setCaption("");
      setImages([]);
      setIsPublishing(false);
      onPublish();
    }, 900);
  };

  const handleClose = () => {
    setCaption("");
    setImages([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="fixed inset-x-4 top-[6%] z-[91] mx-auto max-w-lg max-h-[88vh] flex flex-col"
          >
            <div className="rounded-3xl bg-[#0c0c1a]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col max-h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
                <button onClick={handleClose} className="text-sm text-white/50 hover:text-white/80 transition-colors font-medium">
                  Cancel
                </button>
                <h3 className="text-sm font-bold text-white">New Post</h3>
                <button
                  onClick={handlePublish}
                  disabled={(!caption.trim() && images.length === 0) || isPublishing}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                    caption.trim() || images.length > 0
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 active:scale-95"
                      : "bg-white/[0.06] text-white/25 cursor-not-allowed"
                  )}
                >
                  {isPublishing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Post"
                  )}
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {/* Image section */}
                <div className="p-4">
                  {images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {images.length < 10 && (
                        <button
                          onClick={handleAddImage}
                          className="aspect-square rounded-xl border-2 border-dashed border-white/[0.1] hover:border-white/[0.2] flex flex-col items-center justify-center gap-1 transition-colors"
                        >
                          <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          <span className="text-[10px] text-white/25">Add</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleAddImage}
                      className="w-full aspect-[16/10] rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-blue-500/40 hover:bg-blue-500/[0.04] flex flex-col items-center justify-center gap-2 transition-all mb-4"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-white/40">Tap to add photos</p>
                      <p className="text-[11px] text-white/20">JPG, PNG, WebP — up to 10 images</p>
                    </button>
                  )}
                </div>

                {/* Caption composer */}
                <div className="px-4 pb-4">
                  <div className="flex gap-3">
                    <img
                      src={currentUser.avatar_url || ""}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-white/[0.06] flex-shrink-0"
                    />
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      className="w-full bg-transparent text-white text-[15px] placeholder-white/25 resize-none outline-none min-h-[80px] leading-relaxed"
                    />
                  </div>
                </div>

                {/* Extras */}
                <div className="px-4 pb-4 space-y-2">
                  {[
                    { label: "Add Location", icon: "📍" },
                    { label: "Tag People", icon: "👥" },
                    { label: "Link a Track", icon: "🎵" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => showToast(`${item.label} — coming soon`)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] transition-colors"
                    >
                      <span className="text-sm text-white/60 flex items-center gap-2">
                        <span>{item.icon}</span>
                        {item.label}
                      </span>
                      <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
