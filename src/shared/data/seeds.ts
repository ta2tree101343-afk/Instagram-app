import type { Post, Story, Conversation } from "@/shared/types";
import { av, un, img, VID, uid, ME } from "@/shared/utils";

const HOUR = 3600 * 1000;

export const seedPosts = (): Post[] => ([
  { id: "p1", inFeed: true, mine: false, user: { username: "yuki.films", avatar: av(5), verified: true },
    image: un("1746150361967-7c20603d25cd"), fallback: img("tokyo-night"),
    caption: "夜の東京、ネオンが綺麗だった🌃 #tokyo #nightphotography",
    likes: 12430, liked: false, saved: false, createdAt: Date.now() - 2 * HOUR,
    comments: [ { id: uid(), user: "ren.photo", text: "構図が最高すぎる…！" }, { id: uid(), user: "aoi_", text: "これどこですか？📍" } ] },
  { id: "p2", inFeed: true, mine: false, user: { username: "sora.travels", avatar: av(32), verified: true },
    image: un("1551632811-561732d1e306"), fallback: img("mountain-trail"),
    caption: "ついに登頂🗻 4時間の登り、報われた瞬間。#登山 #hiking",
    likes: 34021, liked: true, saved: false, createdAt: Date.now() - 5 * HOUR,
    comments: [ { id: uid(), user: "k_design", text: "おめでとう！絶景🙌" } ] },
  { id: "pv1", inFeed: true, mine: false, user: { username: "drive.jp", avatar: av(53), verified: false },
    video: VID("ForBiggerBlazes"), image: un("1549693578-d683be217e58"), fallback: img("drive-road"),
    caption: "週末ドライブ🚗 海沿いの道は最高だった #drive #weekend",
    likes: 5820, liked: false, saved: false, createdAt: Date.now() - 7 * HOUR,
    comments: [ { id: uid(), user: "road_trip", text: "音までいい！" } ] },
  { id: "p3", inFeed: true, mine: false, user: { username: "cafe.tokyo", avatar: av(47), verified: false },
    image: un("1529892485617-25f63cd7b1e9"), fallback: img("latte-cup"),
    caption: "今日の一杯☕️ ラテアートの練習中です",
    likes: 876, liked: false, saved: true, createdAt: Date.now() - 9 * HOUR,
    comments: [ { id: uid(), user: "mina.eats", text: "上手！飲みに行きたい" } ] },
  { id: "p4", inFeed: true, mine: false, user: { username: "design_daily", avatar: av(13), verified: false },
    image: un("1616440347437-b1c73416efc2"), fallback: img("ui-mockup"),
    caption: "新しいダッシュボードのリサーチ中。グリッドは正義。",
    likes: 2105, liked: false, saved: false, createdAt: Date.now() - 22 * HOUR,
    comments: [ { id: uid(), user: "dev_taro", text: "とても参考になります🙏" } ] },
  { id: "pv2", inFeed: true, mine: false, user: { username: "ocean.days", avatar: av(28), verified: true },
    video: VID("ForBiggerEscapes"), image: un("1501555088652-021faa106b9b"), fallback: img("ocean-clip"),
    caption: "自然の中でリフレッシュ🌿 #nature #travel",
    likes: 18733, liked: false, saved: false, createdAt: Date.now() - 26 * HOUR,
    comments: [ { id: uid(), user: "leaf_", text: "癒される〜🍃" }, { id: uid(), user: "wave22", text: "行きたい！" } ] },
  { id: "p5", inFeed: true, mine: false, user: { username: "street.snap", avatar: av(8), verified: false },
    image: un("1503899036084-c55cdd92da26"), fallback: img("rain-street"),
    caption: "渋谷スナップ。雨の日も悪くない☔️",
    likes: 1567, liked: false, saved: false, createdAt: Date.now() - 30 * HOUR, comments: [] },
  { id: "p6", inFeed: true, mine: false, user: { username: "kana.draws", avatar: av(23), verified: false },
    image: un("1529778873920-4da4926a72c2"), fallback: img("sketch-cat"),
    caption: "うちの子🐈 #cat #ねこ #drawing の参考に",
    likes: 9402, liked: true, saved: false, createdAt: Date.now() - 49 * HOUR,
    comments: [ { id: uid(), user: "art_lover", text: "かわいい〜🐾" }, { id: uid(), user: "neko3", text: "うちの子に似てる！" } ] },
  // ---- 自分の投稿（プロフィールのグリッド）----
  ...([
    ["1626968361222-291e74711449", "週末のコーディング📝"],
    ["1590212151175-e58edd96185b", "新しいセットアップ💻"],
    ["1501554728187-ce583db33af7", "散歩の途中で"],
    ["1569718212165-3a8278d5f624", "今日のランチ🍜"],
    ["1497636577773-f1231844b336", "読書のお供に📚"],
    ["1604928141064-207cea6f571f", "夜景がきれいな夕方"],
    ["1563311977-d285756282dc", "作業のお供☕️"],
    ["1616440347437-b1c73416efc2", "ガジェット沼"],
    ["1536098561742-ca998e48cbcc", "おしまい"],
  ] as [string, string][]).map(([id, caption], i): Post => ({
    id: "m" + (i + 1), inFeed: false, mine: true, user: ME,
    image: un(id), fallback: img("fuji-" + (i + 1)), caption,
    likes: 120 + i * 37, liked: false, saved: false,
    createdAt: Date.now() - (i + 3) * 24 * HOUR, comments: [],
  })),
]);

