# Directory Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 単一の `app.ts` (62KB) を Vite + React + TypeScript + Tailwind CSS + Redux Toolkit のベストプラクティス構成に分割する。

**Architecture:** Feature-Sliced Design。`features/` に機能ドメイン、`shared/` に共通コード、`app/` にルート・Store。既存の CSS クラス名は `src/index.css` に移動して保持し、Tailwind と共存させる。

**Tech Stack:** Vite 6, React 18, TypeScript 5 (strict), Tailwind CSS 3, Redux Toolkit 2, Vitest 2, React Testing Library 16

---

### Task 1: Config ファイル一式

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: package.json を作成**

```json
{
  "name": "lumina-app",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.3.0",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-redux": "^9.1.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.6.3",
    "vite": "^6.0.5",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: vite.config.ts を作成**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

- [ ] **Step 3: tsconfig.json を作成**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: tsconfig.node.json, tailwind.config.ts, postcss.config.js を作成**

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts"]
}
```

`tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
```

`postcss.config.js`:
```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

- [ ] **Step 5: index.html と src/vite-env.d.ts を作成**

`index.html`:
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lumina</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/app/main.tsx"></script>
  </body>
</html>
```

`src/vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />

interface StorageAPI {
  get(key: string): Promise<{ value: string } | null>;
  set(key: string, value: string): Promise<void>;
}

interface Window {
  storage?: StorageAPI;
}
```

- [ ] **Step 6: 依存関係をインストール**

```bash
npm install
```

Expected: `node_modules/` が作成され、エラーなく完了する。

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.ts tsconfig.json tsconfig.node.json tailwind.config.ts postcss.config.js index.html src/vite-env.d.ts
git commit -m "chore: add Vite + Tailwind + Redux Toolkit project config"
```

---

### Task 2: テストセットアップ

**Files:**
- Create: `src/test/setup.ts`

- [ ] **Step 1: テストセットアップファイルを作成**

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
```

- [ ] **Step 2: Commit**

```bash
git add src/test/setup.ts
git commit -m "test: add vitest + testing-library setup"
```

---

### Task 3: 型定義

**Files:**
- Create: `src/shared/types/index.ts`
- Create: `src/shared/types/index.test.ts`

- [ ] **Step 1: テストを書く（コンパイル通過を確認）**

`src/shared/types/index.test.ts`:
```typescript
import type { Post, Story, Conversation, Profile, Message, Comment, ViewKey, TabKey } from "./index";

it("types compile", () => {
  const comment: Comment = { id: "c1", user: "alice", text: "hi" };
  const post: Post = {
    id: "p1", inFeed: true, mine: false,
    user: { username: "alice", avatar: "", verified: false },
    image: "", fallback: "", caption: "", likes: 0, liked: false,
    saved: false, createdAt: 0, comments: [comment],
  };
  const story: Story = { username: "alice", avatar: "", seen: false };
  const msg: Message = { id: "m1", fromMe: true, text: "hi", at: 0 };
  const conv: Conversation = {
    id: "c1", user: { username: "alice", avatar: "", verified: false },
    online: true, unread: 0, messages: [msg],
  };
  const profile: Profile = {
    username: "u", name: "n", avatar: "", verified: false,
    bio: "", posts: 0, followers: 0, following: 0,
  };
  const view: ViewKey = "home";
  const tab: TabKey = "posts";
  expect(post.id).toBe("p1");
  expect(story.username).toBe("alice");
  expect(conv.id).toBe("c1");
  expect(profile.username).toBe("u");
  expect(view).toBe("home");
  expect(tab).toBe("posts");
});
```

- [ ] **Step 2: テストを実行して FAIL を確認**

```bash
npx vitest run src/shared/types/index.test.ts
```

Expected: FAIL — `Cannot find module './index'`

- [ ] **Step 3: 型定義ファイルを実装**

`src/shared/types/index.ts`:
```typescript
export interface Comment {
  id: string;
  user: string;
  text: string;
}

export interface PostUser {
  username: string;
  avatar: string;
  verified: boolean;
}

export interface Post {
  id: string;
  inFeed: boolean;
  mine: boolean;
  user: PostUser;
  image: string;
  fallback: string;
  video?: string;
  caption: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  createdAt: number;
  comments: Comment[];
}

export interface Story {
  username: string;
  avatar: string;
  bg?: string;
  video?: string;
  seen: boolean;
}

export interface Message {
  id: string;
  fromMe: boolean;
  text: string;
  at: number;
}

export interface ConvUser {
  username: string;
  avatar: string;
  verified: boolean;
}

export interface Conversation {
  id: string;
  user: ConvUser;
  online: boolean;
  unread: number;
  messages: Message[];
}

export interface Profile {
  username: string;
  name: string;
  avatar: string;
  verified: boolean;
  bio: string;
  posts: number;
  followers: number;
  following: number;
}

export type ViewKey = "home" | "explore" | "reels" | "messages" | "profile";
export type TabKey = "posts" | "saved";
```

- [ ] **Step 4: テストを実行して PASS を確認**

```bash
npx vitest run src/shared/types/index.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/types/
git commit -m "feat: add shared type definitions"
```

---

### Task 4: ユーティリティ関数

**Files:**
- Create: `src/shared/utils/index.ts`
- Create: `src/shared/utils/index.test.ts`

- [ ] **Step 1: テストを書く**

`src/shared/utils/index.test.ts`:
```typescript
import { hue, fmt, ago, uid, USE_REAL_MEDIA } from "./index";

describe("hue", () => {
  it("returns a number in [0, 360)", () => {
    const h = hue("tokyo");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(360);
  });
  it("is deterministic", () => {
    expect(hue("seed")).toBe(hue("seed"));
  });
});

describe("fmt", () => {
  it("formats numbers with ja-JP locale", () => {
    expect(fmt(12430)).toBe("12,430");
  });
});

describe("ago", () => {
  it("returns たった今 for < 60s", () => {
    expect(ago(Date.now() - 30000)).toBe("たった今");
  });
  it("returns minutes for < 1h", () => {
    expect(ago(Date.now() - 5 * 60 * 1000)).toBe("5分前");
  });
});

describe("uid", () => {
  it("returns unique strings", () => {
    expect(uid()).not.toBe(uid());
  });
  it("returns a non-empty string", () => {
    expect(uid().length).toBeGreaterThan(0);
  });
});

describe("USE_REAL_MEDIA", () => {
  it("is a boolean", () => {
    expect(typeof USE_REAL_MEDIA).toBe("boolean");
  });
});
```

- [ ] **Step 2: テストを実行して FAIL を確認**

```bash
npx vitest run src/shared/utils/index.test.ts
```

Expected: FAIL — `Cannot find module './index'`

- [ ] **Step 3: ユーティリティを実装**

`src/shared/utils/index.ts`:
```typescript
import type { Profile } from "@/shared/types";

export const USE_REAL_MEDIA = false;

export const hue = (s = ""): number => {
  let h = 0;
  for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
};

export const gradCss = (seed: string): string => {
  const a = hue(seed), b = (a + 50) % 360, c = (a + 200) % 360;
  return (
    `radial-gradient(at 22% 22%, hsl(${a} 78% 64%) 0px, transparent 55%),` +
    `radial-gradient(at 80% 28%, hsl(${b} 78% 58%) 0px, transparent 55%),` +
    `radial-gradient(at 50% 82%, hsl(${c} 72% 52%) 0px, transparent 55%),` +
    `hsl(${a} 62% 50%)`
  );
};

export const svgGrad = (seed: string, w = 640, h = 640): string => {
  const a = hue(seed), b = (a + 45) % 360, c = (a + 210) % 360;
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${a},74%,60%)'/><stop offset='1' stop-color='hsl(${c},68%,44%)'/></linearGradient></defs><rect width='${w}' height='${h}' fill='url(#g)'/><circle cx='${Math.round(w * 0.72)}' cy='${Math.round(h * 0.3)}' r='${Math.round(w * 0.34)}' fill='hsl(${b},85%,66%)' opacity='0.5'/><circle cx='${Math.round(w * 0.24)}' cy='${Math.round(h * 0.76)}' r='${Math.round(w * 0.27)}' fill='hsl(${a},88%,72%)' opacity='0.4'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(s)}`;
};

export const svgAvatar = (n: number): string => {
  const a = (n * 53) % 360, b = (a + 50) % 360;
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><defs><linearGradient id='a' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${a},66%,62%)'/><stop offset='1' stop-color='hsl(${b},66%,45%)'/></linearGradient></defs><rect width='96' height='96' fill='url(#a)'/><circle cx='48' cy='38' r='17' fill='white' opacity='0.92'/><path d='M18 86 a30 30 0 0 1 60 0 Z' fill='white' opacity='0.92'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(s)}`;
};

