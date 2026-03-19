"use client";

import { useState } from "react";

export default function UploadShortPage() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold text-white mb-2">Upload Short</h1>
      <p className="text-white/40 text-sm mb-8">
        Share a short video with the community
      </p>

      <form className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
            dragActive
              ? "border-cyan-500 bg-cyan-500/10"
              : "border-white/10 hover:border-white/20"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📹</span>
          </div>
          <p className="text-white/60 text-sm">Drag & drop your video here</p>
          <p className="text-white/30 text-xs mt-2">MP4, MOV, or WebM</p>
        </div>

        <div>
          <label className="block text-white/60 text-sm mb-2">Caption</label>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-cyan-500 focus:outline-none transition-colors resize-none h-24"
            placeholder="Write a caption..."
          />
        </div>

        <div>
          <label className="block text-white/60 text-sm mb-2">Link a Song (optional)</label>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-cyan-500 focus:outline-none transition-colors"
            placeholder="Search for a track..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Publish Short
        </button>
      </form>
    </div>
  );
}
