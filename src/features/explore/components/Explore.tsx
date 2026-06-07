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
