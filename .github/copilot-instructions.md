# Copilot Instructions — Juzzo Website

## Project Overview
Juzzo is a **social media + music discovery web app** — think TikTok shorts feed meets Spotify discovery with a premium Apple Music aesthetic. Users watch/post short videos, discover music through an interactive **3D music globe**, follow creators, and play songs inline. A companion mobile app shares the same Supabase backend; this repo is the **desktop-optimized website**, deployed on **Vercel**.

The **music globe discovery interface is the single most important feature** on the platform. It is not a visual gimmick — it is a core architectural component that connects to track playback, creator profiles, related songs, and trending content. Treat it accordingly in every design and implementation decision.

## Tech Stack
- **Framework:** Next.js (App Router) with React and TypeScript
- **Styling:** Tailwind CSS — use utility classes; avoid custom CSS files unless truly necessary
- **Animation:** Framer Motion — all transitions, micro-interactions, and page-level motion
- **Backend:** Supabase — auth (Google, Apple, email/password), Postgres database, realtime subscriptions, and storage
- **Media:** Supabase Storage (or Cloudflare R2) for video/audio assets; HTML5 `<video>` for shorts; `<audio>` / Web Audio API for music streaming
- **3D / Globe:** `@react-three/fiber` + `@react-three/drei` — the globe is built entirely in React Three Fiber
- **Deployment:** Vercel (auto-deploy from `main` branch)

## Project Structure
```
src/
  app/
    (auth)/               # Unauthenticated route group
      login/              # Google, Apple, email/password login
      signup/             # Registration
      reset-password/     # Password reset flow
    (main)/               # Authenticated main app layout
      feed/               # Vertical shorts feed
      discover/           # Music globe discovery page (hero feature)
      profile/[id]/       # Creator profile pages
      upload/             # Upload shorts or music (authed only)
    api/                  # Route handlers (Supabase proxy, webhooks)
    layout.tsx            # Root layout — wraps FloatingPlayer + providers
    middleware.ts         # Supabase auth session refresh + route protection
  components/
    globe/                # ★ Core feature — see "Music Globe Architecture" below
      MusicGlobe.tsx      # <Canvas> wrapper, scene setup, camera
      GlobeNode.tsx       # Individual album-cover node on the sphere
      GlobeControls.tsx   # OrbitControls config (drag-rotate, zoom)
      GlobeHoverPreview.tsx  # Hover tooltip — shows track title, artist, preview audio
      GlobeDataLayer.tsx  # Fetches & maps tracks to 3D positions
      useGlobeInteraction.ts # Click, hover, zoom event handlers
    shorts/               # ShortCard, ShortsCarousel, VideoPlayer
    player/               # FloatingPlayer, PlayerControls, ProgressBar
    upload/               # TrackUploadForm, ShortUploadForm, FileDropzone, UploadProgress
    profile/              # ProfileHeader, ProfileTabs, ContentGrid
    notifications/        # NotificationList, NotificationItem
    ui/                   # Shared primitives (Button, Avatar, Modal, etc.)
  lib/
    supabase/
      client.ts           # createBrowserClient — for client components
      server.ts           # createServerClient — for server components & route handlers
      middleware.ts        # Session refresh helper used in app/middleware.ts
      social.ts           # Likes, comments, reposts, follows — RPC + realtime
      queries/            # Reusable query functions (getTracks, getShorts, etc.)
    hooks/                # usePlayer, useInfiniteScroll, useAuth, useGlobe
    utils/
      cn.ts               # clsx + tailwind-merge helper
      animations.ts       # Shared Framer Motion animation presets
      constants.ts        # App-wide constants
  types/                  # Shared TypeScript interfaces (User, Track, Short, etc.)
  providers/              # React context providers (PlayerProvider, AuthProvider)
public/                   # Static assets, favicons, OG images
```

## Music Globe Architecture
The globe is the **signature feature** and is treated as a first-class system, not just a component.

