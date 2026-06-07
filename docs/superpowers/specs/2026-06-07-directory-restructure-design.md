# Directory Restructure Design

Date: 2026-06-07  
Project: Instagram-app (Lumina)

## Overview

Restructure the monolithic `app.ts` (62KB, single file) into a Vite + React + TypeScript project following Feature-Sliced Design, with Tailwind CSS and Redux Toolkit.

## Stack

| Tool | Choice |
|------|--------|
| Bundler | Vite |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS (replaces embedded CSS string) |
| State | Redux Toolkit (replaces useState in App) |
| Icons | lucide-react (already used) |

## Directory Structure

```
Instagram-app/
├── src/
│   ├── app/
│   │   ├── App.tsx          # Root component: view switching, Toast, modals
│   │   ├── main.tsx         # Entry point: ReactDOM.createRoot
│   │   └── store.ts         # Redux store combining all slices
│   │
│   ├── features/
│   │   ├── feed/
│   │   │   ├── components/
│   │   │   │   ├── Feed.tsx
│   │   │   │   ├── Post.tsx
│   │   │   │   ├── PostModal.tsx
│   │   │   │   └── CreateModal.tsx
│   │   │   ├── feedSlice.ts   # posts state: likes, saves, comments, openId
│   │   │   └── index.ts       # re-exports public API
│   │   │
│   │   ├── stories/
│   │   │   ├── components/
│   │   │   │   ├── Stories.tsx
│   │   │   │   └── StoryViewer.tsx
│   │   │   ├── storiesSlice.ts  # stories state: seen/unseen
│   │   │   └── index.ts
│   │   │
│   │   ├── explore/
│   │   │   ├── components/
│   │   │   │   └── Explore.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   └── Profile.tsx
│   │   │   ├── profileSlice.ts  # tab state: "posts" | "saved"
│   │   │   └── index.ts
│   │   │
│   │   ├── reels/
│   │   │   ├── components/
│   │   │   │   └── Reels.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── messages/
│   │       ├── components/
│   │       │   └── Messages.tsx
│   │       ├── messagesSlice.ts  # conversations, activeId, typingConv
│   │       └── index.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   ├── media/
│   │   │   │   ├── Media.tsx
│   │   │   │   └── VideoBox.tsx
│   │   │   └── icons/
│   │   │       ├── LayoutGridIcon.tsx
│   │   │       └── PenSquare.tsx
│   │   │
│   │   ├── data/
│   │   │   └── seeds.ts         # seedPosts, seedStories, seedProfile, seedConversations, cannedReplies
│   │   │
│   │   ├── lib/
│   │   │   └── storage.ts       # loadState / saveState (window.storage wrapper)
│   │   │
│   │   ├── types/
│   │   │   └── index.ts         # Post, Story, Conversation, Profile, Message types
│   │   │
│   │   └── utils/
│   │       └── index.ts         # hue, gradCss, svgGrad, svgAvatar, img, av, fmt, ago, uid
│   │
│   └── index.css                # Tailwind directives (@tailwind base/components/utilities)
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## Redux Slices

| Slice | State |
|-------|-------|
| `feedSlice` | `posts[]`, `openId` |
| `storiesSlice` | `stories[]` |
| `messagesSlice` | `conversations[]`, `activeId`, `typingConv` |
| `profileSlice` | `profile`, `tab` |

Global state shared across features (`dark`, `view`, `toast`) stays in `App.tsx` as local state since it is purely UI routing state that does not need persistence or cross-feature coordination.

## CSS Migration Strategy

The embedded CSS string (`const CSS`) is converted to Tailwind utility classes. Components receive className props using Tailwind. The `gradCss` / `svgGrad` utilities that generate dynamic inline styles remain as JS utilities since Tailwind cannot handle runtime-generated values.

## Data Flow

```
seeds.ts → Redux slices (initial state)
storage.ts → loadState() → preloadedState in store.ts
store.ts → useSelector / useDispatch in components
App.tsx → renders active feature view based on `view` state
```

## Files to Create (Config)

| File | Purpose |
|------|---------|
| `package.json` | vite, react, redux-toolkit, tailwindcss, lucide-react |
| `vite.config.ts` | `@vitejs/plugin-react` |
| `tsconfig.json` | strict mode, path aliases (`@/` → `src/`) |
| `tailwind.config.ts` | content: `src/**/*.tsx` |
| `index.html` | Vite entry HTML |

## Migration Order

1. Config files (package.json, vite.config, tsconfig, tailwind.config, index.html)
2. `shared/types/index.ts` — type definitions first (no dependencies)
3. `shared/utils/index.ts` — pure functions
4. `shared/lib/storage.ts` — persistence layer
5. `shared/data/seeds.ts` — seed data (depends on types)
6. `shared/components/` — Media, VideoBox, icons, layout
7. Redux slices — feedSlice, storiesSlice, messagesSlice, profileSlice
8. `app/store.ts` — combine slices
9. Feature components — one feature at a time (feed → stories → explore → profile → reels → messages)
10. `app/App.tsx` — wire everything together
11. `app/main.tsx` — entry point
12. Tailwind class migration — replace embedded CSS string with utility classes
