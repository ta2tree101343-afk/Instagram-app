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
              <button className="ri" aria-label="シェア" onClick={() => onToast("シェアしました")}><Send size={26} /></button>
              <button className="ri" aria-label="オプション" onClick={() => onToast("オプション準備中")}><MoreHorizontal size={26} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