export const seedStories = (): Story[] => ([
  { username: "yuki.films", avatar: av(5), bg: un("1540959733332-eab4deabeeaf", 480, 854), seen: false },
  { username: "sora.travels", avatar: av(32), video: VID("ForBiggerFun"), seen: false },
  { username: "cafe.tokyo", avatar: av(47), bg: un("1670404161009-29548c027d06", 480, 854), seen: false },
  { username: "design_daily", avatar: av(13), bg: un("1626968361222-291e74711449", 480, 854), seen: true },
  { username: "street.snap", avatar: av(8), bg: un("1549693578-d683be217e58", 480, 854), seen: false },
  { username: "kana.draws", avatar: av(23), bg: un("1529778873920-4da4926a72c2", 480, 854), seen: true },
  { username: "ren.photo", avatar: av(60), bg: un("1503899036084-c55cdd92da26", 480, 854), seen: false },
  { username: "mina.eats", avatar: av(45), bg: un("1569718212165-3a8278d5f624", 480, 854), seen: false },
]);

export const seedConversations = (): Conversation[] => ([
  { id: "c1", user: { username: "yuki.films", avatar: av(5), verified: true }, online: true, unread: 2,
    messages: [
      { id: uid(), fromMe: false, text: "この前の夜景の写真、すごく良かった！", at: Date.now() - 40 * 60000 },
      { id: uid(), fromMe: true, text: "ありがとう🙌 設定教えようか？", at: Date.now() - 38 * 60000 },
      { id: uid(), fromMe: false, text: "ぜひ！", at: Date.now() - 12 * 60000 },
      { id: uid(), fromMe: false, text: "今度撮影一緒に行かない？📷", at: Date.now() - 11 * 60000 },
    ] },
  { id: "c2", user: { username: "sora.travels", avatar: av(32), verified: true }, online: false, unread: 0,
    messages: [
      { id: uid(), fromMe: true, text: "登頂おめでとう🗻", at: Date.now() - 5 * 3600000 },
      { id: uid(), fromMe: false, text: "ありがとう！次は富士山行く予定", at: Date.now() - 4.5 * 3600000 },
    ] },
  { id: "c3", user: { username: "design_daily", avatar: av(13), verified: false }, online: true, unread: 1,
    messages: [
      { id: uid(), fromMe: false, text: "Reactのコンポーネント設計の記事シェアするね", at: Date.now() - 2 * 3600000 },
      { id: uid(), fromMe: false, text: "参考になると思う👇", at: Date.now() - 2 * 3600000 },
    ] },
  { id: "c4", user: { username: "cafe.tokyo", avatar: av(47), verified: false }, online: false, unread: 0,
    messages: [
      { id: uid(), fromMe: false, text: "新しいカフェ見つけたよ☕️", at: Date.now() - 26 * 3600000 },
      { id: uid(), fromMe: true, text: "いいね！週末行こう", at: Date.now() - 25 * 3600000 },
    ] },
  { id: "c5", user: { username: "kana.draws", avatar: av(23), verified: false }, online: false, unread: 0,
    messages: [
      { id: uid(), fromMe: true, text: "イラスト最高でした🐈", at: Date.now() - 50 * 3600000 },
    ] },
]);

export const cannedReplies: string[] = [
  "なるほど！", "了解です👍", "ありがとう🙏", "それいいね！", "また連絡するね", "了解、楽しみにしてる😊",
];
