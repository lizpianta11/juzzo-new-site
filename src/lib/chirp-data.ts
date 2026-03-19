import type { ChirpConversation, ChirpMessage } from "@/types";
import { DEMO_PROFILES, DEMO_TRACKS, DEMO_POSTS, DEMO_SHORTS } from "./demo-data";

const p = (id: string) => DEMO_PROFILES.find((p) => p.id === id)!;

// ============================================
// Demo Conversations
// ============================================

export const DEMO_CONVERSATIONS: ChirpConversation[] = [
  {
    id: "c1",
    participants: [p("u2")],
    unreadCount: 3,
    isPinned: true,
    isMuted: false,
    updatedAt: "2026-03-17T10:45:00Z",
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "c2",
    participants: [p("u5")],
    unreadCount: 1,
    isPinned: true,
    isMuted: false,
    updatedAt: "2026-03-17T09:30:00Z",
    createdAt: "2026-02-10T14:00:00Z",
  },
  {
    id: "c3",
    participants: [p("u13")],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    updatedAt: "2026-03-16T23:15:00Z",
    createdAt: "2026-02-28T18:00:00Z",
  },
  {
    id: "c4",
    participants: [p("u12")],
    unreadCount: 5,
    isPinned: false,
    isMuted: false,
    updatedAt: "2026-03-16T20:00:00Z",
    createdAt: "2026-01-20T11:00:00Z",
  },
  {
    id: "c5",
    participants: [p("u9")],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    updatedAt: "2026-03-16T18:45:00Z",
    createdAt: "2026-03-01T16:00:00Z",
  },
  {
    id: "c6",
    participants: [p("u4")],
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    updatedAt: "2026-03-15T14:00:00Z",
    createdAt: "2026-01-05T08:00:00Z",
  },
  {
    id: "c7",
    participants: [p("u3")],
    unreadCount: 2,
    isPinned: false,
    isMuted: false,
    updatedAt: "2026-03-15T11:30:00Z",
    createdAt: "2026-03-10T20:00:00Z",
  },
  {
    id: "c8",
    participants: [p("u7")],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    updatedAt: "2026-03-14T22:00:00Z",
    createdAt: "2026-02-18T15:00:00Z",
  },
  {
    id: "c9",
    participants: [p("u8")],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    updatedAt: "2026-03-13T16:00:00Z",
    createdAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "c10",
    participants: [p("u6")],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    updatedAt: "2026-03-12T09:00:00Z",
    createdAt: "2026-02-22T12:00:00Z",
  },
];

// ============================================
// Demo Messages by conversation
// ============================================

function msg(
  partial: Omit<ChirpMessage, "reactions" | "status"> & {
    reactions?: ChirpMessage["reactions"];
    status?: ChirpMessage["status"];
  }
): ChirpMessage {
  return {
    reactions: [],
    status: "read",
    ...partial,
  };
}

const MESSAGES_C1: ChirpMessage[] = [
  msg({ id: "m1-1", conversationId: "c1", senderId: "u1", type: "text", text: "Yo KVNG! That freestyle short was insane 🔥", createdAt: "2026-03-17T09:00:00Z" }),
  msg({ id: "m1-2", conversationId: "c1", senderId: "u2", type: "text", text: "ayyy Luna! thanks 🙏 been cooking in the studio all week", createdAt: "2026-03-17T09:05:00Z", reactions: [{ emoji: "🔥", userId: "u1" }] }),
  msg({ id: "m1-3", conversationId: "c1", senderId: "u1", type: "text", text: "We should collab. I've got this dreamy hook that would go crazy over your beats", createdAt: "2026-03-17T09:10:00Z" }),
  msg({ id: "m1-4", conversationId: "c1", senderId: "u2", type: "text", text: "say less. I literally had the same idea yesterday", createdAt: "2026-03-17T09:12:00Z" }),
  msg({ id: "m1-5", conversationId: "c1", senderId: "u2", type: "shared-track", sharedTrack: DEMO_TRACKS.find((t) => t.id === "17"), text: "Check this beat I just finished", createdAt: "2026-03-17T09:15:00Z" }),
  msg({ id: "m1-6", conversationId: "c1", senderId: "u1", type: "voice", voiceDuration: 12, createdAt: "2026-03-17T09:20:00Z" }),
  msg({ id: "m1-7", conversationId: "c1", senderId: "u2", type: "text", text: "YOOO that melody is fire 🎤✨ we need to record this week", createdAt: "2026-03-17T09:22:00Z", reactions: [{ emoji: "❤️", userId: "u1" }] }),
  msg({ id: "m1-8", conversationId: "c1", senderId: "u1", type: "image", imageUrl: "https://picsum.photos/seed/studio1/600/400", text: "Studio is booked for Thursday 👀", createdAt: "2026-03-17T10:30:00Z" }),
  msg({ id: "m1-9", conversationId: "c1", senderId: "u2", type: "text", text: "locked in. pulling up at noon 🎯", createdAt: "2026-03-17T10:35:00Z", status: "delivered" }),
  msg({ id: "m1-10", conversationId: "c1", senderId: "u2", type: "text", text: "also check this out", createdAt: "2026-03-17T10:40:00Z", status: "delivered" }),
  msg({ id: "m1-11", conversationId: "c1", senderId: "u2", type: "snap", text: "👀", isEphemeral: true, expiresAfter: 10, viewed: false, createdAt: "2026-03-17T10:45:00Z", status: "delivered" }),
];

