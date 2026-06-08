import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "@/shared/types";
import { seedPosts } from "@/shared/data/seeds";
import { ME } from "@/shared/utils";

interface FeedState {
  posts: Post[];
  openId: string | null;
}

const initialState: FeedState = {
  posts: seedPosts(),
  openId: null,
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    like(state, action: PayloadAction<{ id: string; liked: boolean }>) {
      const p = state.posts.find((p) => p.id === action.payload.id);
      if (p) {
        p.likes = action.payload.liked ? p.likes + 1 : Math.max(0, p.likes - 1);
        p.liked = action.payload.liked;
      }
    },
    save(state, action: PayloadAction<{ id: string; saved: boolean }>) {
      const p = state.posts.find((p) => p.id === action.payload.id);
      if (p) p.saved = action.payload.saved;
    },
    comment(state, action: PayloadAction<{ id: string; text: string; username: string; commentId: string }>) {
      const p = state.posts.find((p) => p.id === action.payload.id);
      if (p) p.comments.push({ id: action.payload.commentId, user: action.payload.username, text: action.payload.text });
    },
    create(state, action: PayloadAction<{ id: string; at: number; image: string; caption: string }>) {
      state.posts.unshift({
        id: action.payload.id, inFeed: true, mine: true, user: ME,
        image: action.payload.image, fallback: action.payload.image,
        caption: action.payload.caption, likes: 0, liked: false, saved: false,
        createdAt: action.payload.at, comments: [],
      });
    },
    setOpenId(state, action: PayloadAction<string | null>) {
      state.openId = action.payload;
    },
    hydrate(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
  },
});

export const { like, save, comment, create, setOpenId, hydrate: hydrateFeed } = feedSlice.actions;
export default feedSlice.reducer;
