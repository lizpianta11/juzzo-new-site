"use client";

import { useState } from "react";
import { useDemo } from "@/providers/DemoProvider";
import { CreateModalShell, FormSection, SettingsRow, TextAreaField, TextField, UploadSurface } from "./CreateFormPrimitives";

interface CreateLongVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

export default function CreateLongVideoModal({ isOpen, onClose, onPublish }: CreateLongVideoModalProps) {
  const { createVideo, showToast } = useDemo();
  const [hasVideo, setHasVideo] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const canPublish = hasVideo && title.trim().length > 0;

  const handleClose = () => {
    setHasVideo(false);
    setTitle("");
    setDescription("");
    setThumbnailUrl("");
    onClose();
  };

  const handlePublish = () => {
    if (!canPublish) return;
    setIsPublishing(true);
    setTimeout(() => {
      createVideo({ title, description, thumbnailUrl });
      setIsPublishing(false);
      handleClose();
      onPublish();
    }, 900);
  };

  return (
    <CreateModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Video"
      canPublish={canPublish}
      isPublishing={isPublishing}
      onPublish={handlePublish}
      accentClassName="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90 active:scale-95"
    >
      <UploadSurface
        onClick={() => {
          setHasVideo(true);
          showToast("Video uploaded 🎬");
        }}
        active={hasVideo}
        idleTitle="Upload a long-form video"
        idleSubtitle="MP4, MOV, WebM • Landscape 16:9"
        accent="from-rose-900/20 to-pink-900/20"
      >
        <div className="aspect-video flex flex-col items-center justify-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <svg className="w-8 h-8 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white/60">studio_session_final.mp4</p>
          <p className="mt-1 text-xs text-white/30">16:9 • 12:34 • 1920×1080 • 248 MB</p>
        </div>
        <button
          onClick={() => setHasVideo(false)}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </UploadSurface>

      <FormSection label="Thumbnail">
        <button
          onClick={() => {
            const next = "https://picsum.photos/seed/juzzo-long-video/960/540";
            setThumbnailUrl(next);
            showToast("Thumbnail selected 🖼️");
          }}
          className="flex aspect-video max-h-28 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.1] transition-colors hover:border-rose-500/30"
        >
          <span className="text-xs text-white/30">{thumbnailUrl ? "Thumbnail ready" : "Add custom thumbnail"}</span>
        </button>
      </FormSection>

      <FormSection label="Title *">
        <TextField value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your video a title" />
      </FormSection>

      <FormSection label="Description">
        <TextAreaField value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell viewers about your video..." className="h-24 focus:border-rose-500/50" />
      </FormSection>

      <div className="space-y-2">
        <SettingsRow label="Visibility" value="Public" icon="🌐" onClick={() => showToast("Visibility settings — demo only")} />
        <SettingsRow label="Comments" value="Enabled" icon="💬" onClick={() => showToast("Comments settings — demo only")} />
        <SettingsRow label="Category" value="Music & Entertainment" icon="🏷️" onClick={() => showToast("Category settings — demo only")} />
      </div>
    </CreateModalShell>
  );
}
