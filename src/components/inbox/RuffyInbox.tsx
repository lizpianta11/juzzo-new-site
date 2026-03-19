"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useDemo } from "@/providers/DemoProvider";

/* ─── Types ─── */
interface Email {
  id: string;
  from: string;
  fromAvatar: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  isRead: boolean;
  isPriority: boolean;
  isAiDraft: boolean;
  category: "inbox" | "priority" | "sent" | "drafts" | "ai";
  aiSummary?: string;
  aiReply?: string;
  tags?: string[];
}

/* ─── Sidebar folders ─── */
const FOLDERS = [
  { key: "inbox", label: "Inbox", icon: InboxIcon, badge: 3 },
  { key: "priority", label: "Priority", icon: FireIcon, badge: 1 },
  { key: "sent", label: "Sent", icon: SendIcon, badge: 0 },
  { key: "drafts", label: "Drafts", icon: DraftIcon, badge: 0 },
  { key: "ai", label: "AI Suggestions", icon: SparkleIcon, badge: 2 },
] as const;
type FolderKey = (typeof FOLDERS)[number]["key"];

/* ─── Demo emails ─── */
const DEMO_EMAILS: Email[] = [
  {
    id: "e1",
    from: "Luna Sol",
    fromAvatar: "https://i.pravatar.cc/40?u=luna",
    subject: "Collab on new track? 🎵",
    preview: "Hey! I loved your latest track and was wondering if you'd be down to collab on something...",
    body: "Hey!\n\nI loved your latest track \"Midnight Dreams\" — the production is insane. I've been working on an ethereal R&B project and think our styles would mesh really well.\n\nWould you be down to hop on a track together? I can send over some stems this week.\n\nLet me know!\n— Luna",
    time: "2m ago",
    isRead: false,
    isPriority: true,
    isAiDraft: false,
    category: "inbox",
    aiSummary: "Luna Sol wants to collaborate on an ethereal R&B track. She's offering to send stems this week.",
    aiReply: "Hey Luna! Thanks so much — I'm really into the idea of a collab. Send those stems over and I'll take a listen. Let's make something special! 🎶",
    tags: ["Collab", "Music"],
  },
  {
    id: "e2",
    from: "Juzzo Team",
    fromAvatar: "https://i.pravatar.cc/40?u=juzzo",
    subject: "Your track hit 10K plays! 🎉",
    preview: "Congratulations! Your track has reached a major milestone...",
    body: "Congratulations! 🎉\n\nYour track \"Neon Pulse\" has officially hit 10,000 plays on Juzzo. That's a huge milestone!\n\nHere are some tips to keep the momentum going:\n• Share to your social channels\n• Consider uploading a short teaser\n• Engage with your listeners in the comments\n\nKeep creating!\n— The Juzzo Team",
    time: "1h ago",
    isRead: false,
    isPriority: false,
    isAiDraft: false,
    category: "inbox",
    aiSummary: "Milestone notification: \"Neon Pulse\" reached 10K plays. Includes growth tips.",
    tags: ["Milestone", "Platform"],
  },
  {
    id: "e3",
    from: "DJ Nova",
    fromAvatar: "https://i.pravatar.cc/40?u=nova",
    subject: "Re: Festival lineup",
    preview: "Sounds good! I'll add you to the set list. Can you send your rider...",
    body: "Sounds good! I'll add you to the set list for the Neon Nights festival.\n\nCan you send your rider and a press kit by Friday? We need it for the promo materials.\n\nAlso, the slot would be 9PM — right before the headliner. Let me know if that works.\n\nCheers,\nNova",
    time: "3h ago",
    isRead: false,
    isPriority: true,
    isAiDraft: false,
    category: "inbox",
    aiSummary: "DJ Nova confirmed festival slot at 9PM. Needs rider and press kit by Friday.",
    aiReply: "That 9PM slot is perfect! I'll have the rider and press kit to you by Thursday. Thanks for the opportunity — this is going to be epic! 🎧",
    tags: ["Event", "Business"],
  },
  {
    id: "e4",
    from: "You",
    fromAvatar: "https://i.pravatar.cc/40?u=me",
    subject: "Thanks for the feature!",
    preview: "Just wanted to say thanks for including my track in the weekly spotlight...",
    body: "Hey there!\n\nJust wanted to drop a quick thank you for including \"Midnight Dreams\" in this week's Juzzo spotlight. The exposure has been incredible and I've gained over 200 new followers!\n\nLooking forward to more collaborations with the platform.\n\nBest,\nYou",
    time: "Yesterday",
    isRead: true,
    isPriority: false,
    isAiDraft: false,
    category: "sent",
    tags: ["Thank You"],
  },
  {
    id: "e5",
    from: "Ruffy AI",
    fromAvatar: "",
    subject: "Draft: Response to Aqua Flow's message",
    preview: "AI-generated reply based on your communication style...",
    body: "Hey Aqua! Thanks for reaching out about the remix. I'd love to hear what you have in mind — feel free to send a rough demo and we can go from there. Looking forward to it! 🌊",
    time: "30m ago",
    isRead: true,
    isPriority: false,
    isAiDraft: true,
    category: "ai",
    aiSummary: "Auto-drafted reply to Aqua Flow's remix request. Matches your tone and style.",
    tags: ["AI Draft", "Collab"],
  },
  {
    id: "e6",
    from: "Ruffy AI",
    fromAvatar: "",
    subject: "Weekly activity digest",
    preview: "Here's your social summary: 5 new followers, 3 track likes, 2 comments...",
    body: "📊 Your Weekly Juzzo Digest\n\n• 5 new followers this week\n• 3 track likes on \"Midnight Dreams\"\n• 2 new comments to respond to\n• 1 collab request pending\n• Your most popular genre: Ethereal R&B\n\nRecommended action: Reply to Luna Sol's collab request — high engagement potential!",
    time: "Today",
    isRead: true,
    isPriority: false,
    isAiDraft: true,
    category: "ai",
    aiSummary: "Weekly platform digest with engagement stats and recommended actions.",
    tags: ["Digest", "Analytics"],
  },
];

