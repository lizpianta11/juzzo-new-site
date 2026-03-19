"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemo } from "@/providers/DemoProvider";
import { cn } from "@/lib/utils/cn";

/* ─── Types ─── */
interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const TABS = [
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "details", label: "Details", icon: "📝" },
  { key: "genres", label: "Genres", icon: "🎵" },
  { key: "appearance", label: "Appearance", icon: "🎨" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const ALL_GENRES = [
  "Pop", "Hip-Hop", "R&B", "Electronic", "Lo-Fi", "Afrobeats", "K-Pop",
  "Latin", "Rock", "Indie", "Jazz", "Classical", "Country", "Reggaeton",
  "Dream Pop", "Alt R&B", "Synthwave", "House", "Techno", "Ambient",
  "Folk", "Metal", "Punk", "Soul", "Funk", "Gospel", "Blues",
];

const PRONOUN_OPTIONS = ["", "she/her", "he/him", "they/them", "she/they", "he/they", "any/all", "ask me"];

/* ─── Camera icon SVG ─── */
function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  );
}

/* ─── Shared input wrapper ─── */
function FieldLabel({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-xs font-medium text-white/40 uppercase tracking-wide">{label}</label>
        {optional && <span className="text-[10px] text-white/20 font-normal normal-case tracking-normal">Optional</span>}
      </div>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  prefix,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  maxLength?: number;
}) {
  return (
    <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-purple-500/50 transition-shadow">
      {prefix && <span className="pl-4 text-sm text-white/30 flex-shrink-0">{prefix}</span>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          "flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none",
          prefix ? "px-1" : "px-4"
        )}
      />
      {maxLength && (
        <span className="pr-3 text-[10px] text-white/20 flex-shrink-0">{value.length}/{maxLength}</span>
      )}
    </div>
  );
}