export const img = (seed: string, w = 640, h = 640): string => svgGrad(seed, w, h);

export const un = (id: string, w = 640, h = 640): string =>
  USE_REAL_MEDIA
    ? `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=75&auto=format`
    : svgGrad(id, w, h);

export const av = (n: number): string =>
  USE_REAL_MEDIA ? `https://i.pravatar.cc/150?img=${n}` : svgAvatar(n);

const VID_BASE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";
export const VID = (name: string): string => `${VID_BASE}/${name}.mp4`;

export const REEL_VIDEOS = [
  "ForBiggerJoyrides", "ForBiggerEscapes", "ForBiggerFun",
  "ForBiggerMeltdowns", "SubaruOutbackOnStreetAndDirt",
].map(VID);

export const fmt = (n: number): string => n.toLocaleString("ja-JP");

export const ago = (ts: number): string => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "たった今";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}日前`;
  return `${Math.floor(d / 7)}週間前`;
};

export const uid = (): string => Math.random().toString(36).slice(2, 9);

export const ME: Profile & { username: string; name: string; avatar: string; verified: boolean } = {
  username: "fuji.dev",
  name: "藤田 樹",
  avatar: av(12),
  verified: true,
  bio: "情報工学を学ぶ学生 👨‍💻\nReact / FastAPI / 数値計算\n📍 千葉",
  posts: 9,
  followers: 1284,
  following: 312,
};
```

- [ ] **Step 4: テストを実行して PASS を確認**

```bash
npx vitest run src/shared/utils/index.test.ts
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/shared/utils/
git commit -m "feat: add shared utility functions and constants"
```

---

### Task 5: 永続化レイヤー

**Files:**
- Create: `src/shared/lib/storage.ts`

- [ ] **Step 1: storage.ts を作成**

```typescript
// src/shared/lib/storage.ts
const STORE_KEY = "lumina-insta-state-v1";

export async function loadState(): Promise<Record<string, unknown> | null> {
  try {
    if (window.storage) {
      const r = await window.storage.get(STORE_KEY);
      return r ? (JSON.parse(r.value) as Record<string, unknown>) : null;
    }
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function saveState(data: Record<string, unknown>): Promise<void> {
  try {
    if (window.storage) {
      await window.storage.set(STORE_KEY, JSON.stringify(data));
      return;
    }
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    // storage errors are non-fatal
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/lib/storage.ts
git commit -m "feat: add storage persistence layer with localStorage fallback"
```

---

### Task 6: シードデータ

**Files:**
- Create: `src/shared/data/seeds.ts`

- [ ] **Step 1: seeds.ts を作成**

app.ts の `seedPosts`, `seedStories`, `seedProfile`, `seedConversations`, `cannedReplies` を移植する。ME は `@/shared/utils` からインポート。

```typescript
// src/shared/data/seeds.ts
import type { Post, Story, Conversation } from "@/shared/types";
import { av, un, img, VID, uid, ME } from "@/shared/utils";

const HOUR = 3600 * 1000;

export const seedPosts = (): Post[] => [
  {
    id: "p1", inFeed: true, mine: false,
    user: { username: "yuki.films", avatar: av(5), verified: true },
    image: un("1746150361967-7c20603d25cd"), fallback: img("tokyo-night"),
    caption: "夜の東京、ネオンが綺麗だった🌃 #tokyo #nightphotography",
    likes: 12430, liked: false, saved: false, createdAt: Date.now() - 2 * HOUR,
    comments: [
      { id: uid(), user: "ren.photo", text: "構図が最高すぎる…！" },
      { id: uid(), user: "aoi_", text: "これどこですか？📍" },
    ],
  },
  {
    id: "p2", inFeed: true, mine: false,
    user: { username: "sora.travels", avatar: av(32), verified: true },
    image: un("1551632811-561732d1e306"), fallback: img("mountain-trail"),
    caption: "ついに登頂🗻 4時間の登り、報われた瞬間。#登山 #hiking",
    likes: 34021, liked: true, saved: false, createdAt: Date.now() - 5 * HOUR,
    comments: [{ id: uid(), user: "k_design", text: "おめでとう！絶景🙌" }],
  },
  {
    id: "pv1", inFeed: true, mine: false,
    user: { username: "drive.jp", avatar: av(53), verified: false },
    video: VID("ForBiggerBlazes"),
    image: un("1549693578-d683be217e58"), fallback: img("drive-road"),
    caption: "週末ドライブ🚗 海沿いの道は最高だった #drive #weekend",
    likes: 5820, liked: false, saved: false, createdAt: Date.now() - 7 * HOUR,
    comments: [{ id: uid(), user: "road_trip", text: "音までいい！" }],
  },
  {
    id: "p3", inFeed: true, mine: false,
    user: { username: "cafe.tokyo", avatar: av(47), verified: false },
    image: un("1529892485617-25f63cd7b1e9"), fallback: img("latte-cup"),
    caption: "今日の一杯☕️ ラテアートの練習中です",
    likes: 876, liked: false, saved: true, createdAt: Date.now() - 9 * HOUR,
    comments: [{ id: uid(), user: "mina.eats", text: "上手！飲みに行きたい" }],
  },
  {
    id: "p4", inFeed: true, mine: false,
    user: { username: "design_daily", avatar: av(13), verified: false },
    image: un("1616440347437-b1c73416efc2"), fallback: img("ui-mockup"),
    caption: "新しいダッシュボードのリサーチ中。グリッドは正義。",
    likes: 2105, liked: false, saved: false, createdAt: Date.now() - 22 * HOUR,
    comments: [{ id: uid(), user: "dev_taro", text: "とても参考になります🙏" }],
  },
  {
    id: "pv2", inFeed: true, mine: false,
    user: { username: "ocean.days", avatar: av(28), verified: true },
    video: VID("ForBiggerEscapes"),
    image: un("1501555088652-021faa106b9b"), fallback: img("ocean-clip"),
    caption: "自然の中でリフレッシュ🌿 #nature #travel",
    likes: 18733, liked: false, saved: false, createdAt: Date.now() - 26 * HOUR,
    comments: [
      { id: uid(), user: "leaf_", text: "癒される〜🍃" },
      { id: uid(), user: "wave22", text: "行きたい！" },
    ],
  },
  {
    id: "p5", inFeed: true, mine: false,
    user: { username: "street.snap", avatar: av(8), verified: false },
    image: un("1503899036084-c55cdd92da26"), fallback: img("rain-street"),
    caption: "渋谷スナップ。雨の日も悪くない☔️",
    likes: 1567, liked: false, saved: false,
    createdAt: Date.now() - 30 * HOUR, comments: [],
  },
  {
    id: "p6", inFeed: true, mine: false,
    user: { username: "kana.draws", avatar: av(23), verified: false },
    image: un("1529778873920-4da4926a72c2"), fallback: img("sketch-cat"),
    caption: "うちの子🐈 #cat #ねこ #drawing の参考に",
    likes: 9402, liked: true, saved: false, createdAt: Date.now() - 49 * HOUR,
    comments: [
      { id: uid(), user: "art_lover", text: "かわいい〜🐾" },
      { id: uid(), user: "neko3", text: "うちの子に似てる！" },
    ],
  },
  ...(
    [
      ["1626968361222-291e74711449", "週末のコーディング📝"],
      ["1590212151175-e58edd96185b", "新しいセットアップ💻"],
      ["1501554728187-ce583db33af7", "散歩の途中で"],
      ["1569718212165-3a8278d5f624", "今日のランチ🍜"],
      ["1497636577773-f1231844b336", "読書のお供に📚"],
      ["1604928141064-207cea6f571f", "夜景がきれいな夕方"],
      ["1563311977-d285756282dc", "作業のお供☕️"],
      ["1616440347437-b1c73416efc2", "ガジェット沼"],
      ["1536098561742-ca998e48cbcc", "おしまい"],
    ] as [string, string][]
  ).map(([id, caption], i): Post => ({
    id: "m" + (i + 1), inFeed: false, mine: true, user: ME,
    image: un(id), fallback: img("fuji-" + (i + 1)), caption,
    likes: 120 + i * 37, liked: false, saved: false,
    createdAt: Date.now() - (i + 3) * 24 * HOUR, comments: [],
  })),
];

export const seedStories = (): Story[] => [
  { username: "yuki.films", avatar: av(5), bg: un("1540959733332-eab4deabeeaf", 480, 854), seen: false },
  { username: "sora.travels", avatar: av(32), video: VID("ForBiggerFun"), seen: false },
  { username: "cafe.tokyo", avatar: av(47), bg: un("1670404161009-29548c027d06", 480, 854), seen: false },
  { username: "design_daily", avatar: av(13), bg: un("1626968361222-291e74711449", 480, 854), seen: true },
  { username: "street.snap", avatar: av(8), bg: un("1549693578-d683be217e58", 480, 854), seen: false },
  { username: "kana.draws", avatar: av(23), bg: un("1529778873920-4da4926a72c2", 480, 854), seen: true },
  { username: "ren.photo", avatar: av(60), bg: un("1503899036084-c55cdd92da26", 480, 854), seen: false },
  { username: "mina.eats", avatar: av(45), bg: un("1569718212165-3a8278d5f624", 480, 854), seen: false },
];

export const seedConversations = (): Conversation[] => [
  {
    id: "c1", user: { username: "yuki.films", avatar: av(5), verified: true },
    online: true, unread: 2,
    messages: [
      { id: uid(), fromMe: false, text: "この前の夜景の写真、すごく良かった！", at: Date.now() - 40 * 60000 },
      { id: uid(), fromMe: true, text: "ありがとう🙌 設定教えようか？", at: Date.now() - 38 * 60000 },
      { id: uid(), fromMe: false, text: "ぜひ！", at: Date.now() - 12 * 60000 },
      { id: uid(), fromMe: false, text: "今度撮影一緒に行かない？📷", at: Date.now() - 11 * 60000 },
    ],
  },
  {
    id: "c2", user: { username: "sora.travels", avatar: av(32), verified: true },
    online: false, unread: 0,
    messages: [
      { id: uid(), fromMe: true, text: "登頂おめでとう🗻", at: Date.now() - 5 * 3600000 },
      { id: uid(), fromMe: false, text: "ありがとう！次は富士山行く予定", at: Date.now() - 4.5 * 3600000 },
    ],
  },
  {
    id: "c3", user: { username: "design_daily", avatar: av(13), verified: false },
    online: true, unread: 1,
    messages: [
      { id: uid(), fromMe: false, text: "Reactのコンポーネント設計の記事シェアするね", at: Date.now() - 2 * 3600000 },
      { id: uid(), fromMe: false, text: "参考になると思う👇", at: Date.now() - 2 * 3600000 },
    ],
  },
  {
    id: "c4", user: { username: "cafe.tokyo", avatar: av(47), verified: false },
    online: false, unread: 0,
    messages: [
      { id: uid(), fromMe: false, text: "新しいカフェ見つけたよ☕️", at: Date.now() - 26 * 3600000 },
      { id: uid(), fromMe: true, text: "いいね！週末行こう", at: Date.now() - 25 * 3600000 },
    ],
  },
  {
    id: "c5", user: { username: "kana.draws", avatar: av(23), verified: false },
    online: false, unread: 0,
    messages: [
      { id: uid(), fromMe: true, text: "イラスト最高でした🐈", at: Date.now() - 50 * 3600000 },
    ],
  },
];

export const cannedReplies = [
  "なるほど！", "了解です👍", "ありがとう🙏",
  "それいいね！", "また連絡するね", "了解、楽しみにしてる😊",
];
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/data/seeds.ts
git commit -m "feat: add seed data module"
```