**Component hierarchy:**
```
<Canvas>                          ← @react-three/fiber canvas
  <OrbitControls>                 ← drag to rotate, pinch/scroll to zoom
  <ambientLight> + <pointLight>  ← lighting
  <GlobeDataLayer>               ← fetches tracks, maps to spherical coords
    <GlobeNode />                ← one per track: album art as texture on a plane/sprite
    <GlobeNode />
    ...
  </GlobeDataLayer>
</Canvas>
<GlobeHoverPreview />            ← HTML overlay, positioned via raycasting
```

**Interactions the globe must support:**
| Gesture | Behavior |
|---|---|
| Drag | Rotate the globe freely (OrbitControls) |
| Scroll / Pinch | Zoom in (see more detail) or out (see galaxy overview) |
| Hover on node | Show track title + artist + short audio preview |
| Click on node | Start full playback via FloatingPlayer + open track detail |
| Click artist name | Navigate to `profile/[id]` |

**Data layers — the globe is a discovery engine, not a static feed:**
The globe blends multiple data sources into a layered experience that changes with zoom level and auth state.

| Layer | Source | When shown |
|---|---|---|
| Trending | Top tracks by `play_count` / recent `track_plays` | Always — default backbone of the globe |
| Genre clusters | Tracks grouped by `genre` field | Always — genres form spatial regions on the sphere |
| Personalized | Tracks based on user's listening history, follows, and likes | Only when logged in — blended into the sphere |
| Related songs | Tracks similar to a selected/hovered node | On zoom-in near a node |

**Zoom-level behavior:**
| Zoom level | What the user sees |
|---|---|
| Far (galaxy view) | Genre clusters as colored regions + trending highlights as bright nodes |
| Medium | Individual album covers become visible, genre labels appear |
| Close | Full album art, track titles, artist names; personalized & related songs surface |

**Data flow:** `discover/page.tsx` → server-fetches trending + genre-clustered tracks → passes to `<MusicGlobe tracks={tracks} />` → `GlobeDataLayer` distributes tracks as `GlobeNode` instances using spherical coordinates (genre determines region, popularity determines size/brightness) → interactions dispatch to `PlayerProvider` context and Next.js router. For logged-in users, client-side fetches blend personalized recommendations into the existing node map.

**Data refresh strategy (v1):**
- Trending data is fetched on page load and refreshed on a timer (e.g., every 5 minutes via `setInterval` + client fetch).
- Personalized data is fetched once on mount for logged-in users.
- Full realtime (Supabase Realtime subscriptions) is **not required for v1**. Periodic refresh + reload is sufficient.
- Design the data hooks (`useGlobeData`) so a realtime subscription can be plugged in later without refactoring the component tree.

**Performance rules:**
- Use `React.memo` on `GlobeNode` — there may be hundreds on screen.
- Use instanced meshes (`<Instances>` from drei) when possible.
- Lazy-load album art textures; show a placeholder sphere until loaded.
- Implement LOD: at far zoom, show dots; at close zoom, show full album covers.
- The `<Canvas>` must be wrapped in `React.lazy` + `Suspense` so it doesn't block page hydration.

## Authentication
Supabase Auth with three providers:

| Method | Config |
|---|---|
| Google OAuth | `supabase.auth.signInWithOAuth({ provider: 'google' })` |
| Apple OAuth | `supabase.auth.signInWithOAuth({ provider: 'apple' })` |
| Email / Password | `supabase.auth.signUp()` / `supabase.auth.signInWithPassword()` |

**Route protection:** `middleware.ts` at the app root refreshes the Supabase session on every request. Routes inside `(main)/` require an active session; unauthenticated users are redirected to `(auth)/login`. Routes inside `(auth)/` redirect to `(main)/discover` if the user is already signed in.

**Authenticated actions** (require session): uploading shorts, uploading music, liking, commenting, following, creating playlists.

**Unauthenticated access** (allowed): browsing the discover globe, watching shorts feed, viewing creator profiles (read-only).

## Supabase Database Schema

### Core v1 Tables

