// src/features/feed/components/Feed.tsx
import type { Post as PostType, Story } from "@/shared/types";
import { Stories } from "@/features/stories/components/Stories";
import { Post } from "./Post";

interface FeedProps {
  posts: PostType[];
  stories: Story[];
  onOpenStory: (index: number) => void;
  onLike: (id: string, liked: boolean) => void;
  onSave: (id: string, saved: boolean) => void;
  onComment: (id: string, text: string) => void;
  onOpen: (id: string) => void;
  onToast: (msg: string) => void;
}

export function Feed({ posts, stories, onOpenStory, ...handlers }: FeedProps) {
  const feed = posts.filter((p) => p.inFeed);
  return (
    <div className="center">
      <Stories stories={stories} onOpen={onOpenStory} />
      {feed.map((p) => <Post key={p.id} p={p} {...handlers} />)}
    </div>
  );
}
