// src/features/feed/components/Feed.tsx
import type { Post as PostType } from "@/shared/types";
import { Post } from "./Post";

interface FeedProps {
  header?: React.ReactNode;
  posts: PostType[];
  onLike: (id: string, liked: boolean) => void;
  onSave: (id: string, saved: boolean) => void;
  onComment: (id: string, text: string) => void;
  onOpen: (id: string) => void;
  onToast: (msg: string) => void;
}

export function Feed({ header, posts, ...handlers }: FeedProps) {
  const feed = posts.filter((p) => p.inFeed);
  return (
    <div className="center">
      {header}
      {feed.map((p) => <Post key={p.id} p={p} {...handlers} />)}
    </div>
  );
}