---

### Task 7: CSS を index.css に移行

**Files:**
- Create: `src/index.css`

- [ ] **Step 1: src/index.css を作成**

Tailwind ディレクティブを先頭に追加し、app.ts の `CSS` 文字列の内容をそのまま下に貼る。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ---- Lumina custom styles ---- */
:root{
  --bg:#fafafa; --surface:#ffffff; --elev:#ffffff; --border:#dbdbdb;
  --text:#0f1419; --muted:#8e8e8e; --accent:#0095f6; --accent-hover:#1877f2;
  --like:#ed4956; --ring1:#feda75; --ring2:#fa7e1e; --ring3:#d62976; --ring4:#962fbf;
  --shadow:0 1px 2px rgba(0,0,0,.06);
}
.dark{
  --bg:#000000; --surface:#000000; --elev:#121212; --border:#262626;
  --text:#f5f5f5; --muted:#a8a8a8; --accent:#0095f6; --accent-hover:#1877f2;
  --shadow:none;
}
```

（以降、app.ts の `const CSS = \`...\`` の内容をそのまま貼り付け、バッククォートは除く）

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: migrate CSS string to src/index.css with Tailwind directives"
```

---

### Task 8: アイコンコンポーネント

**Files:**
- Create: `src/shared/components/icons/LayoutGridIcon.tsx`
- Create: `src/shared/components/icons/PenSquare.tsx`
- Create: `src/shared/components/icons/index.ts`

- [ ] **Step 1: アイコンを作成**

`src/shared/components/icons/LayoutGridIcon.tsx`:
```tsx
export function LayoutGridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
```

`src/shared/components/icons/PenSquare.tsx`:
```tsx
export function PenSquare() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
```

`src/shared/components/icons/index.ts`:
```typescript
export { LayoutGridIcon } from "./LayoutGridIcon";
export { PenSquare } from "./PenSquare";
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/components/icons/
git commit -m "feat: add custom icon components"
```

---

### Task 9: Media コンポーネント

**Files:**
- Create: `src/shared/components/media/Media.tsx`
- Create: `src/shared/components/media/VideoBox.tsx`
- Create: `src/shared/components/media/index.ts`

- [ ] **Step 1: Media.tsx を作成**

```tsx
// src/shared/components/media/Media.tsx
import { useState } from "react";
import { gradCss } from "@/shared/utils";

interface MediaProps {
  src: string;
  fallback?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export function Media({ src, fallback, alt = "", className, style, onClick, onDoubleClick }: MediaProps) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={className} onClick={onClick} onDoubleClick={onDoubleClick}
        style={{ ...style, width: "100%", height: "100%", background: gradCss(fallback ?? src ?? alt) }} />
    );
  }
  return (
    <img src={src} alt={alt} className={className} style={style}
      loading="lazy" onError={() => setErr(true)}
      onClick={onClick} onDoubleClick={onDoubleClick} />
  );
}
```

- [ ] **Step 2: VideoBox.tsx を作成**

```tsx
// src/shared/components/media/VideoBox.tsx
import { useRef, useState, useEffect } from "react";
import { Film, Volume2, VolumeX } from "lucide-react";
import { gradCss, USE_REAL_MEDIA } from "@/shared/utils";

interface VideoBoxProps {
  src: string;
  poster?: string;
  onDoubleClick?: () => void;
}

export function VideoBox({ src, poster, onDoubleClick }: VideoBoxProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => { if (ref.current) ref.current.muted = muted; }, [muted]);

  if (!USE_REAL_MEDIA) {
    return (
      <>
        <div className="post-vid vid-ph" onDoubleClick={onDoubleClick} style={{ background: gradCss(src) }}>
          <span className="play-tri" />
        </div>
        <span className="vid-badge"><Film size={14} fill="#fff" /></span>
      </>
    );
  }
  return (
    <>
      <video ref={ref} src={src} poster={poster} autoPlay loop muted playsInline
        className="post-vid" onDoubleClick={onDoubleClick} />
      <button className="vid-mute" onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}>
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
      <span className="vid-badge"><Film size={14} fill="#fff" /></span>
    </>
  );
}
```

- [ ] **Step 3: index.ts を作成**

```typescript
// src/shared/components/media/index.ts
export { Media } from "./Media";
export { VideoBox } from "./VideoBox";
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/components/media/
git commit -m "feat: add Media and VideoBox components"
```

---

### Task 10: Redux Slices

**Files:**
- Create: `src/features/feed/feedSlice.ts`
- Create: `src/features/feed/feedSlice.test.ts`
- Create: `src/features/stories/storiesSlice.ts`
- Create: `src/features/messages/messagesSlice.ts`
- Create: `src/features/profile/profileSlice.ts`

- [ ] **Step 1: feedSlice のテストを書く**

`src/features/feed/feedSlice.test.ts`:
```typescript
import feedReducer, { like, save, comment, setOpenId } from "./feedSlice";
import type { Post } from "@/shared/types";

const basePost: Post = {
  id: "p1", inFeed: true, mine: false,
  user: { username: "alice", avatar: "", verified: false },
  image: "", fallback: "", caption: "", likes: 10,
  liked: false, saved: false, createdAt: 0, comments: [],
};