/* ─── Main Modal ─── */
export default function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { currentUser, updateProfile, showToast } = useDemo();
  const [tab, setTab] = useState<TabKey>("profile");

  // Profile fields
  const [displayName, setDisplayName] = useState(currentUser.display_name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url || "");
  const [bannerUrl, setBannerUrl] = useState(currentUser.banner_url || "");

  // Details
  const [pronouns, setPronouns] = useState(currentUser.pronouns || "");
  const [website, setWebsite] = useState(currentUser.website || "");
  const [location, setLocation] = useState(currentUser.location || "");

  // Genres
  const [selectedGenres, setSelectedGenres] = useState<string[]>(currentUser.genres || []);

  // Appearance
  const [accentColor, setAccentColor] = useState(currentUser.accent_color || "purple");

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const toggleGenre = useCallback((genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : prev.length >= 8
          ? prev
          : [...prev, genre]
    );
  }, []);

  if (!open) return null;

  const hasChanges =
    displayName !== currentUser.display_name ||
    username !== currentUser.username ||
    bio !== (currentUser.bio || "") ||
    avatarUrl !== (currentUser.avatar_url || "") ||
    bannerUrl !== (currentUser.banner_url || "") ||
    pronouns !== (currentUser.pronouns || "") ||
    website !== (currentUser.website || "") ||
    location !== (currentUser.location || "") ||
    JSON.stringify(selectedGenres) !== JSON.stringify(currentUser.genres || []) ||
    accentColor !== (currentUser.accent_color || "purple");

  const handleSave = () => {
    if (!displayName.trim()) {
      showToast("Display name is required");
      return;
    }
    if (!username.trim()) {
      showToast("Username is required");
      return;
    }
    updateProfile({
      display_name: displayName.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""),
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      banner_url: bannerUrl.trim() || null,
      pronouns: pronouns || null,
      website: website.trim() || null,
      location: location.trim() || null,
      genres: selectedGenres,
      accent_color: accentColor,
    });
    onClose();
  };

  const handleDiscard = () => {
    setDisplayName(currentUser.display_name);
    setUsername(currentUser.username);
    setBio(currentUser.bio || "");
    setAvatarUrl(currentUser.avatar_url || "");
    setBannerUrl(currentUser.banner_url || "");
    setPronouns(currentUser.pronouns || "");
    setWebsite(currentUser.website || "");
    setLocation(currentUser.location || "");
    setSelectedGenres(currentUser.genres || []);
    setAccentColor(currentUser.accent_color || "purple");
    onClose();
  };

  const handleFileSelect = (type: "avatar" | "banner") => {
    // In demo mode, cycle through placeholder images
    if (type === "avatar") {
      const id = Math.floor(Math.random() * 70) + 1;
      setAvatarUrl(`https://i.pravatar.cc/150?img=${id}`);
      showToast("Profile photo updated!");
    } else {
      const seed = Math.floor(Math.random() * 1000);
      setBannerUrl(`https://picsum.photos/seed/${seed}/1200/400`);
      showToast("Banner updated!");
    }
  };

  const avatarPreview = avatarUrl || "https://i.pravatar.cc/120";

  const ACCENT_COLORS = [
    { key: "purple", bg: "bg-purple-500", ring: "ring-purple-400" },
    { key: "cyan", bg: "bg-cyan-500", ring: "ring-cyan-400" },
    { key: "pink", bg: "bg-pink-500", ring: "ring-pink-400" },
    { key: "blue", bg: "bg-blue-500", ring: "ring-blue-400" },
    { key: "emerald", bg: "bg-emerald-500", ring: "ring-emerald-400" },
    { key: "amber", bg: "bg-amber-500", ring: "ring-amber-400" },
    { key: "red", bg: "bg-red-500", ring: "ring-red-400" },
    { key: "indigo", bg: "bg-indigo-500", ring: "ring-indigo-400" },
  ];

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleDiscard}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        className="absolute inset-x-4 top-[5%] max-w-xl mx-auto bg-[#0c0c1a] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
          <button onClick={handleDiscard} className="text-sm text-white/50 hover:text-white transition">
            Cancel
          </button>
          <h3 className="text-base font-semibold text-white">Edit Profile</h3>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-semibold transition",
              hasChanges
                ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90"
                : "bg-white/[0.06] text-white/25 cursor-not-allowed"
            )}
          >
            Save
          </button>
        </div>

        {/* Banner + Avatar */}
        <div className="flex-shrink-0">
          {/* Banner */}
          <div
            onClick={() => handleFileSelect("banner")}
            className="relative h-28 overflow-hidden group cursor-pointer"
          >
            {bannerUrl ? (
              <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-[#0c0c1a] to-cyan-900/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <CameraIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" />
          </div>

          {/* Avatar */}
          <div className="flex justify-center -mt-12 relative z-10">
            <div
              onClick={() => handleFileSelect("avatar")}
              className="relative group cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 p-[2.5px] shadow-xl shadow-purple-500/20">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0c0c1a]">
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition">
                <CameraIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition" />
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" />
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/[0.06] px-2 flex-shrink-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 py-3 text-xs font-semibold transition-colors relative flex items-center justify-center gap-1.5",
                tab === t.key ? "text-white" : "text-white/35 hover:text-white/55"
              )}
            >
              <span className="text-sm">{t.icon}</span>
              {t.label}
              {tab === t.key && (
                <motion.div
                  layoutId="editTabIndicator"
                  className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content — scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait">
            {/* ─── Profile Tab ─── */}
            {tab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="p-5 space-y-5"
              >
                <FieldLabel label="Display Name">
                  <TextInput value={displayName} onChange={setDisplayName} placeholder="Your name" maxLength={50} />
                </FieldLabel>

                <FieldLabel label="Username">
                  <TextInput value={username} onChange={setUsername} prefix="@" placeholder="username" maxLength={30} />
                  <p className="text-[10px] text-white/20 mt-1.5">Only lowercase letters, numbers, and underscores</p>
                </FieldLabel>

                <FieldLabel label="Bio">
                  <div className="relative">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      maxLength={160}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none transition-shadow"
                      placeholder="Tell the world about yourself..."
                    />
                    <p className="text-right text-[10px] text-white/20 mt-1">{bio.length}/160</p>
                  </div>
                </FieldLabel>

                <FieldLabel label="Avatar URL" optional>
                  <TextInput value={avatarUrl} onChange={setAvatarUrl} placeholder="https://..." />
                  <p className="text-[10px] text-white/20 mt-1.5">Or click the avatar above to pick a random one</p>
                </FieldLabel>

                <FieldLabel label="Banner URL" optional>
                  <TextInput value={bannerUrl} onChange={setBannerUrl} placeholder="https://..." />
                  <p className="text-[10px] text-white/20 mt-1.5">Or click the banner above to pick a random one</p>
                </FieldLabel>
              </motion.div>
            )}

            {/* ─── Details Tab ─── */}
            {tab === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="p-5 space-y-5"
              >
                <FieldLabel label="Pronouns" optional>
                  <div className="flex flex-wrap gap-2">
                    {PRONOUN_OPTIONS.map((p) => (
                      <button
                        key={p || "none"}
                        onClick={() => setPronouns(p)}
                        className={cn(
                          "px-3.5 py-2 rounded-full text-xs font-medium border transition-all",
                          pronouns === p
                            ? "border-purple-400/40 bg-purple-500/20 text-purple-100 shadow-sm shadow-purple-500/10"
                            : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70"
                        )}
                      >
                        {p || "None"}
                      </button>
                    ))}
                  </div>
                </FieldLabel>

                <FieldLabel label="Website" optional>
                  <TextInput value={website} onChange={setWebsite} placeholder="yoursite.com" prefix="🔗" />
                </FieldLabel>

                <FieldLabel label="Location" optional>
                  <TextInput value={location} onChange={setLocation} placeholder="City, Country" prefix="📍" />
                </FieldLabel>

                {/* Info cards */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-sm">
                      ℹ️
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/60">Profile visibility</p>
                      <p className="text-[11px] text-white/30">Details are shown on your public profile</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center text-sm">
                      ✅
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/60">Verification</p>
                      <p className="text-[11px] text-white/30">{currentUser.is_verified ? "Your account is verified ✓" : "Not yet verified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-sm">
                      📅
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/60">Member since</p>
                      <p className="text-[11px] text-white/30">{new Date(currentUser.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Genres Tab ─── */}
            {tab === "genres" && (
              <motion.div
                key="genres"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="p-5 space-y-5"
              >
                <div>
                  <p className="text-sm font-medium text-white/60 mb-1">Select your music genres</p>
                  <p className="text-xs text-white/25 mb-4">Choose up to 8 genres that define your sound. These appear on your profile and shape your globe discovery.</p>

                  <div className="flex flex-wrap gap-2">
                    {ALL_GENRES.map((genre) => {
                      const selected = selectedGenres.includes(genre);
                      return (
                        <button
                          key={genre}
                          onClick={() => toggleGenre(genre)}
                          className={cn(
                            "px-3.5 py-2 rounded-full text-xs font-medium border transition-all",
                            selected
                              ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-100 shadow-sm shadow-cyan-500/10"
                              : "border-white/[0.08] bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white/65"
                          )}
                        >
                          {selected && <span className="mr-1">✓</span>}
                          {genre}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-white/25 mt-3">
                    {selectedGenres.length}/8 selected
                    {selectedGenres.length >= 8 && <span className="text-amber-400/60 ml-2">Maximum reached</span>}
                  </p>
                </div>

                {selectedGenres.length > 0 && (
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wide mb-3">Your genres</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedGenres.map((genre) => (
                        <span
                          key={genre}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xs font-medium text-cyan-100"
                        >
                          {genre}
                          <button
                            onClick={() => toggleGenre(genre)}
                            className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition text-[9px] text-white/60"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Appearance Tab ─── */}
            {tab === "appearance" && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="p-5 space-y-6"
              >
                {/* Accent color */}
                <FieldLabel label="Accent Color">
                  <p className="text-xs text-white/25 mb-3">Customize your profile gradient accent</p>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setAccentColor(c.key)}
                        className={cn(
                          "w-10 h-10 rounded-full transition-all",
                          c.bg,
                          accentColor === c.key
                            ? `ring-2 ${c.ring} ring-offset-2 ring-offset-[#0c0c1a] scale-110`
                            : "opacity-60 hover:opacity-90 hover:scale-105"
                        )}
                      />
                    ))}
                  </div>
                </FieldLabel>

                {/* Profile preview */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wide px-4 pt-4 pb-2">Preview</p>
                  <div className="relative">
                    <div className="h-16 bg-gradient-to-br from-purple-900/40 via-[#0c0c1a] to-cyan-900/30 overflow-hidden">
                      {bannerUrl && <img src={bannerUrl} alt="" className="w-full h-full object-cover opacity-70" />}
                    </div>
                    <div className="flex items-end gap-3 px-4 -mt-5 pb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 p-[2px] flex-shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#0c0c1a]">
                          <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="min-w-0 pb-0.5">
                        <p className="text-sm font-bold text-white truncate">{displayName || "Your Name"}</p>
                        <p className="text-[11px] text-white/35">@{username || "username"}</p>
                      </div>
                    </div>
                    {bio && <p className="text-xs text-white/50 px-4 pb-3 -mt-1 line-clamp-2">{bio}</p>}
                    <div className="flex items-center gap-3 px-4 pb-4 text-[11px] text-white/30">
                      {location && <span className="flex items-center gap-1">📍 {location}</span>}
                      {website && <span className="flex items-center gap-1">🔗 {website}</span>}
                      {pronouns && <span className="flex items-center gap-1">· {pronouns}</span>}
                    </div>
                    {selectedGenres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 px-4 pb-4">
                        {selectedGenres.slice(0, 4).map((g) => (
                          <span key={g} className="px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/10 text-[10px] text-cyan-200/60">{g}</span>
                        ))}
                        {selectedGenres.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-[10px] text-white/25">+{selectedGenres.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Danger zone */}
                <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-4">
                  <p className="text-xs font-medium text-red-300/60 uppercase tracking-wide mb-3">Danger Zone</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => showToast("Deactivation flow coming soon")}
                      className="w-full text-left px-4 py-3 rounded-xl border border-red-500/10 bg-red-500/[0.05] text-sm text-red-200/60 hover:bg-red-500/10 hover:text-red-200/80 transition"
                    >
                      Deactivate account
                    </button>
                    <button
                      onClick={() => showToast("Account deletion coming soon")}
                      className="w-full text-left px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] text-sm text-red-200/70 hover:bg-red-500/15 hover:text-red-200 transition font-medium"
                    >
                      Delete account permanently
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with unsaved indicator */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-[#0c0c1a] flex-shrink-0"
          >
            <p className="text-xs text-amber-400/60 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              Unsaved changes
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDiscard}
                className="px-3 py-1.5 rounded-full text-xs text-white/40 hover:text-white/60 transition"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-xs font-semibold text-white hover:opacity-90 transition"
              >
                Save changes
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
