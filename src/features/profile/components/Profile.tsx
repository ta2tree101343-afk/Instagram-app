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
