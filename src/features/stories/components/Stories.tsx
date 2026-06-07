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