describe("feedSlice", () => {
  it("like increments likes and sets liked=true", () => {
    const state = { posts: [basePost], openId: null };
    const next = feedReducer(state, like({ id: "p1", liked: true }));
    expect(next.posts[0].likes).toBe(11);
    expect(next.posts[0].liked).toBe(true);
  });

  it("unlike decrements likes", () => {
    const likedPost = { ...basePost, liked: true, likes: 10 };
    const state = { posts: [likedPost], openId: null };
    const next = feedReducer(state, like({ id: "p1", liked: false }));
    expect(next.posts[0].likes).toBe(9);
    expect(next.posts[0].liked).toBe(false);
  });

  it("save sets saved flag", () => {
    const state = { posts: [basePost], openId: null };
    const next = feedReducer(state, save({ id: "p1", saved: true }));
    expect(next.posts[0].saved).toBe(true);
  });

  it("comment appends a comment", () => {
    const state = { posts: [basePost], openId: null };
    const next = feedReducer(state, comment({ id: "p1", text: "hi", username: "bob" }));
    expect(next.posts[0].comments).toHaveLength(1);
    expect(next.posts[0].comments[0].text).toBe("hi");
  });

  it("setOpenId updates openId", () => {
    const state = { posts: [], openId: null };
    const next = feedReducer(state, setOpenId("p1"));
    expect(next.openId).toBe("p1");
  });
});
```

- [ ] **Step 2: テストを実行して FAIL を確認**

```bash
npx vitest run src/features/feed/feedSlice.test.ts
```

Expected: FAIL — `Cannot find module './feedSlice'`

- [ ] **Step 3: feedSlice を実装**

`src/features/feed/feedSlice.ts`:
```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "@/shared/types";
import { seedPosts } from "@/shared/data/seeds";
import { uid, ME } from "@/shared/utils";

interface FeedState {
  posts: Post[];
  openId: string | null;
}

const initialState: FeedState = {
  posts: seedPosts(),
  openId: null,
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    like(state, action: PayloadAction<{ id: string; liked: boolean }>) {
      const p = state.posts.find((p) => p.id === action.payload.id);
      if (p) { p.likes += action.payload.liked ? 1 : -1; p.liked = action.payload.liked; }
    },
    save(state, action: PayloadAction<{ id: string; saved: boolean }>) {
      const p = state.posts.find((p) => p.id === action.payload.id);
      if (p) p.saved = action.payload.saved;
    },
    comment(state, action: PayloadAction<{ id: string; text: string; username: string }>) {
      const p = state.posts.find((p) => p.id === action.payload.id);
      if (p) p.comments.push({ id: uid(), user: action.payload.username, text: action.payload.text });
    },
    create(state, action: PayloadAction<{ image: string; caption: string }>) {
      state.posts.unshift({
        id: uid(), inFeed: true, mine: true, user: ME,
        image: action.payload.image, fallback: action.payload.image,
        caption: action.payload.caption, likes: 0, liked: false, saved: false,
        createdAt: Date.now(), comments: [],
      });
    },
    setOpenId(state, action: PayloadAction<string | null>) {
      state.openId = action.payload;
    },
    hydrate(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
  },
});

export const { like, save, comment, create, setOpenId, hydrate } = feedSlice.actions;
export default feedSlice.reducer;
```

- [ ] **Step 4: feedSlice テストを PASS させる**

```bash
npx vitest run src/features/feed/feedSlice.test.ts
```

Expected: PASS (5 tests)

- [ ] **Step 5: storiesSlice を実装**

`src/features/stories/storiesSlice.ts`:
```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Story } from "@/shared/types";
import { seedStories } from "@/shared/data/seeds";

interface StoriesState {
  items: Story[];
  viewerIndex: number | null;
}

const initialState: StoriesState = {
  items: seedStories(),
  viewerIndex: null,
};

export const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    markSeen(state, action: PayloadAction<string>) {
      const s = state.items.find((s) => s.username === action.payload);
      if (s) s.seen = true;
    },
    setViewerIndex(state, action: PayloadAction<number | null>) {
      state.viewerIndex = action.payload;
    },
    hydrate(state, action: PayloadAction<Story[]>) {
      state.items = action.payload;
    },
  },
});

export const { markSeen, setViewerIndex, hydrate: hydrateStories } = storiesSlice.actions;
export default storiesSlice.reducer;
```

- [ ] **Step 6: messagesSlice を実装**

`src/features/messages/messagesSlice.ts`:
```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Conversation } from "@/shared/types";
import { seedConversations } from "@/shared/data/seeds";
import { uid } from "@/shared/utils";

interface MessagesState {
  conversations: Conversation[];
  activeId: string | null;
  typingConv: string | null;
}

const initialState: MessagesState = {
  conversations: seedConversations(),
  activeId: null,
  typingConv: null,
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    openConv(state, action: PayloadAction<string | null>) {
      state.activeId = action.payload;
      if (action.payload) {
        const c = state.conversations.find((c) => c.id === action.payload);
        if (c) c.unread = 0;
      }
    },
    sendMessage(state, action: PayloadAction<{ convId: string; text: string }>) {
      const c = state.conversations.find((c) => c.id === action.payload.convId);
      if (c) c.messages.push({ id: uid(), fromMe: true, text: action.payload.text, at: Date.now() });
    },
    receiveReply(state, action: PayloadAction<{ convId: string; text: string }>) {
      const c = state.conversations.find((c) => c.id === action.payload.convId);
      if (c) c.messages.push({ id: uid(), fromMe: false, text: action.payload.text, at: Date.now() });
    },
    setTyping(state, action: PayloadAction<string | null>) {
      state.typingConv = action.payload;
    },
    hydrate(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },
  },
});

export const { openConv, sendMessage, receiveReply, setTyping, hydrate: hydrateMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
```

- [ ] **Step 7: profileSlice を実装**

`src/features/profile/profileSlice.ts`:
```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Profile, TabKey } from "@/shared/types";
import { ME } from "@/shared/utils";

interface ProfileState {
  profile: Profile;
  tab: TabKey;
}

const initialState: ProfileState = {
  profile: { ...ME },
  tab: "posts",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<TabKey>) {
      state.tab = action.payload;
    },
    incrementPosts(state) {
      state.profile.posts += 1;
    },
    hydrate(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
  },
});

export const { setTab, incrementPosts, hydrate: hydrateProfile } = profileSlice.actions;
export default profileSlice.reducer;
```

- [ ] **Step 8: Commit**

```bash
git add src/features/
git commit -m "feat: add Redux slices for feed, stories, messages, profile"
```

---

### Task 11: Redux Store

**Files:**
- Create: `src/app/store.ts`

- [ ] **Step 1: store.ts を作成**

```typescript
// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "@/features/feed/feedSlice";
import storiesReducer from "@/features/stories/storiesSlice";
import messagesReducer from "@/features/messages/messagesSlice";
import profileReducer from "@/features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    stories: storiesReducer,
    messages: messagesReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

- [ ] **Step 2: Commit**

```bash
git add src/app/store.ts
git commit -m "feat: configure Redux store"
```

---

### Task 12: feature index ファイル群（公開 API）

**Files:**
- Create: `src/features/feed/index.ts`
- Create: `src/features/stories/index.ts`
- Create: `src/features/explore/index.ts`
- Create: `src/features/profile/index.ts`
- Create: `src/features/reels/index.ts`
- Create: `src/features/messages/index.ts`

- [ ] **Step 1: 各 index.ts を作成（コンポーネント追加後に更新する）**

各ファイルはひとまず slice の再エクスポートのみ。コンポーネント追加後に追記する。

`src/features/feed/index.ts`:
```typescript
export * from "./feedSlice";
```

`src/features/stories/index.ts`:
```typescript
export * from "./storiesSlice";
```

`src/features/explore/index.ts`:
```typescript
// populated in Task 16
```

`src/features/profile/index.ts`:
```typescript
export * from "./profileSlice";
```

`src/features/reels/index.ts`:
```typescript
// populated in Task 18
```

`src/features/messages/index.ts`:
```typescript
export * from "./messagesSlice";
```

- [ ] **Step 2: Commit**

```bash
git add src/features/*/index.ts
git commit -m "feat: add feature public API index files"
```

---

### Task 13: Stories コンポーネント

**Files:**
- Create: `src/features/stories/components/Stories.tsx`
- Create: `src/features/stories/components/StoryViewer.tsx`

- [ ] **Step 1: Stories.tsx を作成**

```tsx
// src/features/stories/components/Stories.tsx
import { Plus } from "lucide-react";
import type { Story } from "@/shared/types";
import { ME } from "@/shared/utils";

interface StoriesProps {
  stories: Story[];
  onOpen: (index: number) => void;
}

export function Stories({ stories, onOpen }: StoriesProps) {
  return (
    <div className="stories">
      <div className="story">
        <div className="ring seen" style={{ background: "var(--border)" }}>
          <div className="me-ring inner" style={{ position: "relative", padding: 0 }}>
            <img src={ME.avatar} alt="" />
            <div className="plus"><Plus size={13} strokeWidth={3} /></div>
          </div>
        </div>
        <span>あなた</span>
      </div>
      {stories.map((s, i) => (
        <button className="story" key={s.username} onClick={() => onOpen(i)}>
          <div className={"ring" + (s.seen ? " seen" : "")}>
            <div className="inner"><img src={s.avatar} alt="" /></div>
          </div>
          <span>{s.username}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: StoryViewer.tsx を作成**

```tsx
// src/features/stories/components/StoryViewer.tsx
import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Story } from "@/shared/types";
import { gradCss, img, USE_REAL_MEDIA } from "@/shared/utils";