const MESSAGES_C2: ChirpMessage[] = [
  msg({ id: "m2-1", conversationId: "c2", senderId: "u5", type: "text", text: "Luna!! I love the Midnight Dreams vibes", createdAt: "2026-03-17T08:00:00Z" }),
  msg({ id: "m2-2", conversationId: "c2", senderId: "u1", type: "text", text: "Thank you Ava 💜 your Golden Hour was the inspiration honestly", createdAt: "2026-03-17T08:10:00Z" }),
  msg({ id: "m2-3", conversationId: "c2", senderId: "u5", type: "text", text: "stop it 😭 that means so much", createdAt: "2026-03-17T08:12:00Z", reactions: [{ emoji: "❤️", userId: "u1" }] }),
  msg({ id: "m2-4", conversationId: "c2", senderId: "u5", type: "shared-track", sharedTrack: DEMO_TRACKS.find((t) => t.id === "20"), text: "New R&B vibes — thoughts?", createdAt: "2026-03-17T08:30:00Z" }),
  msg({ id: "m2-5", conversationId: "c2", senderId: "u1", type: "text", text: "This is gorgeous omg. The harmonies in the bridge 🤌", createdAt: "2026-03-17T08:45:00Z" }),
  msg({ id: "m2-6", conversationId: "c2", senderId: "u5", type: "image", imageUrl: "https://picsum.photos/seed/sunset_studio/600/400", text: "sunset view from the studio rn 🌅", createdAt: "2026-03-17T09:15:00Z" }),
  msg({ id: "m2-7", conversationId: "c2", senderId: "u1", type: "text", text: "unreal. we need to do a joint session there sometime", createdAt: "2026-03-17T09:20:00Z" }),
  msg({ id: "m2-8", conversationId: "c2", senderId: "u5", type: "text", text: "YES. this weekend? I'm free Saturday", createdAt: "2026-03-17T09:30:00Z", status: "delivered" }),
];

const MESSAGES_C3: ChirpMessage[] = [
  msg({ id: "m3-1", conversationId: "c3", senderId: "u1", type: "shared-short", sharedShort: DEMO_SHORTS.find((s) => s.id === "s1"), text: "This challenge is everywhere 😂", createdAt: "2026-03-16T22:00:00Z" }),
  msg({ id: "m3-2", conversationId: "c3", senderId: "u13", type: "text", text: "hahaha I can't believe it blew up like this!! 😭", createdAt: "2026-03-16T22:05:00Z" }),
  msg({ id: "m3-3", conversationId: "c3", senderId: "u13", type: "text", text: "234k views is crazy. Juzzo algorithm is insane", createdAt: "2026-03-16T22:07:00Z", reactions: [{ emoji: "🔥", userId: "u1" }] }),
  msg({ id: "m3-4", conversationId: "c3", senderId: "u1", type: "text", text: "You deserve it! Starlight is a bop", createdAt: "2026-03-16T22:15:00Z" }),
  msg({ id: "m3-5", conversationId: "c3", senderId: "u13", type: "voice", voiceDuration: 8, createdAt: "2026-03-16T22:20:00Z" }),
  msg({ id: "m3-6", conversationId: "c3", senderId: "u1", type: "text", text: "aww that's so sweet 🥹 we should def do a duet", createdAt: "2026-03-16T23:00:00Z" }),
  msg({ id: "m3-7", conversationId: "c3", senderId: "u13", type: "text", text: "I'm in!! Let me check my schedule and get back to you 💜", createdAt: "2026-03-16T23:15:00Z" }),
];