/* ─── Icon components ─── */
function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M2.25 13.5V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0115.548 0c1.131.094 1.976 1.057 1.976 2.192V13.5" />
    </svg>
  );
}
function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </svg>
  );
}
function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}
function DraftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
}
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   COMPOSE MODAL
   ═══════════════════════════════════════════════ */
function ComposeEmail({ onClose }: { onClose: () => void }) {
  const { showToast } = useDemo();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0c0c1a] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Compose header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white">New Message</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast("AI is generating a draft...")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition"
            >
              <SparkleIcon className="w-3.5 h-3.5" />
              AI Assist
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition">
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="px-5 py-3 space-y-0 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04]">
            <span className="text-sm text-white/30 w-12">To</span>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
              placeholder="recipient@email.com"
            />
          </div>
          <div className="flex items-center gap-3 py-2.5">
            <span className="text-sm text-white/30 w-12">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
              placeholder="What's this about?"
            />
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            rows={10}
            className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/[0.06] rounded-lg transition" title="Attach file">
              <svg className="w-4.5 h-4.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => {
              showToast("Email sent!");
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-sm font-semibold text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Send
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN RUFFY INBOX
   ═══════════════════════════════════════════════ */
export default function RuffyInbox() {
  const { showToast } = useDemo();
  const [folder, setFolder] = useState<FolderKey>("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composing, setComposing] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const filtered = DEMO_EMAILS.filter((e) => {
    if (folder === "inbox") return e.category === "inbox";
    if (folder === "priority") return e.isPriority;
    if (folder === "sent") return e.category === "sent";
    if (folder === "drafts") return false;
    if (folder === "ai") return e.isAiDraft;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050510]">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 bg-[#050510]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center relative">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Ruffy.ai</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setComposing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-sm font-semibold text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              Compose
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-3.5rem)]">
        {/* ─── Sidebar ─── */}
        <aside className="w-56 flex-shrink-0 border-r border-white/[0.04] py-4 px-3 hidden md:block">
          <nav className="space-y-1">
            {FOLDERS.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.key}
                  onClick={() => { setFolder(f.key); setSelectedEmail(null); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    folder === f.key
                      ? "bg-blue-500/10 text-blue-300 border border-blue-500/15"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white/60 border border-transparent"
                  )}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                  <span className="flex-1 text-left">{f.label}</span>
                  {f.badge > 0 && (
                    <span className={cn(
                      "w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                      folder === f.key ? "bg-blue-500/30 text-blue-200" : "bg-white/[0.06] text-white/30"
                    )}>
                      {f.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer — connected accounts */}
          <div className="mt-8 px-3">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-semibold mb-3">Connected</p>
            <div className="space-y-2">
              <button
                onClick={() => showToast("Gmail connected!")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition text-left"
              >
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">📧</div>
                <div>
                  <p className="text-[11px] text-white/50 font-medium">Gmail</p>
                  <p className="text-[9px] text-white/20">Connected</p>
                </div>
              </button>
              <button
                onClick={() => showToast("Connect Outlook coming soon!")}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-dashed border-white/[0.08] hover:bg-white/[0.03] transition text-left"
              >
                <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="text-[11px] text-white/25 font-medium">Add account</p>
              </button>
            </div>
          </div>
        </aside>

        {/* ─── Message list ─── */}
        <div className={cn(
          "flex-1 border-r border-white/[0.04] overflow-y-auto",
          selectedEmail ? "hidden md:block md:max-w-md" : ""
        )}>
          {/* Mobile folder tabs */}
          <div className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-hide md:hidden border-b border-white/[0.04]">
            {FOLDERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFolder(f.key); setSelectedEmail(null); }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  folder === f.key
                    ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                    : "text-white/30 bg-white/[0.04] border border-transparent"
                )}
              >
                {f.label} {f.badge > 0 && `(${f.badge})`}
              </button>
            ))}
          </div>

          {/* List header */}
          <div className="px-4 py-3 border-b border-white/[0.04]">
            <h2 className="text-sm font-semibold text-white/60 capitalize">{folder}</h2>
            <p className="text-[11px] text-white/25 mt-0.5">{filtered.length} message{filtered.length !== 1 ? "s" : ""}</p>
          </div>

          {/* Emails */}
          <div className="divide-y divide-white/[0.03]">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/20">
                <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                  <InboxIcon className="w-7 h-7 text-white/15" />
                </div>
                <p className="text-sm font-medium text-white/25">No messages</p>
                <p className="text-xs text-white/15 mt-1">This folder is empty</p>
              </div>
            ) : (
              filtered.map((email) => (
                <button
                  key={email.id}
                  onClick={() => { setSelectedEmail(email); setShowAiPanel(false); }}
                  className={cn(
                    "w-full text-left px-4 py-4 hover:bg-white/[0.03] transition-all group",
                    selectedEmail?.id === email.id && "bg-blue-500/[0.05] border-l-2 border-l-blue-500",
                    !email.isRead && "bg-white/[0.01]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0 relative">
                      {email.isAiDraft ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-blue-500/20 flex items-center justify-center">
                          <SparkleIcon className="w-5 h-5 text-blue-300" />
                        </div>
                      ) : (
                        <img src={email.fromAvatar} alt={email.from} className="w-10 h-10 rounded-full object-cover" />
                      )}
                      {!email.isRead && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#050510] shadow-sm shadow-blue-500/50" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className={cn("text-sm truncate", !email.isRead ? "font-bold text-white" : "font-medium text-white/60")}>{email.from}</p>
                        <span className="text-[10px] text-white/25 flex-shrink-0">{email.time}</span>
                      </div>
                      <p className={cn("text-[13px] truncate mb-1", !email.isRead ? "text-white/80 font-medium" : "text-white/45")}>{email.subject}</p>
                      <p className="text-[12px] text-white/25 truncate">{email.preview}</p>
                      {/* Tags */}
                      {email.tags && (
                        <div className="flex gap-1.5 mt-2">
                          {email.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-white/[0.04] text-[9px] font-medium text-white/25">{tag}</span>
                          ))}
                          {email.isPriority && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-[9px] font-medium text-amber-300/60 border border-amber-500/10">Priority</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ─── Email detail panel ─── */}
        <AnimatePresence mode="wait">
          {selectedEmail ? (
            <motion.div
              key={selectedEmail.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-y-auto"
            >
              {/* Detail header */}
              <div className="sticky top-0 z-10 bg-[#050510]/90 backdrop-blur-xl border-b border-white/[0.04] px-6 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="md:hidden p-2 -ml-2 hover:bg-white/[0.06] rounded-lg transition"
                  >
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAiPanel(!showAiPanel)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        showAiPanel
                          ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                          : "bg-white/[0.04] text-white/40 border border-white/[0.06] hover:bg-white/[0.08]"
                      )}
                    >
                      <SparkleIcon className="w-3.5 h-3.5" />
                      AI Insights
                    </button>
                    <button
                      onClick={() => showToast("Reply coming soon!")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-medium text-white/40 hover:bg-white/[0.08] transition"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => showToast("Forwarding coming soon!")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-medium text-white/40 hover:bg-white/[0.08] transition"
                    >
                      Forward
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex">
                {/* Main email body */}
                <div className="flex-1 px-6 py-6">
                  <h2 className="text-xl font-bold text-white mb-4">{selectedEmail.subject}</h2>

                  <div className="flex items-center gap-3 mb-6">
                    {selectedEmail.isAiDraft ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-blue-500/20 flex items-center justify-center">
                        <SparkleIcon className="w-5 h-5 text-blue-300" />
                      </div>
                    ) : (
                      <img src={selectedEmail.fromAvatar} alt={selectedEmail.from} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedEmail.from}</p>
                      <p className="text-[11px] text-white/25">{selectedEmail.time}</p>
                    </div>
                  </div>

                  <div className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
                    {selectedEmail.body}
                  </div>

                  {/* Quick AI reply (if available) */}
                  {selectedEmail.aiReply && (
                    <div className="mt-8 p-4 rounded-2xl bg-blue-500/[0.06] border border-blue-500/10">
                      <div className="flex items-center gap-2 mb-3">
                        <SparkleIcon className="w-4 h-4 text-blue-300" />
                        <p className="text-xs font-semibold text-blue-300">AI-Suggested Reply</p>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed">{selectedEmail.aiReply}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => showToast("Reply sent!")}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-xs font-semibold text-white hover:opacity-90 transition active:scale-95"
                        >
                          Send This Reply
                        </button>
                        <button
                          onClick={() => showToast("Opening editor...")}
                          className="px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-white/50 hover:bg-white/[0.1] transition"
                        >
                          Edit First
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Insights panel (right side) */}
                <AnimatePresence>
                  {showAiPanel && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 280, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-l border-white/[0.04] overflow-hidden flex-shrink-0 hidden lg:block"
                    >
                      <div className="w-[280px] px-5 py-6 space-y-6">
                        <div>
                          <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <SparkleIcon className="w-3.5 h-3.5" />
                            AI Summary
                          </h4>
                          <p className="text-[13px] text-white/45 leading-relaxed">
                            {selectedEmail.aiSummary || "No AI summary available for this message."}
                          </p>
                        </div>

                        <div className="w-full h-px bg-white/[0.04]" />

                        <div>
                          <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Quick Actions</h4>
                          <div className="space-y-2">
                            {[
                              { label: "Mark as priority", action: "Marked as priority!" },
                              { label: "Snooze for later", action: "Snoozed for 2 hours" },
                              { label: "Archive message", action: "Message archived" },
                              { label: "Share to Juzzo", action: "Shared to your profile!" },
                            ].map((a) => (
                              <button
                                key={a.label}
                                onClick={() => showToast(a.action)}
                                className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[12px] text-white/40 hover:bg-white/[0.06] hover:text-white/60 transition"
                              >
                                {a.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {selectedEmail.tags && selectedEmail.tags.length > 0 && (
                          <>
                            <div className="w-full h-px bg-white/[0.04]" />
                            <div>
                              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Tags</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedEmail.tags.map((tag) => (
                                  <span key={tag} className="px-2.5 py-1 rounded-full bg-white/[0.04] text-[10px] font-medium text-white/30">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* Empty state — no email selected */
            <div className="flex-1 hidden md:flex flex-col items-center justify-center text-white/15">
              <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <p className="text-sm font-medium text-white/25">Select a message</p>
              <p className="text-xs text-white/15 mt-1">Choose an email to read</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Compose modal */}
      <AnimatePresence>
        {composing && <ComposeEmail onClose={() => setComposing(false)} />}
      </AnimatePresence>
    </div>
  );
}