interface StoryViewerProps {
  stories: Story[];
  index: number;
  onClose: () => void;
  onSeen: (username: string) => void;
}

export function StoryViewer({ stories, index, onClose, onSeen }: StoryViewerProps) {
  const [i, setI] = useState(index);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onSeen(stories[i].username);
    timer.current = setTimeout(() => next(), 5000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [i]);

  const next = () => { if (i < stories.length - 1) setI(i + 1); else onClose(); };
  const prev = () => { if (i > 0) setI(i - 1); };
  const s = stories[i];

  return (
    <div className="sv">
      <button className="sv-x" onClick={onClose}><X size={28} /></button>
      <div className="sv-card">
        {s.video
          ? (USE_REAL_MEDIA
              ? <video className="bg" src={s.video} autoPlay loop muted playsInline />
              : <div className="bg vid-ph" style={{ background: gradCss(s.username + "v") }}><span className="play-tri" /></div>)
          : <img className="bg" src={s.bg ?? img("story-" + i, 480, 854)} alt="" />}
        <div className="sv-bars">
          {stories.map((_, k) => (
            <div className={"sv-bar" + (k < i ? " done" : "") + (k === i ? " active" : "")} key={k}>
              <div className="fill" />
            </div>
          ))}
        </div>
        <div className="sv-head">
          <img src={s.avatar} alt="" /><b>{s.username}</b>
          <span className="t">{(i + 1) * 2}時間前</span>
        </div>
        <div className="sv-tap l" onClick={prev} />
        <div className="sv-tap r" onClick={next} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/features/stories/components/
git commit -m "feat: add Stories and StoryViewer components"
```

---

### Task 14: Feed コンポーネント群

**Files:**
- Create: `src/features/feed/components/Post.tsx`
- Create: `src/features/feed/components/Feed.tsx`
- Create: `src/features/feed/components/PostModal.tsx`
- Create: `src/features/feed/components/CreateModal.tsx`

- [ ] **Step 1: Post.tsx を作成**

```tsx
// src/features/feed/components/Post.tsx
import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, BadgeCheck, Smile } from "lucide-react";
import type { Post as PostType } from "@/shared/types";
import { Media } from "@/shared/components/media";
import { VideoBox } from "@/shared/components/media";
import { fmt, ago } from "@/shared/utils";

interface PostProps {
  p: PostType;
  onLike: (id: string, liked: boolean) => void;
  onSave: (id: string, saved: boolean) => void;
  onComment: (id: string, text: string) => void;
  onOpen: (id: string) => void;
  onToast: (msg: string) => void;
}

export function Post({ p, onLike, onSave, onComment, onOpen, onToast }: PostProps) {
  const [heart, setHeart] = useState(0);
  const [text, setText] = useState("");
  const dbl = () => { if (!p.liked) onLike(p.id, true); setHeart((h) => h + 1); };
  const send = () => { if (!text.trim()) return; onComment(p.id, text.trim()); setText(""); };
  return (
    <article className="post fade-in">
      <div className="post-head">
        <img className="ava" src={p.user.avatar} alt="" />
        <div className="uname">{p.user.username}{p.user.verified && <BadgeCheck size={14} className="v" fill="var(--accent)" color="#fff" />}</div>
        <span className="dot">•</span>
        <span className="t">{ago(p.createdAt)}</span>
        <div style={{ flex: 1 }} />
        <button className="iconbtn" onClick={() => onToast("オプションは準備中です")}><MoreHorizontal size={20} /></button>
      </div>
      <div className="post-img-wrap" onDoubleClick={dbl} style={{ cursor: "pointer" }}>
        {p.video
          ? <VideoBox src={p.video} poster={p.image} onDoubleClick={dbl} />
          : <Media src={p.image} fallback={p.fallback} onClick={() => onOpen(p.id)} />}
        <div className={"big-heart" + (heart ? " show" : "")} key={heart}>
          <Heart size={96} fill="#fff" color="#fff" />
        </div>
      </div>
      <div className="actions">
        <button className="iconbtn" onClick={() => onLike(p.id, !p.liked)}>
          <Heart size={25} fill={p.liked ? "var(--like)" : "none"} color={p.liked ? "var(--like)" : "var(--text)"} />
        </button>
        <button className="iconbtn" onClick={() => onOpen(p.id)}><MessageCircle size={24} /></button>
        <button className="iconbtn" onClick={() => onToast("シェアしました")}><Send size={23} /></button>
        <div className="grow" />
        <button className="iconbtn" onClick={() => onSave(p.id, !p.saved)}>
          <Bookmark size={24} fill={p.saved ? "var(--text)" : "none"} />
        </button>
      </div>
      <div className="likes">いいね！{fmt(p.likes)}件</div>
      <div className="caption"><b>{p.user.username}</b> {p.caption}</div>
      {p.comments.length > 0 && (
        <div className="cm-link" onClick={() => onOpen(p.id)}>コメント{p.comments.length}件をすべて見る</div>
      )}
      {p.comments.slice(0, 2).map((c) => (
        <div className="cm-prev" key={c.id}><b>{c.user}</b> {c.text}</div>
      ))}
      <div className="add-cm">
        <Smile size={22} color="var(--muted)" />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="コメントを追加…"
          onKeyDown={(e) => e.key === "Enter" && send()} />
        <button className={"post-btn" + (text.trim() ? " on" : "")} onClick={send}>投稿</button>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Feed.tsx を作成**

```tsx
// src/features/feed/components/Feed.tsx
import type { Post as PostType, Story } from "@/shared/types";
import { Stories } from "@/features/stories/components/Stories";
import { Post } from "./Post";

interface FeedProps {
  posts: PostType[];
  stories: Story[];
  onOpenStory: (index: number) => void;
  onLike: (id: string, liked: boolean) => void;
  onSave: (id: string, saved: boolean) => void;
  onComment: (id: string, text: string) => void;
  onOpen: (id: string) => void;
  onToast: (msg: string) => void;
}

export function Feed({ posts, stories, onOpenStory, ...handlers }: FeedProps) {
  const feed = posts.filter((p) => p.inFeed);
  return (
    <div className="center">
      <Stories stories={stories} onOpen={onOpenStory} />
      {feed.map((p) => <Post key={p.id} p={p} {...handlers} />)}
    </div>
  );
}
```

- [ ] **Step 3: PostModal.tsx を作成**

```tsx
// src/features/feed/components/PostModal.tsx
import { useState } from "react";
import { X, Heart, Send, Bookmark, Smile, BadgeCheck } from "lucide-react";
import type { Post } from "@/shared/types";
import { Media } from "@/shared/components/media";
import { fmt, ago, gradCss, USE_REAL_MEDIA } from "@/shared/utils";

interface PostModalProps {
  p: Post;
  onClose: () => void;
  onLike: (id: string, liked: boolean) => void;
  onSave: (id: string, saved: boolean) => void;
  onComment: (id: string, text: string) => void;
  onToast: (msg: string) => void;
}

export function PostModal({ p, onClose, onLike, onSave, onComment, onToast }: PostModalProps) {
  const [text, setText] = useState("");
  const send = () => { if (!text.trim()) return; onComment(p.id, text.trim()); setText(""); };
  return (
    <div className="overlay" onClick={onClose}>
      <button className="close" onClick={onClose}><X size={28} /></button>
      <div className="pm" onClick={(e) => e.stopPropagation()}>
        <div className="pm-img">
          {p.video
            ? (USE_REAL_MEDIA
                ? <video src={p.video} poster={p.image} autoPlay loop controls playsInline />
                : <div className="pm-ph" style={{ background: gradCss(p.id) }}><span className="play-tri" /></div>)
            : <Media src={p.image} fallback={p.fallback} />}
        </div>
        <div className="pm-side">
          <div className="post-head">
            <img className="ava" src={p.user.avatar} alt="" />
            <div className="uname">{p.user.username}{p.user.verified && <BadgeCheck size={14} className="v" fill="var(--accent)" color="#fff" />}</div>
          </div>
          <div className="pm-comments">
            <div className="cm-row">
              <img src={p.user.avatar} alt="" />
              <div><b>{p.user.username}</b>{p.caption}</div>
            </div>
            {p.comments.map((c) => (
              <div className="cm-row" key={c.id}>
                <img src={`https://i.pravatar.cc/100?u=${c.user}`} alt="" />
                <div><b>{c.user}</b>{c.text}</div>
              </div>
            ))}
            {p.comments.length === 0 && (
              <div style={{ color: "var(--muted)", textAlign: "center", marginTop: 40 }}>
                まだコメントはありません。<br />最初のコメントを残そう。
              </div>
            )}
          </div>
          <div className="actions">
            <button className="iconbtn" onClick={() => onLike(p.id, !p.liked)}>
              <Heart size={25} fill={p.liked ? "var(--like)" : "none"} color={p.liked ? "var(--like)" : "var(--text)"} />
            </button>
            <button className="iconbtn" onClick={() => onToast("シェアしました")}><Send size={23} /></button>
            <div className="grow" />
            <button className="iconbtn" onClick={() => onSave(p.id, !p.saved)}>
              <Bookmark size={24} fill={p.saved ? "var(--text)" : "none"} />
            </button>
          </div>
          <div className="likes">いいね！{fmt(p.likes)}件</div>
          <div className="t" style={{ padding: "0 14px 10px" }}>{ago(p.createdAt)}</div>
          <div className="add-cm">
            <Smile size={22} color="var(--muted)" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="コメントを追加…"
              onKeyDown={(e) => e.key === "Enter" && send()} />
            <button className={"post-btn" + (text.trim() ? " on" : "")} onClick={send}>投稿</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: CreateModal.tsx を作成**

