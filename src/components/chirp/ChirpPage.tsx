"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useDemo } from "@/providers/DemoProvider";
import { usePlayer } from "@/providers/PlayerProvider";
import { DEMO_CONVERSATIONS, DEMO_MESSAGES } from "@/lib/chirp-data";
import { DEMO_PROFILES } from "@/lib/demo-data";
import type { ChirpConversation, ChirpMessage } from "@/types";

const CURRENT_USER_ID = "u1";
const REACTION_EMOJIS = ["❤️", "🔥", "😂", "👀", "👍", "💜"];
const QUICK_REPLIES = [
  "Sounds good, let's do it.",
  "Sending details now.",
  "I'm into this idea.",
  "Give me an hour and I'll lock it in.",
];
const ONLINE_IDS = ["u2", "u5", "u9", "u13"];

function relativeTime(dateStr: string): string {
  const now = new Date("2026-03-18T12:00:00Z");
  const date = new Date(dateStr);
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function demoTimestamp(seed: number): string {
  return `2026-03-18T12:${String(seed % 60).padStart(2, "0")}:00Z`;
}

function cloneConversations(): ChirpConversation[] {
  return DEMO_CONVERSATIONS.map((conversation) => ({ ...conversation, participants: [...conversation.participants] }));
}

function cloneMessages(): Record<string, ChirpMessage[]> {
  return Object.fromEntries(
    Object.entries(DEMO_MESSAGES).map(([conversationId, messages]) => [
      conversationId,
      messages.map((message) => ({ ...message, reactions: [...message.reactions] })),
    ])
  );
}

function conversationPreview(message: ChirpMessage | undefined, currentUserId: string): string {
  if (!message) return "Start a conversation";
  let preview = "";
  switch (message.type) {
    case "text":
      preview = message.text || "";
      break;
    case "image":
      preview = "Photo";
      break;
    case "voice":
      preview = `Voice · ${formatDuration(message.voiceDuration || 0)}`;
      break;
    case "snap":
      preview = "Snap";
      break;
    case "shared-track":
      preview = `Track · ${message.sharedTrack?.title || "Untitled"}`;
      break;
    case "shared-post":
      preview = "Shared a post";
      break;
    case "shared-short":
      preview = "Shared a short";
      break;
    case "shared-profile":
      preview = `Profile · ${message.sharedProfile?.display_name || "Creator"}`;
      break;
    default:
      preview = message.text || "Message";
  }
  return message.senderId === currentUserId ? `You: ${preview}` : preview;
}

function ConversationRow({
  conversation,
  active,
  onOpen,
  onPin,
  onMute,
  onDelete,
}: {
  conversation: ChirpConversation;
  active: boolean;
  onOpen: () => void;
  onPin: () => void;
  onMute: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const participant = conversation.participants[0];

  return (
    <div className="relative group" onMouseLeave={() => setMenuOpen(false)}>
      <button
        onClick={onOpen}
        className={cn(
          "relative flex w-full items-center gap-3 px-4 py-3 text-left transition",
          active ? "bg-gradient-to-r from-purple-500/[0.10] to-transparent" : "hover:bg-white/[0.03]"
        )}
      >
        {active && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b from-purple-500 to-cyan-400" />}
        <div className="relative">
          <img src={participant.avatar_url || `https://i.pravatar.cc/48?u=${participant.id}`} alt={participant.display_name} className="h-12 w-12 rounded-full object-cover" />
          {ONLINE_IDS.includes(participant.id) && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#050510] bg-emerald-400" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className={cn("truncate text-sm font-semibold", conversation.unreadCount > 0 ? "text-white" : "text-white/80")}>
              {participant.display_name}
            </p>
            <p className={cn("text-[11px]", conversation.unreadCount > 0 ? "text-purple-300" : "text-white/20")}>
              {conversation.lastMessage ? relativeTime(conversation.lastMessage.createdAt) : ""}
            </p>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className={cn("truncate text-[13px]", conversation.unreadCount > 0 ? "text-white/65" : "text-white/30")}>
              {conversationPreview(conversation.lastMessage, CURRENT_USER_ID)}
            </p>
            <div className="flex items-center gap-1.5">
              {conversation.isPinned && <span className="text-xs text-white/20">📌</span>}
              {conversation.isMuted && <span className="text-xs text-white/20">🔕</span>}
              {conversation.unreadCount > 0 && (
                <span className="min-w-5 rounded-full bg-purple-500 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
      <button
        onClick={() => setMenuOpen((value) => !value)}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/[0.08] bg-[#0c0c1a] p-1.5 text-white/35 transition group-hover:block"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="6" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="18" r="2" />
        </svg>
      </button>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            className="absolute right-3 top-full z-20 mt-1 w-44 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#14142a]"
          >
            <button onClick={() => { onPin(); setMenuOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-white/65 hover:bg-white/[0.04] hover:text-white transition">
              {conversation.isPinned ? "Unpin conversation" : "Pin conversation"}
            </button>
            <button onClick={() => { onMute(); setMenuOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-white/65 hover:bg-white/[0.04] hover:text-white transition">
              {conversation.isMuted ? "Unmute" : "Mute"}
            </button>
            <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm text-red-300/80 hover:bg-red-500/[0.05] hover:text-red-200 transition">
              Delete chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageBubble({
  message,
  own,
  onReact,
  onPlayTrack,
}: {
  message: ChirpMessage;
  own: boolean;
  onReact: (emoji: string) => void;
  onPlayTrack: (message: ChirpMessage) => void;
}) {
  return (
    <div className={cn("flex", own ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[84%] rounded-3xl px-4 py-3", own ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white" : "border border-white/[0.06] bg-white/[0.04] text-white")}>
        {message.type === "image" && message.imageUrl && (
          <img src={message.imageUrl} alt="" className="mb-3 h-48 w-full rounded-2xl object-cover" />
        )}
        {message.type === "voice" && (
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-black/20 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">🎙️</div>
            <div>
              <p className="text-sm font-medium">Voice note</p>
              <p className="text-xs text-white/70">{formatDuration(message.voiceDuration || 0)}</p>
            </div>
          </div>
        )}
        {message.type === "snap" && (
          <div className="mb-2 rounded-2xl bg-black/20 px-3 py-2 text-sm">
            Snap expires after viewing {message.expiresAfter || 0}s
          </div>
        )}
        {message.sharedTrack && (
          <button onClick={() => onPlayTrack(message)} className="mb-2 flex w-full items-center gap-3 rounded-2xl bg-black/20 px-3 py-3 text-left hover:bg-black/30 transition">
            <img src={message.sharedTrack.cover_url || `https://picsum.photos/seed/${message.sharedTrack.id}/80/80`} alt={message.sharedTrack.title} className="h-12 w-12 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{message.sharedTrack.title}</p>
              <p className="truncate text-xs text-white/70">{message.sharedTrack.artist_name}</p>
            </div>
            <span className="text-lg">▶</span>
          </button>
        )}
        {message.sharedProfile && (
          <Link href={`/profile/${message.sharedProfile.id}`} className="mb-2 flex items-center gap-3 rounded-2xl bg-black/20 px-3 py-3 hover:bg-black/30 transition">
            <img src={message.sharedProfile.avatar_url || `https://i.pravatar.cc/40?u=${message.sharedProfile.id}`} alt={message.sharedProfile.display_name} className="h-11 w-11 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{message.sharedProfile.display_name}</p>
              <p className="truncate text-xs text-white/70">@{message.sharedProfile.username}</p>
            </div>
          </Link>
        )}
        {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {message.reactions.map((reaction, index) => (
              <span key={`${reaction.userId}-${reaction.emoji}-${index}`} className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
                {reaction.emoji}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {REACTION_EMOJIS.slice(0, 3).map((emoji) => (
              <button key={emoji} onClick={() => onReact(emoji)} className="rounded-full bg-black/15 px-1.5 py-0.5 text-xs hover:bg-black/25 transition">
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChirpPage() {
  const { showToast } = useDemo();
  const { play } = usePlayer();
  const [conversations, setConversations] = useState<ChirpConversation[]>(() => cloneConversations());
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, ChirpMessage[]>>(() => cloneMessages());
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "pinned">("all");
  const [search, setSearch] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string>(() => DEMO_CONVERSATIONS[0]?.id || "");
  const [draft, setDraft] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);

  const availableProfiles = useMemo(
    () => DEMO_PROFILES.filter((profile) => profile.id !== CURRENT_USER_ID && !conversations.some((conversation) => conversation.participants[0].id === profile.id)),
    [conversations]
  );

  const filteredConversations = useMemo(() => {
    let next = conversations;
    if (activeFilter === "unread") next = next.filter((conversation) => conversation.unreadCount > 0);
    if (activeFilter === "pinned") next = next.filter((conversation) => conversation.isPinned);
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      next = next.filter((conversation) =>
        conversation.participants[0].display_name.toLowerCase().includes(query) ||
        conversation.participants[0].username.toLowerCase().includes(query)
      );
    }
    return [...next].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [activeFilter, conversations, search]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || filteredConversations[0] || null,
    [activeConversationId, conversations, filteredConversations]
  );
  const activeMessages = activeConversation ? messagesByConversation[activeConversation.id] || [] : [];

  const openConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      )
    );
  };

  const updateConversation = (conversationId: string, updater: (conversation: ChirpConversation) => ChirpConversation) => {
    setConversations((current) => current.map((conversation) => (conversation.id === conversationId ? updater(conversation) : conversation)));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((current) => current.filter((conversation) => conversation.id !== conversationId));
    setMessagesByConversation((current) => {
      const next = { ...current };
      delete next[conversationId];
      return next;
    });
    if (activeConversationId === conversationId) {
      const fallback = conversations.find((conversation) => conversation.id !== conversationId);
      setActiveConversationId(fallback?.id || "");
    }
    showToast("Conversation removed");
  };

  const sendMessage = (text: string) => {
    if (!activeConversation || !text.trim()) return;
    const sequence = (messagesByConversation[activeConversation.id]?.length || 0) + 1;
    const nextMessage: ChirpMessage = {
      id: `chirp-${activeConversation.id}-${sequence}`,
      conversationId: activeConversation.id,
      senderId: CURRENT_USER_ID,
      type: "text",
      text: text.trim(),
      reactions: [],
      status: "sent",
      createdAt: demoTimestamp(sequence),
    };
    setMessagesByConversation((current) => ({
      ...current,
      [activeConversation.id]: [...(current[activeConversation.id] || []), nextMessage],
    }));
    updateConversation(activeConversation.id, (conversation) => ({
      ...conversation,
      lastMessage: nextMessage,
      unreadCount: 0,
      updatedAt: nextMessage.createdAt,
    }));
    setDraft("");
  };

  const reactToMessage = (conversationId: string, messageId: string, emoji: string) => {
    setMessagesByConversation((current) => ({
      ...current,
      [conversationId]: (current[conversationId] || []).map((message) =>
        message.id === messageId
          ? { ...message, reactions: [...message.reactions, { emoji, userId: CURRENT_USER_ID }] }
          : message
      ),
    }));
  };

  const startConversation = (profileId: string) => {
    const profile = DEMO_PROFILES.find((item) => item.id === profileId);
    if (!profile) return;
    const id = `new-${profile.id}`;
    const createdAt = demoTimestamp(conversations.length + 1);
    const starter: ChirpConversation = {
      id,
      participants: [profile],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      updatedAt: createdAt,
      createdAt,
      lastMessage: undefined,
    };
    setConversations((current) => [starter, ...current]);
    setMessagesByConversation((current) => ({ ...current, [id]: [] }));
    setActiveConversationId(id);
    setComposerOpen(false);
    showToast(`Started chat with ${profile.display_name}`);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-[#050510]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold">Chirp</h1>
            <p className="text-xs text-white/35">Direct messages, collabs, and shared media demos.</p>
          </div>
          <button onClick={() => setComposerOpen(true)} className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
            New chat
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-0 px-0 md:grid-cols-[360px_minmax(0,1fr)]">
        <aside className={cn("border-r border-white/[0.05] md:block", activeConversation ? "hidden md:block" : "block")}>
          <div className="border-b border-white/[0.05] p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
              <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20" />
            </div>
            <div className="mt-3 flex gap-2">
              {[
                { key: "all", label: "All" },
                { key: "unread", label: "Unread" },
                { key: "pinned", label: "Pinned" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key as "all" | "unread" | "pinned")}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    activeFilter === tab.key ? "bg-white text-black" : "bg-white/[0.05] text-white/45 hover:bg-white/[0.08] hover:text-white/70"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[calc(100vh-148px)] overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                active={activeConversation?.id === conversation.id}
                onOpen={() => openConversation(conversation.id)}
                onPin={() => updateConversation(conversation.id, (item) => ({ ...item, isPinned: !item.isPinned }))}
                onMute={() => updateConversation(conversation.id, (item) => ({ ...item, isMuted: !item.isMuted }))}
                onDelete={() => deleteConversation(conversation.id)}
              />
            ))}
            {filteredConversations.length === 0 && (
              <div className="p-6 text-center text-sm text-white/25">No conversations match this view.</div>
            )}
          </div>
        </aside>

        <section className={cn("min-h-[calc(100vh-80px)]", activeConversation ? "block" : "hidden md:block")}>
          {activeConversation ? (
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3 border-b border-white/[0.05] px-4 py-4">
                <button onClick={() => setActiveConversationId("")} className="rounded-full bg-white/[0.05] p-2 text-white/45 md:hidden">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <img src={activeConversation.participants[0].avatar_url || `https://i.pravatar.cc/48?u=${activeConversation.participants[0].id}`} alt={activeConversation.participants[0].display_name} className="h-11 w-11 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{activeConversation.participants[0].display_name}</p>
                  <p className="truncate text-xs text-white/35">
                    @{activeConversation.participants[0].username} {ONLINE_IDS.includes(activeConversation.participants[0].id) ? "· online" : "· creator"}
                  </p>
                </div>
                <Link href={`/profile/${activeConversation.participants[0].id}`} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-white transition">
                  View profile
                </Link>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
                {activeMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    own={message.senderId === CURRENT_USER_ID}
                    onReact={(emoji) => reactToMessage(activeConversation.id, message.id, emoji)}
                    onPlayTrack={(item) => {
                      if (item.sharedTrack) {
                        play(item.sharedTrack);
                        showToast(`Playing ${item.sharedTrack.title}`);
                      }
                    }}
                  />
                ))}
              </div>

              <div className="border-t border-white/[0.05] px-4 py-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply) => (
                    <button key={reply} onClick={() => sendMessage(reply)} className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-white/60 hover:bg-white/[0.08] hover:text-white transition">
                      {reply}
                    </button>
                  ))}
                </div>
                <div className="flex items-end gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write a message"
                    className="min-h-[28px] flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  />
                  <button onClick={() => sendMessage(draft)} disabled={!draft.trim()} className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-30">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden h-full items-center justify-center text-center md:flex">
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] text-2xl">💬</div>
                <p className="text-sm font-semibold text-white/60">Pick a conversation</p>
                <p className="mt-1 text-xs text-white/25">Your Chirp demo inbox is ready on the left.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {composerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setComposerOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} className="fixed inset-x-4 top-[12%] z-50 mx-auto max-w-lg rounded-3xl border border-white/[0.08] bg-[#0c0c1a]/95 p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Start a new chat</h3>
                  <p className="text-sm text-white/35">Pick any creator without an active thread.</p>
                </div>
                <button onClick={() => setComposerOpen(false)} className="rounded-full bg-white/[0.05] p-2 text-white/40 hover:text-white/70 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {availableProfiles.map((profile) => (
                  <button key={profile.id} onClick={() => startConversation(profile.id)} className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.03] px-3 py-3 text-left hover:bg-white/[0.06] transition">
                    <img src={profile.avatar_url || `https://i.pravatar.cc/40?u=${profile.id}`} alt={profile.display_name} className="h-11 w-11 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{profile.display_name}</p>
                      <p className="truncate text-xs text-white/35">@{profile.username}</p>
                    </div>
                  </button>
                ))}
                {availableProfiles.length === 0 && <p className="text-sm text-white/30">All demo creators already have a chat thread.</p>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