const MESSAGES_C4: ChirpMessage[] = [
  msg({ id: "m4-1", conversationId: "c4", senderId: "u12", type: "text", text: "Luna! the EP is almost done 🌍🔥", createdAt: "2026-03-16T18:00:00Z" }),
  msg({ id: "m4-2", conversationId: "c4", senderId: "u1", type: "text", text: "Temi!! Can't wait to hear it. Lagos Nights was incredible", createdAt: "2026-03-16T18:10:00Z" }),
  msg({ id: "m4-3", conversationId: "c4", senderId: "u12", type: "shared-track", sharedTrack: DEMO_TRACKS.find((t) => t.id === "19"), text: "Preview of the new one — Jollof 🍲", createdAt: "2026-03-16T18:15:00Z" }),
  msg({ id: "m4-4", conversationId: "c4", senderId: "u1", type: "text", text: "THIS SLAPS. The percussion is everything", createdAt: "2026-03-16T18:30:00Z", reactions: [{ emoji: "🔥", userId: "u12" }] }),
  msg({ id: "m4-5", conversationId: "c4", senderId: "u12", type: "image", imageUrl: "https://picsum.photos/seed/lagos_night/600/400", text: "Recording session in Lagos last night", createdAt: "2026-03-16T19:00:00Z" }),
  msg({ id: "m4-6", conversationId: "c4", senderId: "u12", type: "text", text: "Want to feature on track 3? It's a dreamy Afro-Pop vibe", createdAt: "2026-03-16T19:30:00Z", status: "delivered" }),
  msg({ id: "m4-7", conversationId: "c4", senderId: "u12", type: "text", text: "Perfect for your voice", createdAt: "2026-03-16T19:31:00Z", status: "delivered" }),
  msg({ id: "m4-8", conversationId: "c4", senderId: "u12", type: "text", text: "Lmk!! 🙏", createdAt: "2026-03-16T19:45:00Z", status: "delivered" }),
  msg({ id: "m4-9", conversationId: "c4", senderId: "u12", type: "snap", text: "🎧", isEphemeral: true, expiresAfter: 5, viewed: false, createdAt: "2026-03-16T19:50:00Z", status: "delivered" }),
  msg({ id: "m4-10", conversationId: "c4", senderId: "u12", type: "text", text: "ok im going to sleep but reply when u can 😴", createdAt: "2026-03-16T20:00:00Z", status: "delivered" }),
];

const MESSAGES_C5: ChirpMessage[] = [
  msg({ id: "m5-1", conversationId: "c5", senderId: "u9", type: "text", text: "heyyy Luna! How's the album coming?", createdAt: "2026-03-16T17:00:00Z" }),
  msg({ id: "m5-2", conversationId: "c5", senderId: "u1", type: "text", text: "Rosa!! It's going well. 6 tracks done, 4 more to go ✨", createdAt: "2026-03-16T17:15:00Z" }),
  msg({ id: "m5-3", conversationId: "c5", senderId: "u9", type: "text", text: "Amazing! I want that collab still btw 🔥🇨🇴", createdAt: "2026-03-16T17:20:00Z" }),
  msg({ id: "m5-4", conversationId: "c5", senderId: "u1", type: "shared-post", sharedPost: DEMO_POSTS.find((p) => p.id === "p6"), text: "Saw this! Afro-Latin remix sounds incredible", createdAt: "2026-03-16T18:00:00Z" }),
  msg({ id: "m5-5", conversationId: "c5", senderId: "u9", type: "text", text: "yesss it's gonna be so fire 💃🔥", createdAt: "2026-03-16T18:30:00Z" }),
  msg({ id: "m5-6", conversationId: "c5", senderId: "u1", type: "text", text: "Can't wait to hear the final version!", createdAt: "2026-03-16T18:45:00Z" }),
];

const MESSAGES_C6: ChirpMessage[] = [
  msg({ id: "m6-1", conversationId: "c6", senderId: "u4", type: "shared-track", sharedTrack: DEMO_TRACKS.find((t) => t.id === "18"), text: "New electronic piece — Pulse", createdAt: "2026-03-15T12:00:00Z" }),
  msg({ id: "m6-2", conversationId: "c6", senderId: "u1", type: "text", text: "PRISM this is incredible. The synth design is otherworldly", createdAt: "2026-03-15T13:00:00Z" }),
  msg({ id: "m6-3", conversationId: "c6", senderId: "u4", type: "text", text: "Thanks! spent 2 weeks on just the lead patch 🎛️", createdAt: "2026-03-15T13:30:00Z" }),
  msg({ id: "m6-4", conversationId: "c6", senderId: "u1", type: "text", text: "It shows. Would love to add vocals to something like this sometime", createdAt: "2026-03-15T14:00:00Z" }),
];