```tsx
// src/features/feed/components/CreateModal.tsx
import { useState } from "react";
import { X, ChevronLeft, Camera } from "lucide-react";
import { un } from "@/shared/utils";

interface CreateModalProps {
  onClose: () => void;
  onCreate: (image: string, caption: string) => void;
}

export function CreateModal({ onClose, onCreate }: CreateModalProps) {
  const [step, setStep] = useState(1);
  const [sel, setSel] = useState<string | null>(null);
  const [cap, setCap] = useState("");
  const [choices] = useState(() =>
    [
      "1623341214825-9f4f963727da", "1497636577773-f1231844b336",
      "1501554728187-ce583db33af7", "1604928141064-207cea6f571f",
      "1536098561742-ca998e48cbcc", "1540959733332-eab4deabeeaf",
      "1590212151175-e58edd96185b", "1551632811-561732d1e306",
    ].map(un)
  );
  return (
    <div className="overlay" onClick={onClose}>
      <div className="create" onClick={(e) => e.stopPropagation()}>
        <div className="create-head">
          {step === 2
            ? <button onClick={() => setStep(1)}><ChevronLeft size={22} /></button>
            : <button onClick={onClose}><X size={22} /></button>}
          <span>{step === 1 ? "新規投稿を作成" : "シェア"}</span>
          {step === 1
            ? <button onClick={() => sel && setStep(2)} style={{ opacity: sel ? 1 : 0.4, pointerEvents: sel ? "auto" : "none" }}>次へ</button>
            : <button onClick={() => sel && onCreate(sel, cap)}>シェアする</button>}
        </div>
        <div className="create-body">
          {step === 1 ? (
            <>
              <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14, textAlign: "center" }}>
                <Camera size={36} style={{ display: "block", margin: "0 auto 8px" }} />写真を選んでください
              </p>
              <div className="pick-grid">
                {choices.map((src) => (
                  <button className={"pick" + (sel === src ? " sel" : "")} key={src} onClick={() => setSel(src)}>
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="preview">
                {sel && <img src={sel} alt="" />}
                <textarea value={cap} onChange={(e) => setCap(e.target.value)}
                  placeholder="キャプションを入力…" maxLength={2200} />
              </div>
              <div style={{ color: "var(--muted)", fontSize: 12, textAlign: "right" }}>{cap.length}/2,200</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/features/feed/components/
git commit -m "feat: add Feed, Post, PostModal, CreateModal components"
```

---

### Task 15: Explore, Profile, Reels, Messages コンポーネント

**Files:**
- Create: `src/features/explore/components/Explore.tsx`
- Create: `src/features/profile/components/Profile.tsx`
- Create: `src/features/reels/components/Reels.tsx`
- Create: `src/features/messages/components/Messages.tsx`

- [ ] **Step 1: Explore.tsx を作成**

```tsx
// src/features/explore/components/Explore.tsx
import { Heart, MessageCircle, Film } from "lucide-react";
import type { Post } from "@/shared/types";
import { Media } from "@/shared/components/media";
import { fmt } from "@/shared/utils";

interface ExploreProps {
  posts: Post[];
  onOpen: (id: string) => void;
}

export function Explore({ posts, onOpen }: ExploreProps) {
  return (
    <div className="explore">
      <div className="grid">
        {posts.map((p) => (
          <div className="cell" key={p.id} onClick={() => onOpen(p.id)}>
            <Media src={p.image} fallback={p.fallback} />
            {p.video && <span className="cell-vid"><Film size={18} fill="#fff" /></span>}
            <div className="ov">
              <span><Heart size={18} fill="#fff" /> {fmt(p.likes)}</span>
              <span><MessageCircle size={18} fill="#fff" /> {p.comments.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Profile.tsx を作成**

```tsx
// src/features/profile/components/Profile.tsx
import { BadgeCheck, Bookmark, Film, Heart, MessageCircle } from "lucide-react";
import type { Post, Profile as ProfileType, TabKey } from "@/shared/types";
import { Media } from "@/shared/components/media";
import { LayoutGridIcon } from "@/shared/components/icons";
import { fmt } from "@/shared/utils";

interface ProfileProps {
  profile: ProfileType;
  posts: Post[];
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  onOpen: (id: string) => void;
  onToast: (msg: string) => void;
}