### `users`
Managed by Supabase Auth. `auth.users` is the source of truth.
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Provided by Supabase Auth |
| `email` | `text` | Unique |
| `created_at` | `timestamptz` | Default `now()` |

### `profiles`
Extended user info (1:1 with `auth.users`). Created via trigger on signup.
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK FK → `auth.users.id` | |
| `username` | `text` | Unique, indexed |
| `display_name` | `text` | |
| `avatar_url` | `text` | Points to Supabase Storage |
| `bio` | `text` | |
| `is_verified` | `boolean` | Default `false` |
| `created_at` | `timestamptz` | |

### `tracks`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `profiles.id` | Uploader / artist |
| `title` | `text` | |
| `artist_name` | `text` | Denormalized for fast display |
| `audio_url` | `text` | Supabase Storage path |
| `cover_url` | `text` | Album cover image — used as globe node texture |
| `duration` | `integer` | Seconds |
| `genre` | `text` | Indexed — used for globe spatial clustering |
| `play_count` | `integer` | Default `0` |
| `created_at` | `timestamptz` | |
**Indexes:** `genre`, `user_id`, `created_at DESC`, `play_count DESC`

### `shorts`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `profiles.id` | Creator |
| `video_url` | `text` | Supabase Storage path |
| `caption` | `text` | |
| `track_id` | `uuid` FK → `tracks.id` | Nullable — linked song |
| `view_count` | `integer` | Default `0` |
| `created_at` | `timestamptz` | |
**Indexes:** `user_id`, `track_id`, `created_at DESC`

### `likes`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `profiles.id` | |
| `target_type` | `text` | `'track'` or `'short'` |
| `target_id` | `uuid` | ID of the liked track or short |
| `created_at` | `timestamptz` | |
**Unique constraint:** `(user_id, target_type, target_id)` — prevents double-likes.

### `comments`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `profiles.id` | |
| `target_type` | `text` | `'track'` or `'short'` |
| `target_id` | `uuid` | |
| `body` | `text` | |
| `created_at` | `timestamptz` | |
**Indexes:** `(target_type, target_id, created_at DESC)` for paginated comment threads.

### `follows`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `follower_id` | `uuid` FK → `profiles.id` | |
| `following_id` | `uuid` FK → `profiles.id` | |
| `created_at` | `timestamptz` | |
**Unique constraint:** `(follower_id, following_id)`. **Indexes:** both FK columns for fast follower/following counts.

### `reposts`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `profiles.id` | User who reposted |
| `target_type` | `text` | `'track'` or `'short'` |
| `target_id` | `uuid` | |
| `created_at` | `timestamptz` | |
**Unique constraint:** `(user_id, target_type, target_id)` — one repost per item per user.

### `playlists`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `profiles.id` | Owner |
| `title` | `text` | |
| `description` | `text` | |
| `cover_url` | `text` | |
| `is_public` | `boolean` | Default `true` |
| `created_at` | `timestamptz` | |

### `playlist_tracks`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `playlist_id` | `uuid` FK → `playlists.id` ON DELETE CASCADE | |
| `track_id` | `uuid` FK → `tracks.id` | |
| `position` | `integer` | For ordering |
| `added_at` | `timestamptz` | |
**Unique constraint:** `(playlist_id, track_id)`.

### `track_plays`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `track_id` | `uuid` FK → `tracks.id` | |
| `user_id` | `uuid` FK → `profiles.id` | Nullable (anonymous plays) |
| `played_at` | `timestamptz` | Default `now()` |
Used for trending algorithms, personalized recommendations, and analytics. Increment `tracks.play_count` via DB trigger.

### `short_views`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `short_id` | `uuid` FK → `shorts.id` | |
| `user_id` | `uuid` FK → `profiles.id` | Nullable |
| `viewed_at` | `timestamptz` | Default `now()` |
Increment `shorts.view_count` via DB trigger.

### `saved_tracks`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `profiles.id` | |
| `track_id` | `uuid` FK → `tracks.id` | |
| `saved_at` | `timestamptz` | Default `now()` |
**Unique constraint:** `(user_id, track_id)`.

