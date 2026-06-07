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