const MESSAGES_C7: ChirpMessage[] = [
  msg({ id: "m7-1", conversationId: "c7", senderId: "u3", type: "text", text: "Hey Luna! Have you heard this lo-fi beat?", createdAt: "2026-03-15T10:00:00Z" }),
  msg({ id: "m7-2", conversationId: "c7", senderId: "u3", type: "shared-track", sharedTrack: DEMO_TRACKS.find((t) => t.id === "21"), text: "Rain Pattern — new one", createdAt: "2026-03-15T10:01:00Z" }),
  msg({ id: "m7-3", conversationId: "c7", senderId: "u1", type: "text", text: "Seren this is so chill 🌧️ perfect study music", createdAt: "2026-03-15T10:30:00Z" }),
  msg({ id: "m7-4", conversationId: "c7", senderId: "u3", type: "text", text: "thanks!! was hoping you'd vibe with it", createdAt: "2026-03-15T10:45:00Z" }),
  msg({ id: "m7-5", conversationId: "c7", senderId: "u3", type: "voice", voiceDuration: 15, createdAt: "2026-03-15T11:00:00Z", status: "delivered" }),
  msg({ id: "m7-6", conversationId: "c7", senderId: "u3", type: "text", text: "That's a preview of the next one 👀", createdAt: "2026-03-15T11:30:00Z", status: "delivered" }),
];

const MESSAGES_C8: ChirpMessage[] = [
  msg({ id: "m8-1", conversationId: "c8", senderId: "u7", type: "text", text: "Luna. Bass music collab. Yes or no.", createdAt: "2026-03-14T21:00:00Z" }),
  msg({ id: "m8-2", conversationId: "c8", senderId: "u1", type: "text", text: "VOID 😂 straight to the point. YES.", createdAt: "2026-03-14T21:30:00Z" }),
  msg({ id: "m8-3", conversationId: "c8", senderId: "u7", type: "text", text: "bet. sending the stems tonight 🔊", createdAt: "2026-03-14T22:00:00Z", reactions: [{ emoji: "👀", userId: "u1" }] }),
];

const MESSAGES_C9: ChirpMessage[] = [
  msg({ id: "m9-1", conversationId: "c9", senderId: "u8", type: "shared-profile", sharedProfile: p("u9"), text: "Have you heard Rosa's new stuff?", createdAt: "2026-03-13T15:00:00Z" }),
  msg({ id: "m9-2", conversationId: "c9", senderId: "u1", type: "text", text: "Yes! Fuego is a banger 🔥", createdAt: "2026-03-13T15:30:00Z" }),
  msg({ id: "m9-3", conversationId: "c9", senderId: "u8", type: "text", text: "We're doing a collab soon. Keep it on the low 🤫", createdAt: "2026-03-13T16:00:00Z", reactions: [{ emoji: "👀", userId: "u1" }] }),
];

const MESSAGES_C10: ChirpMessage[] = [
  msg({ id: "m10-1", conversationId: "c10", senderId: "u6", type: "text", text: "Hey Luna! Love your latest post about Midnight Dreams", createdAt: "2026-03-12T08:00:00Z" }),
  msg({ id: "m10-2", conversationId: "c10", senderId: "u1", type: "text", text: "Thanks Sahara! 🌻 Wildflower acoustic is amazing btw", createdAt: "2026-03-12T08:30:00Z" }),
  msg({ id: "m10-3", conversationId: "c10", senderId: "u6", type: "text", text: "aw thank you!! indie folk x dream pop when?? 😄", createdAt: "2026-03-12T09:00:00Z" }),
];

export const DEMO_MESSAGES: Record<string, ChirpMessage[]> = {
  c1: MESSAGES_C1,
  c2: MESSAGES_C2,
  c3: MESSAGES_C3,
  c4: MESSAGES_C4,
  c5: MESSAGES_C5,
  c6: MESSAGES_C6,
  c7: MESSAGES_C7,
  c8: MESSAGES_C8,
  c9: MESSAGES_C9,
  c10: MESSAGES_C10,
};

// Wire last messages into conversations
DEMO_CONVERSATIONS.forEach((conv) => {
  const msgs = DEMO_MESSAGES[conv.id];
  if (msgs && msgs.length > 0) {
    conv.lastMessage = msgs[msgs.length - 1];
  }
});