export function Profile({ profile, posts, tab, setTab, onOpen, onToast }: ProfileProps) {
  const mine = posts.filter((p) => p.mine);
  const saved = posts.filter((p) => p.saved);
  const shown = tab === "saved" ? saved : mine;
  return (
    <div className="profile-wrap fade-in">
      <div className="p-head">
        <img className="p-avatar" src={profile.avatar} alt="" />
        <div className="p-meta">
          <div className="p-top">
            <h2>{profile.username}{profile.verified && <BadgeCheck size={20} className="v" fill="var(--accent)" color="#fff" />}</h2>
            <button className="btn" onClick={() => onToast("編集画面は準備中です")}>プロフィールを編集</button>
            <button className="btn" onClick={() => onToast("共有しました")}>シェア</button>
          </div>
          <div className="p-stats">
            <span><b>{mine.length}</b> 投稿</span>
            <span><b>{fmt(profile.followers)}</b> フォロワー</span>
            <span><b>{fmt(profile.following)}</b> フォロー中</span>
          </div>
          <div className="p-bio"><span className="name">{profile.name}</span>{"\n"}{profile.bio}</div>
        </div>
      </div>
      <div className="p-tabs">
        <button className={"p-tab" + (tab === "posts" ? " active" : "")} onClick={() => setTab("posts")}>
          <LayoutGridIcon /> 投稿
        </button>
        <button className={"p-tab" + (tab === "saved" ? " active" : "")} onClick={() => setTab("saved")}>
          <Bookmark size={14} /> 保存済み
        </button>
      </div>
      <div className="grid" style={{ marginTop: 4 }}>
        {shown.map((p) => (
          <div className="cell" key={p.id} onClick={() => onOpen(p.id)}>
            <Media src={p.image} fallback={p.fallback} />
            {p.video && <span className="cell-vid"><Film size={18} fill="#fff" /></span>}
            <div className="ov">
              <span><Heart size={18} fill="#fff" /> {fmt(p.likes)}</span>
              <span><MessageCircle size={18} fill="#fff" /> {p.comments.length}</span>
            </div>
          </div>
        ))}
      </div>
      {shown.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: "50px 0" }}>まだ投稿がありません</div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Reels.tsx を作成**

```tsx
// src/features/reels/components/Reels.tsx
import { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Send, MoreHorizontal, Volume2, VolumeX } from "lucide-react";
import type { Post } from "@/shared/types";
import { gradCss, USE_REAL_MEDIA, REEL_VIDEOS, fmt } from "@/shared/utils";

interface ReelsProps {
  posts: Post[];
  onLike: (id: string, liked: boolean) => void;
  onToast: (msg: string) => void;
}

export function Reels({ posts, onLike, onToast }: ReelsProps) {
  const [muted, setMuted] = useState(true);
  const reelPosts = posts.slice(0, 5);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (USE_REAL_MEDIA) vids.current.forEach((v) => v && (v.muted = muted));
  }, [muted]);

  useEffect(() => {
    if (!USE_REAL_MEDIA) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting && e.intersectionRatio > 0.6) v.play().catch(() => {});
        else v.pause();
      });
    }, { threshold: [0, 0.6, 1] });
    vids.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <div className="reels">
      {reelPosts.map((p, i) => (
        <div className="reel" key={p.id}>
          <div className="reel-card">
            {USE_REAL_MEDIA
              ? <video ref={(el) => { vids.current[i] = el; }} className="reel-vid"
                  src={REEL_VIDEOS[i % REEL_VIDEOS.length]} loop muted playsInline
                  onClick={() => setMuted((m) => !m)} />
              : <div className="reel-vid vid-ph" style={{ background: gradCss(p.id + "reel") }}>
                  <span className="play-tri" />
                </div>}
            <div className="reel-grad" />
            <button className="reel-mute" onClick={() => setMuted((m) => !m)}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="reel-info">
              <div className="ru">
                <img src={p.user.avatar} alt="" />{p.user.username}
                <button className="btn" style={{ padding: "3px 12px", background: "transparent", color: "#fff", borderColor: "#fff" }}
                  onClick={() => onToast("フォローしました")}>フォロー</button>
              </div>
              <div className="rc">{p.caption}</div>
            </div>
            <div className="reel-rail">
              <button className="ri" onClick={() => onLike(p.id, !p.liked)}>
                <Heart size={28} fill={p.liked ? "var(--like)" : "#fff"} color={p.liked ? "var(--like)" : "#fff"} />
                {fmt(p.likes)}
              </button>
              <div className="ri"><MessageCircle size={28} />{p.comments.length}</div>
              <button className="ri" onClick={() => onToast("シェアしました")}><Send size={26} /></button>
              <button className="ri" onClick={() => onToast("オプション準備中")}><MoreHorizontal size={26} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Messages.tsx を作成**

```tsx
// src/features/messages/components/Messages.tsx
import { useRef, useEffect, useState } from "react";
import { Send, Smile, BadgeCheck, ChevronLeft } from "lucide-react";
import type { Conversation } from "@/shared/types";
import { PenSquare } from "@/shared/components/icons";
import { ME, ago } from "@/shared/utils";

interface MessagesProps {
  conversations: Conversation[];
  activeId: string | null;
  openConv: (id: string | null) => void;
  onSend: (convId: string, text: string) => void;
  typingConv: string | null;
}

export function Messages({ conversations, activeId, openConv, onSend, typingConv }: MessagesProps) {
  const active = conversations.find((c) => c.id === activeId) ?? null;
  const [text, setText] = useState("");
  const msgsRef = useRef<HTMLDivElement>(null);
  const total = conversations.reduce((s, c) => s + c.unread, 0);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [active?.messages.length, typingConv, activeId]);

  const send = () => {
    if (!text.trim() || !active) return;
    onSend(active.id, text.trim());
    setText("");
  };

  return (
    <div className={"dm" + (active ? " thread-open" : "")}>
      <div className="dm-list">
        <div className="dm-list-head">
          <div className="me">{ME.username}{ME.verified && <BadgeCheck size={16} className="v" fill="var(--accent)" color="#fff" />}</div>
          <button><PenSquare /></button>
        </div>
        <div style={{ padding: "0 18px 10px", fontWeight: 700, fontSize: 15 }}>
          メッセージ{total > 0 && <span style={{ color: "var(--muted)", fontWeight: 400 }}>（未読 {total}）</span>}
        </div>
        <div className="dm-convs">
          {conversations.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <button key={c.id} className={"conv" + (c.id === activeId ? " active" : "")} onClick={() => openConv(c.id)}>
                <div className="av-wrap">
                  <img src={c.user.avatar} alt="" />
                  {c.online && <span className="online" />}
                </div>
                <div className="ci">
                  <div className="cn">{c.user.username}{c.user.verified && <BadgeCheck size={13} className="v" fill="var(--accent)" color="#fff" />}</div>
                  <div className={"cp" + (c.unread ? " bold" : "")}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{last.fromMe ? "あなた: " : ""}{last.text}</span>
                    <span>· {ago(last.at)}</span>
                  </div>
                </div>
                {c.unread > 0 && <span className="badge" />}
              </button>
            );
          })}
        </div>
      </div>
      <div className="dm-thread">
        {active ? (
          <>
            <div className="dm-thread-head">
              <button className="back" onClick={() => openConv(null)}><ChevronLeft size={26} /></button>
              <img src={active.user.avatar} alt="" />
              <div>
                <div className="th-name">{active.user.username}{active.user.verified && <BadgeCheck size={14} className="v" fill="var(--accent)" color="#fff" />}</div>
                <div className="th-status">{active.online ? "アクティブ" : "オフライン"}</div>
              </div>
            </div>
            <div className="dm-msgs" ref={msgsRef}>
              {active.messages.map((m, idx) => {
                const prev = active.messages[idx - 1];
                const showAva = !m.fromMe && (!prev || prev.fromMe);
                return (
                  <div className={"brow " + (m.fromMe ? "me" : "them")} key={m.id}>
                    {!m.fromMe && (showAva ? <img src={active.user.avatar} alt="" /> : <div style={{ width: 24, flex: "0 0 auto" }} />)}
                    <div className={"bubble " + (m.fromMe ? "me" : "them")}>{m.text}</div>
                  </div>
                );
              })}
              {typingConv === active.id && (
                <div className="brow them">
                  <img src={active.user.avatar} alt="" />
                  <div className="typing"><span /><span /><span /></div>
                </div>
              )}
            </div>
            <div className="dm-input">
              <Smile size={24} color="var(--muted)" />
              <input value={text} onChange={(e) => setText(e.target.value)}
                placeholder="メッセージを送信…" onKeyDown={(e) => e.key === "Enter" && send()} />
              {text.trim() ? <button className="snd" onClick={send}>送信</button> : <Send size={22} color="var(--accent)" />}
            </div>
          </>
        ) : (
          <div className="dm-empty">
            <div className="circle"><Send size={40} /></div>
            <div style={{ fontSize: 20 }}>あなたのメッセージ</div>
            <p>友達や知り合いにメッセージを送りましょう</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/features/explore/ src/features/profile/components/ src/features/reels/ src/features/messages/components/
git commit -m "feat: add Explore, Profile, Reels, Messages components"
```

---

### Task 16: Layout コンポーネント（Sidebar, MobileNav）

**Files:**
- Create: `src/shared/components/layout/Sidebar.tsx`
- Create: `src/shared/components/layout/MobileNav.tsx`

- [ ] **Step 1: Sidebar.tsx を作成**

```tsx
// src/shared/components/layout/Sidebar.tsx
import { Home, Compass, Film, Send, Plus, User, Sun, Moon } from "lucide-react";
import type { ViewKey } from "@/shared/types";
import type { Profile } from "@/shared/types";

interface SidebarProps {
  view: ViewKey | "create";
  setView: (v: ViewKey) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  onCreate: () => void;
  profile: Profile;
  unread: number;
}

export function Sidebar({ view, setView, dark, setDark, onCreate, profile, unread }: SidebarProps) {
  const items = [
    { k: "home" as const, icon: Home, label: "ホーム" },
    { k: "explore" as const, icon: Compass, label: "発見" },
    { k: "reels" as const, icon: Film, label: "リール" },
    { k: "messages" as const, icon: Send, label: "メッセージ", badge: unread },
    { k: "create" as const, icon: Plus, label: "作成" },
    { k: "profile" as const, icon: User, label: "プロフィール", avatar: profile.avatar },
  ];
  return (
    <nav className="side">
      <div className="logo">Lumina</div>
      {items.map((it) => {
        const Icon = it.icon;
        const active = view === it.k;
        return (
          <button key={it.k} className={"nav-item" + (active ? " active" : "")}
            onClick={() => it.k === "create" ? onCreate() : setView(it.k)}>
            {"avatar" in it && it.avatar
              ? <img className="ava" src={it.avatar} alt="" style={{ outline: active ? "2px solid var(--text)" : "none" }} />
              : <span style={{ position: "relative", display: "grid", placeItems: "center" }}>
                  <Icon size={26} strokeWidth={active ? 2.6 : 2} />
                  {"badge" in it && it.badge > 0 && (
                    <span style={{ position: "absolute", top: -4, right: -6, minWidth: 17, height: 17, padding: "0 4px", borderRadius: 9, background: "var(--like)", color: "#fff", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center" }}>{it.badge}</span>
                  )}
                </span>}
            <span>{it.label}</span>
          </button>
        );
      })}
      <div className="spacer" />
      <button className="nav-item" onClick={() => setDark(!dark)}>
        {dark ? <Sun size={26} /> : <Moon size={26} />}
        <span>{dark ? "ライト" : "ダーク"}モード</span>
      </button>
    </nav>
  );
}
```

- [ ] **Step 2: MobileNav.tsx を作成**

```tsx
// src/shared/components/layout/MobileNav.tsx
import { Home, Compass, Film, Plus } from "lucide-react";
import type { ViewKey } from "@/shared/types";
import type { Profile } from "@/shared/types";

interface MobileNavProps {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  onCreate: () => void;
  profile: Profile;
}

export function MobileNav({ view, setView, onCreate, profile }: MobileNavProps) {
  return (
    <nav className="mnav">
      <button className="mn" onClick={() => setView("home")}><Home size={26} strokeWidth={view === "home" ? 2.6 : 2} /></button>
      <button className="mn" onClick={() => setView("explore")}><Compass size={26} strokeWidth={view === "explore" ? 2.6 : 2} /></button>
      <button className="mn" onClick={onCreate}><Plus size={28} /></button>
      <button className="mn" onClick={() => setView("reels")}><Film size={26} strokeWidth={view === "reels" ? 2.6 : 2} /></button>
      <button className={"mn" + (view === "profile" ? " active" : "")} onClick={() => setView("profile")}>
        <img className="ava" src={profile.avatar} alt="" />
      </button>
    </nav>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/layout/
git commit -m "feat: add Sidebar and MobileNav layout components"
```

---

### Task 17: App.tsx

**Files:**
- Create: `src/app/App.tsx`

- [ ] **Step 1: App.tsx を作成**

```tsx
// src/app/App.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Sun, Moon, Send } from "lucide-react";
import type { RootState, AppDispatch } from "./store";
import type { ViewKey } from "@/shared/types";
import { like, save, comment, create, setOpenId } from "@/features/feed/feedSlice";
import { markSeen, setViewerIndex } from "@/features/stories/storiesSlice";
import { openConv, sendMessage, receiveReply, setTyping } from "@/features/messages/messagesSlice";
import { setTab, incrementPosts } from "@/features/profile/profileSlice";
import { loadState, saveState } from "@/shared/lib/storage";
import { cannedReplies } from "@/shared/data/seeds";
import { Feed } from "@/features/feed/components/Feed";
import { Explore } from "@/features/explore/components/Explore";
import { Profile } from "@/features/profile/components/Profile";
import { Reels } from "@/features/reels/components/Reels";
import { Messages } from "@/features/messages/components/Messages";
import { PostModal } from "@/features/feed/components/PostModal";
import { CreateModal } from "@/features/feed/components/CreateModal";
import { StoryViewer } from "@/features/stories/components/StoryViewer";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { MobileNav } from "@/shared/components/layout/MobileNav";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((s: RootState) => s.feed.posts);
  const openId = useSelector((s: RootState) => s.feed.openId);
  const stories = useSelector((s: RootState) => s.stories.items);
  const storyIdx = useSelector((s: RootState) => s.stories.viewerIndex);
  const conversations = useSelector((s: RootState) => s.messages.conversations);
  const activeConv = useSelector((s: RootState) => s.messages.activeId);
  const typingConv = useSelector((s: RootState) => s.messages.typingConv);
  const profile = useSelector((s: RootState) => s.profile.profile);
  const tab = useSelector((s: RootState) => s.profile.tab);

  const [dark, setDark] = useState(false);
  const [view, setView] = useState<ViewKey>("home");
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Grand+Hotel&display=swap";
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    (async () => {
      const s = await loadState();
      if (s) {
        // hydration handled by slices if needed
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => saveState({ posts, stories, conversations }), 400);
    return () => clearTimeout(t);
  }, [posts, stories, conversations, loaded]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const onLike = (id: string, liked: boolean) => dispatch(like({ id, liked }));
  const onSave = (id: string, saved: boolean) => {
    dispatch(save({ id, saved }));
    showToast(saved ? "保存しました" : "保存を解除しました");
  };
  const onComment = (id: string, text: string) =>
    dispatch(comment({ id, text, username: profile.username }));

  const handleCreate = (image: string, caption: string) => {
    dispatch(create({ image, caption }));
    dispatch(incrementPosts());
    setCreateOpen(false);
    setView("home");
    showToast("投稿をシェアしました 🎉");
  };

  const handleSendDM = (convId: string, text: string) => {
    dispatch(sendMessage({ convId, text }));
    dispatch(setTyping(convId));
    setTimeout(() => {
      const reply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
      dispatch(receiveReply({ convId, text: reply }));
      dispatch(setTyping(null));
    }, 1500);
  };

  const openPost = posts.find((p) => p.id === openId) ?? null;
  const unreadTotal = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <div className={"lumina" + (dark ? " dark" : "")}>
      <Sidebar view={view} setView={setView} dark={dark} setDark={setDark}
        onCreate={() => setCreateOpen(true)} profile={profile} unread={unreadTotal} />

      <div className="main">
        <div className="topbar">
          <div className="logo">Lumina</div>
          <div className="tb-right">
            <button onClick={() => setDark(!dark)}>{dark ? <Sun size={24} /> : <Moon size={24} />}</button>
            <button onClick={() => showToast("通知はありません")}><Heart size={24} /></button>
            <button onClick={() => setView("messages")} style={{ position: "relative" }}>
              <Send size={24} />
              {unreadTotal > 0 && (
                <span style={{ position: "absolute", top: -5, right: -6, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: "var(--like)", color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>{unreadTotal}</span>
              )}
            </button>
          </div>
        </div>

        {view === "home" && (
          <Feed posts={posts} stories={stories}
            onOpenStory={(i) => dispatch(setViewerIndex(i))}
            onLike={onLike} onSave={onSave} onComment={onComment}
            onOpen={(id) => dispatch(setOpenId(id))} onToast={showToast} />
        )}
        {view === "explore" && <Explore posts={posts} onOpen={(id) => dispatch(setOpenId(id))} />}
        {view === "reels" && <Reels posts={posts} onLike={onLike} onToast={showToast} />}
        {view === "profile" && (
          <Profile profile={profile} posts={posts} tab={tab}
            setTab={(t) => dispatch(setTab(t))}
            onOpen={(id) => dispatch(setOpenId(id))} onToast={showToast} />
        )}
        {view === "messages" && (
          <Messages conversations={conversations} activeId={activeConv}
            openConv={(id) => dispatch(openConv(id))} onSend={handleSendDM} typingConv={typingConv} />
        )}
      </div>

      <MobileNav view={view} setView={setView} onCreate={() => setCreateOpen(true)} profile={profile} />

      {openPost && (
        <PostModal p={openPost} onClose={() => dispatch(setOpenId(null))}
          onLike={onLike} onSave={onSave} onComment={onComment} onToast={showToast} />
      )}
      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} onCreate={handleCreate} />}
      {storyIdx !== null && (
        <StoryViewer stories={stories} index={storyIdx}
          onClose={() => dispatch(setViewerIndex(null))}
          onSeen={(u) => dispatch(markSeen(u))} />
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/App.tsx
git commit -m "feat: add App root component wired to Redux"
```

---

### Task 18: main.tsx

**Files:**
- Create: `src/app/main.tsx`

- [ ] **Step 1: main.tsx を作成**

```tsx
// src/app/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "../index.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root element not found");

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

- [ ] **Step 2: Commit**

```bash
git add src/app/main.tsx
git commit -m "feat: add main entry point with Redux Provider"
```

---

### Task 19: ビルド確認 & app.ts 削除

**Files:**
- Delete: `app.ts`

- [ ] **Step 1: TypeScript コンパイルを確認**

```bash
npx tsc --noEmit
```

Expected: エラーなし。型エラーがあれば修正してから次へ進む。

- [ ] **Step 2: Vite ビルドを確認**

```bash
npm run build
```

Expected: `dist/` が生成され、エラーなく完了する。

- [ ] **Step 3: 開発サーバーで動作確認**

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開き以下を確認:
- ホームフィード表示
- いいね/保存 が反応する
- ストーリーが開く
- Explore グリッドが表示される
- リールが表示される
- メッセージが送受信できる
- 投稿作成が動作する
- ダークモード切替が動作する

- [ ] **Step 4: app.ts を削除**

```bash
rm app.ts
```

- [ ] **Step 5: 全テストを実行**

```bash
npm test
```

Expected: PASS (utils テスト 5 件 + feed slice テスト 5 件 + types テスト 1 件)

- [ ] **Step 6: 最終 Commit**

```bash
git add -A
git commit -m "refactor: complete directory restructure to Feature-Sliced Design

- Vite + TypeScript strict mode
- Tailwind CSS (custom CSS migrated to src/index.css)
- Redux Toolkit slices: feed, stories, messages, profile
- Feature-Sliced Design: features/, shared/, app/
- Remove monolithic app.ts"
```
