export type SettingsControlType =
  | "toggle"
  | "select"
  | "text"
  | "textarea"
  | "chips"
  | "button"
  | "status";

export interface SettingsOption {
  label: string;
  value: string;
}

export interface SettingsItem {
  id: string;
  label: string;
  type: SettingsControlType;
  description?: string;
  value?: string | boolean | string[];
  options?: SettingsOption[];
  tone?: "default" | "danger" | "success";
}

export interface SettingsGroup {
  title: string;
  description: string;
  items: SettingsItem[];
}

export interface SettingsSection {
  id: string;
  title: string;
  kicker: string;
  description: string;
  groups: SettingsGroup[];
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "account",
    title: "Account Settings",
    kicker: "Profile and identity",
    description: "Basic account management, profile editing, and username controls.",
    groups: [
      {
        title: "Profile",
        description: "How you appear across Juzzo.",
        items: [
          { id: "username", label: "Change username", type: "text", value: "lunaray" },
          { id: "display-name", label: "Display name", type: "text", value: "Luna Ray" },
          { id: "bio", label: "Bio", type: "textarea", value: "Dreamy pop vocalist. Building my next world tour era." },
          { id: "profile-picture", label: "Profile picture", type: "button", value: "Upload image" },
          { id: "banner-image", label: "Banner image", type: "button", value: "Update banner" },
          { id: "location", label: "Location", type: "text", value: "Los Angeles, CA" },
          { id: "website", label: "Website link", type: "text", value: "juzzo.app/luna" },
          { id: "pronouns", label: "Pronouns", type: "text", value: "she/her" },
          { id: "genres", label: "Music genres you like", type: "chips", value: ["Dream Pop", "Alt R&B", "Lo-Fi", "Afrobeats"] },
        ],
      },
      {
        title: "Account Info",
        description: "Private credentials and contact details.",
        items: [
          { id: "email", label: "Email", type: "text", value: "luna@juzzo.app" },
          { id: "phone", label: "Phone number", type: "text", value: "+1 (310) 555-0194" },
          { id: "password", label: "Password", type: "button", value: "Change password" },
          { id: "2fa-account", label: "Two-factor authentication", type: "toggle", value: true },
          { id: "verification", label: "Account verification status", type: "status", value: "Verified artist" },
        ],
      },
      {
        title: "Username Controls",
        description: "Track availability and previous handles.",
        items: [
          { id: "username-history", label: "Username change history", type: "button", value: "View history" },
          { id: "username-checker", label: "Username availability checker", type: "button", value: "Check names" },
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy Settings",
    kicker: "Visibility and discovery",
    description: "Control what other people can see and how they reach you.",
    groups: [
      {
        title: "Profile Privacy",
        description: "Set the audience for your profile and gated content.",
        items: [
          { id: "public-profile", label: "Public profile", type: "toggle", value: true },
          { id: "private-profile", label: "Private profile", type: "toggle", value: false },
          { id: "followers-only", label: "Followers only content", type: "toggle", value: true },
        ],
      },
      {
        title: "Content Visibility",
        description: "Choose who can access each content type.",
        items: [
          {
            id: "view-posts",
            label: "Who can view posts",
            type: "select",
            value: "followers",
            options: [
              { label: "Followers only", value: "followers" },
              { label: "Everyone", value: "everyone" },
              { label: "Only me", value: "me" },
            ],
          },
          {
            id: "view-shorts",
            label: "Who can view shorts",
            type: "select",
            value: "everyone",
            options: [
              { label: "Everyone", value: "everyone" },
              { label: "Followers only", value: "followers" },
              { label: "Only me", value: "me" },
            ],
          },
          {
            id: "view-playlists",
            label: "Who can view playlists",
            type: "select",
            value: "everyone",
            options: [
              { label: "Everyone", value: "everyone" },
              { label: "Followers only", value: "followers" },
              { label: "Only me", value: "me" },
            ],
          },
          {
            id: "liked-music",
            label: "Who can see liked music",
            type: "select",
            value: "followers",
            options: [
              { label: "Followers only", value: "followers" },
              { label: "Everyone", value: "everyone" },
              { label: "Only me", value: "me" },
            ],
          },
        ],
      },
      {
        title: "Interaction Controls",
        description: "Guard who can interact directly with your account.",
        items: [
          { id: "comments", label: "Who can comment", type: "select", value: "followers", options: [{ label: "Followers only", value: "followers" }, { label: "Everyone", value: "everyone" }, { label: "No one", value: "none" }] },
          { id: "duet", label: "Who can duet/remix", type: "select", value: "approved", options: [{ label: "Approved creators", value: "approved" }, { label: "Everyone", value: "everyone" }, { label: "No one", value: "none" }] },
          { id: "tag", label: "Who can tag you", type: "select", value: "everyone", options: [{ label: "Everyone", value: "everyone" }, { label: "Followers only", value: "followers" }, { label: "No one", value: "none" }] },
          { id: "message", label: "Who can message you", type: "select", value: "followers", options: [{ label: "Followers only", value: "followers" }, { label: "Verified users", value: "verified" }, { label: "No one", value: "none" }] },
        ],
      },
      {
        title: "Discovery",
        description: "Control external indexing and recommendation surfaces.",
        items: [
          { id: "search-engines", label: "Allow search engines", type: "toggle", value: false },
          { id: "recommendations", label: "Allow profile to appear in recommendations", type: "toggle", value: true },
        ],
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    kicker: "Social, content, platform",
    description: "Choose which events reach you and how they are delivered.",
    groups: [
      {
        title: "Social",
        description: "Keep up with account-level interactions.",
        items: [
          { id: "likes", label: "Likes", type: "toggle", value: true },
          { id: "comments-notif", label: "Comments", type: "toggle", value: true },
          { id: "replies", label: "Replies", type: "toggle", value: true },
          { id: "mentions", label: "Mentions", type: "toggle", value: true },
          { id: "new-followers", label: "New followers", type: "toggle", value: true },
          { id: "reposts", label: "Reposts", type: "toggle", value: true },
          { id: "tags", label: "Tags", type: "toggle", value: true },
        ],
      },
      {
        title: "Content",
        description: "Alerts tied to your media performance.",
        items: [
          { id: "shorts-engagement", label: "Shorts engagement", type: "toggle", value: true },
          { id: "video-engagement", label: "Video engagement", type: "toggle", value: true },
          { id: "music-engagement", label: "Music engagement", type: "toggle", value: true },
        ],
      },
      {
        title: "Music",
        description: "Track how other people use your sounds.",
        items: [
          { id: "sound-used", label: "Someone uses your sound", type: "toggle", value: true },
          { id: "playlist-add", label: "Someone adds your song to a playlist", type: "toggle", value: true },
          { id: "remix-track", label: "Someone remixes your track", type: "toggle", value: true },
        ],
      },
      {
        title: "Platform",
        description: "Updates from Juzzo itself.",
        items: [
          { id: "features", label: "New features", type: "toggle", value: true },
          { id: "creator-updates", label: "Creator updates", type: "toggle", value: true },
          { id: "verification-updates", label: "Verification updates", type: "toggle", value: true },
        ],
      },
      {
        title: "Delivery",
        description: "Choose the channels used for notifications.",
        items: [
          { id: "push", label: "Push", type: "toggle", value: true },
          { id: "email-delivery", label: "Email", type: "toggle", value: true },
          { id: "sms", label: "SMS", type: "toggle", value: false },
          { id: "in-app", label: "In-app only", type: "toggle", value: false },
        ],
      },
    ],
  },
  {
    id: "feed",
    title: "Feed & Algorithm Preferences",
    kicker: "Personalize discovery",
    description: "Control feed style, interests, and recommendation tuning.",
    groups: [
      {
        title: "Feed Style",
        description: "Set the content mix you want to see first.",
        items: [
          {
            id: "feed-style",
            label: "Primary feed mode",
            type: "select",
            value: "combined",
            options: [
              { label: "Combined feed", value: "combined" },
              { label: "Shorts only", value: "shorts" },
              { label: "Posts only", value: "posts" },
              { label: "Music discovery", value: "music" },
            ],
          },
        ],
      },
      {
        title: "Interests",
        description: "Fine-tune recommendations with your taste graph.",
        items: [
          { id: "interest-genres", label: "Genres", type: "chips", value: ["Pop", "Alt R&B", "Lo-Fi", "Afrobeats"] },
          { id: "interest-topics", label: "Topics", type: "chips", value: ["Studio sessions", "Songwriting", "Live sets"] },
          { id: "interest-creators", label: "Creators", type: "chips", value: ["Temi", "Yuna", "PRISM"] },
          { id: "interest-regions", label: "Regions", type: "chips", value: ["Los Angeles", "Seoul", "Lagos"] },
        ],
      },
      {
        title: "Content tuning",
        description: "Explicit controls for recommendation strength.",
        items: [
          { id: "show-more", label: "Show more like this", type: "button", value: "Manage signals" },
          { id: "show-less", label: "Show less like this", type: "button", value: "Mute topics" },
          { id: "reset-recs", label: "Reset recommendations", type: "button", value: "Reset now", tone: "danger" },
        ],
      },
    ],
  },
  {
    id: "music",
    title: "Music Settings",
    kicker: "Playback and globe",
    description: "Tune playback quality, discovery, and the signature music globe.",
    groups: [
      {
        title: "Playback",
        description: "Audio behavior for your listening sessions.",
        items: [
          { id: "autoplay", label: "Autoplay", type: "toggle", value: true },
          { id: "crossfade", label: "Crossfade", type: "select", value: "6s", options: [{ label: "Off", value: "off" }, { label: "3 sec", value: "3s" }, { label: "6 sec", value: "6s" }] },
          { id: "quality", label: "Audio quality", type: "select", value: "high", options: [{ label: "Auto", value: "auto" }, { label: "High", value: "high" }, { label: "Lossless", value: "lossless" }] },
          { id: "data-saver", label: "Data saver mode", type: "toggle", value: false },
        ],
      },
      {
        title: "Music Discovery",
        description: "The inputs that shape your discovery graph.",
        items: [
          { id: "genre-prefs", label: "Genre preferences", type: "chips", value: ["Dream Pop", "Electronic", "Afrobeats", "Indie"] },
          { id: "mood-prefs", label: "Mood preferences", type: "chips", value: ["Late night", "Uplifting", "Focus"] },
          { id: "artist-follows", label: "Artist follows", type: "chips", value: ["Ava Lin", "Temi", "PRISM", "Seren"] },
        ],
      },
      {
        title: "Globe Settings",
        description: "Controls for the core 3D discovery experience.",
        items: [
          { id: "auto-rotate", label: "Auto rotate globe", type: "toggle", value: true },
          { id: "motion-effects", label: "Motion effects", type: "toggle", value: true },
          { id: "simplified-globe", label: "Simplified globe mode", type: "toggle", value: false },
        ],
      },
    ],
  },
  {
    id: "creator",
    title: "Creator Tools",
    kicker: "Publishing and monetization",
    description: "Content management, analytics, and creator earnings controls.",
    groups: [
      {
        title: "Content Management",
        description: "Administer each publishing surface.",
        items: [
          { id: "manage-posts", label: "Manage posts", type: "button", value: "Open manager" },
          { id: "manage-shorts", label: "Manage shorts", type: "button", value: "Open manager" },
          { id: "manage-tracks", label: "Manage music tracks", type: "button", value: "Open manager" },
          { id: "schedule-posts", label: "Schedule posts", type: "button", value: "Open scheduler" },
        ],
      },
      {
        title: "Analytics",
        description: "High-level creator insight panels.",
        items: [
          { id: "analytics-views", label: "Views", type: "status", value: "1.8M last 30 days" },
          { id: "analytics-likes", label: "Likes", type: "status", value: "214K total interactions" },
          { id: "analytics-engagement", label: "Engagement", type: "status", value: "8.4% average rate" },
          { id: "analytics-audience", label: "Audience demographics", type: "button", value: "View report" },
        ],
      },
      {
        title: "Monetization",
        description: "Revenue settings and paid experiences.",
        items: [
          { id: "payouts", label: "Creator payouts", type: "button", value: "Manage payouts" },
          { id: "subscription", label: "Subscription content", type: "toggle", value: true },
          { id: "tips", label: "Tips / donations", type: "toggle", value: true },
        ],
      },
    ],
  },
  {
    id: "ruffy",
    title: "Ruffy AI Settings",
    kicker: "Assistant behavior",
    description: "Configure Ruffy modes, permissions, and automation.",
    groups: [
      {
        title: "Ruffy AI Mode",
        description: "Choose the main role Ruffy plays for you.",
        items: [
          {
            id: "ruffy-mode",
            label: "Assistant mode",
            type: "select",
            value: "music",
            options: [
              { label: "Music assistant", value: "music" },
              { label: "Content assistant", value: "content" },
              { label: "Creator assistant", value: "creator" },
              { label: "Coding assistant", value: "coding" },
            ],
          },
        ],
      },
      {
        title: "AI Permissions",
        description: "What Ruffy is allowed to inspect or generate.",
        items: [
          { id: "ai-analyze-posts", label: "Allow AI to analyze posts", type: "toggle", value: true },
          { id: "ai-captions", label: "Allow AI to generate captions", type: "toggle", value: true },
          { id: "ai-music-ideas", label: "Allow AI to generate music ideas", type: "toggle", value: true },
        ],
      },
      {
        title: "Automation",
        description: "Auto-generated creative assists and prediction tooling.",
        items: [
          { id: "auto-captions", label: "Auto caption suggestions", type: "toggle", value: true },
          { id: "auto-hashtags", label: "Auto hashtag suggestions", type: "toggle", value: true },
          { id: "trend-predictions", label: "Music trend predictions", type: "toggle", value: true },
        ],
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    kicker: "Sessions and protection",
    description: "Protect your account, monitor devices, and react to suspicious activity.",
    groups: [
      {
        title: "Security",
        description: "Session and login visibility.",
        items: [
          { id: "login-history", label: "Login history", type: "button", value: "View activity" },
          { id: "device-management", label: "Device management", type: "button", value: "Manage devices" },
          { id: "active-sessions", label: "Active sessions", type: "status", value: "3 active devices" },
          { id: "logout-all", label: "Logout all devices", type: "button", value: "Sign out everywhere", tone: "danger" },
        ],
      },
      {
        title: "Account protection",
        description: "Hardening controls for account access.",
        items: [
          { id: "2fa-security", label: "Two factor authentication", type: "toggle", value: true },
          { id: "backup-codes", label: "Backup codes", type: "button", value: "View codes" },
          { id: "suspicious-alerts", label: "Suspicious login alerts", type: "toggle", value: true },
        ],
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    kicker: "Connected platforms",
    description: "Manage external platform links and developer-facing connections.",
    groups: [
      {
        title: "Connected Platforms",
        description: "Streaming and social surfaces connected to Juzzo.",
        items: [
          { id: "spotify", label: "Spotify", type: "status", value: "Connected" },
          { id: "apple-music", label: "Apple Music", type: "status", value: "Connected" },
          { id: "youtube", label: "YouTube", type: "status", value: "Not connected" },
          { id: "discord", label: "Discord", type: "status", value: "Connected" },
          { id: "instagram", label: "Instagram", type: "status", value: "Connected" },
          { id: "tiktok", label: "TikTok", type: "status", value: "Not connected" },
        ],
      },
      {
        title: "Developer integrations",
        description: "Technical access points for advanced creator workflows.",
        items: [
          { id: "api-access", label: "API access", type: "button", value: "Manage keys" },
          { id: "webhooks", label: "Webhook integrations", type: "button", value: "Configure webhooks" },
          { id: "creator-tools-dev", label: "Creator tools", type: "button", value: "Open integrations" },
        ],
      },
    ],
  },
  {
    id: "data",
    title: "Data & Control",
    kicker: "Transparency and deletion",
    description: "Download, archive, deactivate, or permanently remove account data.",
    groups: [
      {
        title: "Data",
        description: "Inspect and export what Juzzo stores.",
        items: [
          { id: "download-data", label: "Download account data", type: "button", value: "Request export" },
          { id: "view-data", label: "View stored data", type: "button", value: "Open data center" },
        ],
      },
      {
        title: "Content",
        description: "Bulk-manage your published library.",
        items: [
          { id: "delete-posts", label: "Delete posts", type: "button", value: "Bulk delete", tone: "danger" },
          { id: "archive-posts", label: "Archive posts", type: "button", value: "Open archive" },
        ],
      },
      {
        title: "Account",
        description: "Last-resort account controls.",
        items: [
          { id: "deactivate-account", label: "Deactivate account", type: "button", value: "Deactivate", tone: "danger" },
          { id: "delete-account", label: "Delete account", type: "button", value: "Delete permanently", tone: "danger" },
        ],
      },
    ],
  },
  {
    id: "appearance",
    title: "Appearance",
    kicker: "Theme and motion",
    description: "Customize visual style, accenting, and animation levels.",
    groups: [
      {
        title: "Theme",
        description: "Control base theme and accents.",
        items: [
          { id: "theme", label: "Theme", type: "select", value: "dark", options: [{ label: "Dark", value: "dark" }, { label: "Light", value: "light" }, { label: "System", value: "system" }] },
          { id: "accent", label: "Accent color", type: "select", value: "blue", options: [{ label: "Blue", value: "blue" }, { label: "Purple", value: "purple" }, { label: "Custom", value: "custom" }] },
        ],
      },
      {
        title: "Motion",
        description: "Reduce or disable movement-heavy effects.",
        items: [
          { id: "reduced-motion", label: "Reduced motion", type: "toggle", value: false },
          { id: "animations", label: "Animations on/off", type: "toggle", value: true },
        ],
      },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility",
    kicker: "Usability defaults",
    description: "Make the platform easier to read, hear, and navigate.",
    groups: [
      {
        title: "Accessibility",
        description: "Defaults that improve readability and assistive compatibility.",
        items: [
          { id: "text-size", label: "Text size", type: "select", value: "medium", options: [{ label: "Small", value: "small" }, { label: "Medium", value: "medium" }, { label: "Large", value: "large" }] },
          { id: "high-contrast", label: "High contrast mode", type: "toggle", value: false },
          { id: "screen-reader", label: "Screen reader optimization", type: "toggle", value: true },
          { id: "caption-defaults", label: "Caption defaults", type: "select", value: "always-on", options: [{ label: "Always on", value: "always-on" }, { label: "When available", value: "available" }, { label: "Off", value: "off" }] },
        ],
      },
    ],
  },
  {
    id: "experimental",
    title: "Experimental Features",
    kicker: "Beta switches",
    description: "Opt into early releases and unstable features.",
    groups: [
      {
        title: "Labs",
        description: "Preview features before broader rollout.",
        items: [
          { id: "beta-globe", label: "New music globe version", type: "toggle", value: true },
          { id: "beta-ai-recs", label: "AI recommendations", type: "toggle", value: true },
          { id: "beta-creator-tools", label: "Creator tools beta", type: "toggle", value: false },
        ],
      },
    ],
  },
];