### `saved_shorts`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → `profiles.id` | |
| `short_id` | `uuid` FK → `shorts.id` | |
| `saved_at` | `timestamptz` | Default `now()` |
**Unique constraint:** `(user_id, short_id)`.

### `notifications`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `recipient_id` | `uuid` FK → `profiles.id` | User who receives the notification |
| `actor_id` | `uuid` FK → `profiles.id` | User who triggered it |
| `type` | `text` | `'like'`, `'comment'`, `'follow'`, `'repost'`, `'mention'` |
| `target_type` | `text` | Nullable — `'track'`, `'short'`, `'comment'` |
| `target_id` | `uuid` | Nullable — ID of the related entity |
| `is_read` | `boolean` | Default `false` |
| `created_at` | `timestamptz` | |
**Indexes:** `(recipient_id, is_read, created_at DESC)` for fast unread notification queries.
Created via DB triggers or application-level inserts when social actions occur.

### Phase 2 Tables (messaging — scaffolded for future)

> **Do not build messaging UI in v1**, but the schema is documented here so the database can be designed with messaging in mind. Keep `profiles.id` as the universal user identifier so messaging FK relationships work without schema changes.

### `conversations`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Updated on new message |

### `conversation_participants`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `conversation_id` | `uuid` FK → `conversations.id` ON DELETE CASCADE | |
| `user_id` | `uuid` FK → `profiles.id` | |
| `joined_at` | `timestamptz` | |
**Unique constraint:** `(conversation_id, user_id)`.

### `messages`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `conversation_id` | `uuid` FK → `conversations.id` ON DELETE CASCADE | |
| `sender_id` | `uuid` FK → `profiles.id` | |
| `body` | `text` | |
| `created_at` | `timestamptz` | |

### `message_reads`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `message_id` | `uuid` FK → `messages.id` ON DELETE CASCADE | |
| `user_id` | `uuid` FK → `profiles.id` | |
| `read_at` | `timestamptz` | |
**Unique constraint:** `(message_id, user_id)`.

**Schema rules for AI agents:**
- Always use `uuid` primary keys (Supabase default).
- All timestamps use `timestamptz` with default `now()`.
- Use Row Level Security (RLS) on every table. Public reads for content tables; authenticated writes with `auth.uid() = user_id` checks.
- When adding a new table, consider if the mobile app also needs access and write RLS policies accordingly.
- The `profiles.id` column is the universal user FK target across all tables — this ensures messaging and any future features connect cleanly.
- Use polymorphic `target_type` + `target_id` pattern (as in `likes`, `comments`, `reposts`, `notifications`) for actions that can apply to multiple entity types.

