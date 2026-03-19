"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useDemo } from "@/providers/DemoProvider";
import { CreateModalShell, FormSection, SettingsRow, TextAreaField, UploadSurface } from "./CreateFormPrimitives";

interface CreateStorySnapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

const MODES = [
  { key: "story", label: "Story", description: "Visible to followers for 24 hours", accent: "from-pink-500 to-orange-500" },
  { key: "snap", label: "Snap", description: "Fast, ephemeral share for close contacts", accent: "from-cyan-500 to-blue-500" },
] as const;

type ModeKey = (typeof MODES)[number]["key"];

export default function CreateStorySnapModal({ isOpen, onClose, onPublish }: CreateStorySnapModalProps) {
  const { createStory, showToast } = useDemo();
  const [mode, setMode] = useState<ModeKey>("story");
  const [hasMedia, setHasMedia] = useState(false);
  const [caption, setCaption] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const activeMode = MODES.find((item) => item.key === mode)!;
  const canPublish = hasMedia;

  const handleClose = () => {
    setMode("story");
    setHasMedia(false);
    setCaption("");
    onClose();
  };

  const handlePublish = () => {
    if (!canPublish) return;
    setIsPublishing(true);
    setTimeout(() => {
      createStory({ caption, mode });
      setIsPublishing(false);
      handleClose();
      onPublish();
    }, 700);
  };

  return (
    <CreateModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Story / Snap"
      publishLabel={mode === "snap" ? "Send" : "Post"}
      canPublish={canPublish}
      isPublishing={isPublishing}
      onPublish={handlePublish}
      accentClassName={cn("text-white hover:opacity-90 active:scale-95", `bg-gradient-to-r ${activeMode.accent}`)}
    >
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.03] p-1">
        {MODES.map((item) => (
          <button
            key={item.key}
            onClick={() => setMode(item.key)}
            className={cn(
              "rounded-2xl px-4 py-3 text-left transition",
              mode === item.key ? `bg-gradient-to-r ${item.accent} text-white` : "text-white/45 hover:bg-white/[0.04]"
            )}
          >
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-1 text-[11px] opacity-80">{item.description}</p>
          </button>
        ))}
      </div>

      <UploadSurface
        onClick={() => {
          setHasMedia(true);
          showToast(mode === "snap" ? "Snap media ready 👻" : "Story media ready 📸");
        }}
        active={hasMedia}
        idleTitle={`Add ${mode === "snap" ? "snap" : "story"} media`}
        idleSubtitle="Photo or video • vertical preferred"
        accent="from-fuchsia-900/20 to-cyan-900/20"
        aspectClassName="aspect-[9/14]"
      >
        <div className="aspect-[9/14] flex flex-col items-center justify-center">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl">
            {mode === "snap" ? "👻" : "📸"}
          </div>
          <p className="text-sm font-medium text-white/60">{mode === "snap" ? "night_out_snap.mov" : "tour_story_clip.mp4"}</p>
          <p className="mt-1 text-xs text-white/30">{mode === "snap" ? "Close-friends delivery mock" : "Followers story ring demo"}</p>
        </div>
      </UploadSurface>

      <FormSection label="Caption">
        <TextAreaField value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={mode === "snap" ? "Add a quick note..." : "Say something about this story..."} className="h-20" />
      </FormSection>

      <div className="space-y-2">
        <SettingsRow label="Audience" value={mode === "snap" ? "Close circle" : "Followers"} icon="👥" onClick={() => showToast("Audience controls — demo only")} />
        <SettingsRow label="Expiry" value={mode === "snap" ? "View once" : "24 hours"} icon="⏱️" onClick={() => showToast("Expiry controls — demo only")} />
      </div>
    </CreateModalShell>
  );
}
