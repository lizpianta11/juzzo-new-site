"use client";

import { useState } from "react";
import { GENRES } from "@/lib/utils/constants";

export default function UploadTrackPage() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold text-white mb-2">Upload Track</h1>
      <p className="text-white/40 text-sm mb-8">
        Share your music with the Juzzo universe
      </p>

      <form className="space-y-6">
        {/* Audio file drop */}
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
            dragActive
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/10 hover:border-white/20"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎵</span>
          </div>
          <p className="text-white/60 text-sm">
            Drag & drop your audio file here
          </p>
          <p className="text-white/30 text-xs mt-2">
            MP3, WAV, M4A, or FLAC
          </p>
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">Title</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Track title"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Artist Name</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Your artist name"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Genre</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors">
              <option value="" className="bg-black">Select genre</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre} className="bg-black">
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Cover Image</label>
            <div className="border border-dashed border-white/10 rounded-xl p-6 text-center hover:border-white/20 transition-colors cursor-pointer">
              <p className="text-white/40 text-sm">Click to upload cover art</p>
              <p className="text-white/20 text-xs mt-1">JPG, PNG, or WebP</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Publish Track
        </button>
      </form>
    </div>
  );
}
