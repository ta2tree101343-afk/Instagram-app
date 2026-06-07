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

export const ME: Profile = {
  username: "fuji.dev",
  name: "藤田 樹",
  avatar: av(12),
  verified: true,
  bio: "情報工学を学ぶ学生 👨‍💻\nReact / FastAPI / 数値計算\n📍 千葉",
  posts: 9,
  followers: 1284,
  following: 312,
};
