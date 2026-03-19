"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import CreateNoteModal from "./CreateNoteModal";
import CreatePostModal from "./CreatePostModal";
import CreateShortVideoModal from "./CreateShortVideoModal";
import CreateLongVideoModal from "./CreateLongVideoModal";
import CreateStorySnapModal from "./CreateStorySnapModal";
import CreateTrackModal from "./CreateTrackModal";
import CreatePlaylistModal from "./CreatePlaylistModal";

/* ─── Content type definitions ─── */
interface CreateOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
}

const CREATE_OPTIONS: CreateOption[] = [
  {
    id: "note",
    label: "Note",
    description: "Quick text update or chirp",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/25",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    id: "post",
    label: "Post",
    description: "Image or text post",
    gradient: "from-blue-500 to-indigo-500",
    glow: "shadow-blue-500/25",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    id: "short",
    label: "Short Video",
    description: "Vertical short-form clip",
    gradient: "from-cyan-500 to-teal-500",
    glow: "shadow-cyan-500/25",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    id: "longvideo",
    label: "Long Video",
    description: "Landscape or long-form video",
    gradient: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/25",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
      </svg>
    ),
  },
  {
    id: "storysnap",
    label: "Story / Snap",
    description: "Ephemeral photo or video",
    gradient: "from-fuchsia-500 to-cyan-400",
    glow: "shadow-fuchsia-500/25",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9 0 4.45-3.228 8.145-7.473 8.873L12 22.5l-1.527-1.627C6.228 20.145 3 16.45 3 12c0-4.97 4.03-9 9-9z" />
        <circle cx="12" cy="11" r="3.25" />
      </svg>
    ),
  },
  {
    id: "track",
    label: "Music / Track",
    description: "Upload a song or audio",
    gradient: "from-purple-500 to-violet-500",
    glow: "shadow-purple-500/25",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    id: "playlist",
    label: "Playlist",
    description: "Create a new playlist",
    gradient: "from-emerald-500 to-green-500",
    glow: "shadow-emerald-500/25",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
];

/* ─── Otoro AI shortcut ─── */
const OTORO_OPTION = {
  id: "otoro",
  label: "Ask Otoro AI",
  description: "Get help creating content",
  gradient: "from-fuchsia-500 via-purple-500 to-cyan-400",
  glow: "shadow-fuchsia-500/25",
  icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
};

type ActiveModal = "note" | "post" | "short" | "longvideo" | "storysnap" | "track" | "playlist" | null;

interface CreateMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMenu({ isOpen, onClose }: CreateMenuProps) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const handleSelect = (id: string) => {
    if (id === "otoro") {
      // Navigate to Otoro or open Otoro fab — for now close menu
      onClose();
      // Trigger the Otoro chat open event
      window.dispatchEvent(new CustomEvent("open-otoro-chat"));
      return;
    }
    setActiveModal(id as ActiveModal);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handlePublished = () => {
    setActiveModal(null);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !activeModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="create-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Menu panel */}
            <motion.div
              key="create-menu"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 z-[81] mx-auto max-w-lg"
            >
              <div className="mx-3 mb-3 rounded-3xl bg-[#0c0c1a]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">Create</h2>
                    <p className="text-xs text-white/40 mt-0.5">What do you want to share?</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Drag handle */}
                <div className="flex justify-center pb-2">
                  <div className="w-10 h-1 rounded-full bg-white/[0.08]" />
                </div>

                {/* Options grid */}
                <div className="px-4 pb-2 grid grid-cols-3 gap-2.5">
                  {CREATE_OPTIONS.map((option, i) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      onClick={() => handleSelect(option.id)}
                      className={cn(
                        "group relative flex flex-col items-center gap-2.5 rounded-2xl p-4 transition-all duration-200",
                        "bg-white/[0.03] hover:bg-white/[0.07] active:scale-95",
                        "border border-transparent hover:border-white/[0.08]"
                      )}
                    >
                      {/* Icon circle */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-shadow",
                        `bg-gradient-to-br ${option.gradient}`,
                        `group-hover:${option.glow} group-hover:shadow-lg`
                      )}>
                        {option.icon}
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-white/90 leading-tight">{option.label}</p>
                        <p className="text-[10px] text-white/35 mt-0.5 leading-tight">{option.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Otoro AI divider + shortcut */}
                <div className="px-4 pb-4 pt-1">
                  <div className="h-px bg-white/[0.06] mb-3" />
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    onClick={() => handleSelect("otoro")}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-200",
                      "bg-gradient-to-r from-fuchsia-500/[0.08] to-cyan-400/[0.08]",
                      "hover:from-fuchsia-500/[0.14] hover:to-cyan-400/[0.14]",
                      "border border-white/[0.06] hover:border-white/[0.1]",
                      "active:scale-[0.98]"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0",
                      `bg-gradient-to-br ${OTORO_OPTION.gradient}`
                    )}>
                      {OTORO_OPTION.icon}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-white/90">{OTORO_OPTION.label}</p>
                      <p className="text-[11px] text-white/35">{OTORO_OPTION.description}</p>
                    </div>
                    <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </motion.button>
                </div>

                {/* Safe area spacer */}
                <div className="h-[env(safe-area-inset-bottom)]" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Individual creation modals ─── */}
      <CreateNoteModal isOpen={activeModal === "note"} onClose={handleCloseModal} onPublish={handlePublished} />
      <CreatePostModal isOpen={activeModal === "post"} onClose={handleCloseModal} onPublish={handlePublished} />
      <CreateShortVideoModal isOpen={activeModal === "short"} onClose={handleCloseModal} onPublish={handlePublished} />
      <CreateLongVideoModal isOpen={activeModal === "longvideo"} onClose={handleCloseModal} onPublish={handlePublished} />
      <CreateStorySnapModal isOpen={activeModal === "storysnap"} onClose={handleCloseModal} onPublish={handlePublished} />
      <CreateTrackModal isOpen={activeModal === "track"} onClose={handleCloseModal} onPublish={handlePublished} />
      <CreatePlaylistModal isOpen={activeModal === "playlist"} onClose={handleCloseModal} onPublish={handlePublished} />
    </>
  );
}