## Key Architecture Decisions
- **App Router (not Pages Router):** Use `app/` directory, server components by default, `"use client"` only when state/interactivity is needed.
- **Shared Supabase backend:** The mobile app uses the same Supabase project. Never add website-only database migrations without considering mobile impact. Access Supabase via `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server components / route handlers).
- **Floating music player:** `<FloatingPlayer>` lives in the root `layout.tsx` and persists across page navigations. Player state is managed via `PlayerProvider` context so any component (including globe nodes) can trigger playback.
- **Globe is a core system:** The globe connects to the data layer (trending tracks, genre clusters), the player (click-to-play), navigation (click artist → profile), and social features (like from hover preview). It is **not** an isolated visual component.

## Conventions
- **File naming:** PascalCase for components (`MusicGlobe.tsx`), camelCase for utilities/hooks (`usePlayer.ts`), kebab-case for routes (`discover/`).
- **One component per file.** Co-locate component-specific hooks or constants in the same directory.
- **TypeScript strict mode.** All props must be typed via interfaces in the component file or imported from `src/types/`.
- **Tailwind only** for styling. Use `cn()` helper (clsx + tailwind-merge) for conditional classes.
- **Framer Motion patterns:** Use `motion.div` with `initial`/`animate`/`exit` props. Wrap route transitions in `<AnimatePresence>`. Keep animation configs in a shared `lib/utils/animations.ts` when reused.
- **Supabase queries:** Use the Supabase JS client directly (no ORM). Server components use `createServerClient`; client components use `createBrowserClient`. Never expose service-role keys client-side.
- **Social interactions:** likes, comments, reposts, follows all go through dedicated functions in `lib/supabase/social.ts` — use Supabase RPC or realtime subscriptions.

## Development Workflow
```bash
npm install            # install dependencies
npm run dev            # start Next.js dev server (localhost:3000)
npm run build          # production build (also used by Vercel)
npm run lint           # ESLint
npx supabase start     # local Supabase stack (requires Docker)
npx supabase db push   # push migrations to remote Supabase
```

## Vercel Deployment
- The site auto-deploys from the `main` branch on push.
- **Build command:** `next build` (Vercel default for Next.js).
- **Output:** standalone mode for optimal cold-start performance — set `output: 'standalone'` in `next.config.ts` if needed.
- **Environment variables** (set in Vercel dashboard → Settings → Environment Variables):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (server-only, **never** prefix with `NEXT_PUBLIC_`) |

- Use `.env.local` for local development (git-ignored). Example:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```
- **Image optimization:** Use `next/image` with `remotePatterns` configured for Supabase Storage domains in `next.config.ts`.

## Creator Upload Flow
The website is **not** view-only. Creators can upload tracks and shorts directly from the desktop — the desktop experience is actually preferred for uploads, organization, and content management.

**Upload routes:** `(main)/upload/` — requires authenticated session.
- `upload/track` — upload audio file + cover image + metadata (title, artist name, genre, duration auto-detected)
- `upload/short` — upload video file + caption + optional linked track

**Upload components** (`components/upload/`):
- `TrackUploadForm.tsx` — multi-step form: file drop → metadata → cover image → publish
- `ShortUploadForm.tsx` — video drop → caption + track link → publish
- `FileDropzone.tsx` — shared drag-and-drop zone with file type validation and size limits
- `UploadProgress.tsx` — progress bar during Supabase Storage upload

**Storage rules:**
- Audio files → `supabase.storage.from('tracks').upload(...)` — accepted formats: `.mp3`, `.wav`, `.m4a`, `.flac`
- Video files → `supabase.storage.from('shorts').upload(...)` — accepted formats: `.mp4`, `.mov`, `.webm`
- Cover images → `supabase.storage.from('covers').upload(...)` — accepted formats: `.jpg`, `.png`, `.webp`
- Set Supabase Storage bucket policies: authenticated uploads only, public reads for published content.
- Use `crypto.randomUUID()` for storage filenames to avoid collisions.

## Feature Priority Order
When making decisions about what to build, fix, or optimize, follow this priority:

| Priority | Feature | Status |
|---|---|---|
| 1 | 🌍 Music discovery globe | Core — build first, optimize always |
| 2 | 📹 Shorts feed experience | Core — vertical feed with autoplay |
| 3 | 🎵 Creator uploads (tracks + shorts) | Core — desktop upload flow |
| 4 | 👤 Profiles and follows | Core — creator pages, follower system |
| 5 | 🔔 Notifications | Core v1 — likes, comments, follows, reposts |
| 6 | 💬 Messaging | Phase 2 — schema scaffolded, UI deferred |

When an AI agent is working on the codebase and has to make a tradeoff (e.g., performance budget, complexity, time), favor higher-priority features.

## Design Principles
- **Dark-first UI** with rich gradients — the aesthetic is premium/cinematic, not flat.
- **The globe should feel like a music galaxy** — a planet of songs floating in space, not a generic data visualization.
- **Vertical shorts feed** on desktop: centered column, keyboard navigation (↑/↓), auto-play on scroll.
- **Seamless audio continuity:** navigating between pages must not interrupt the currently playing track.
- **Mobile-aware but desktop-optimized:** responsive layout, but the primary target is ≥1024px screens.
