// src/features/feed/components/PostModal.tsx
import { useState } from "react";
import { X, Heart, Send, Bookmark, Smile, BadgeCheck } from "lucide-react";
import type { Post } from "@/shared/types";
import { Media } from "@/shared/components/media";
import { fmt, ago, gradCss, USE_REAL_MEDIA, svgAvatar, hue } from "@/shared/utils";

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
      <button className="close" onClick={(e) => { e.stopPropagation(); onClose(); }}><X size={28} /></button>
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
              <div><b>{p.user.username}</b> {p.caption}</div>
            </div>
            {p.comments.map((c) => (
              <div className="cm-row" key={c.id}>
                <img src={svgAvatar(hue(c.user))} alt="" />
                <div><b>{c.user}</b> {c.text}</div>
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
