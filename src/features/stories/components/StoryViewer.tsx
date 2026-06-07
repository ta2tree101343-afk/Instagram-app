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
        <button className="sv-tap l" aria-label="前の投稿" onClick={prev} />
        <button className="sv-tap r" aria-label="次の投稿" onClick={next} />
      </div>
    </div>
  );
}
