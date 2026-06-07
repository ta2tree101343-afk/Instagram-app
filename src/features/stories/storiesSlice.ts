import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Story } from "@/shared/types";
import { seedStories } from "@/shared/data/seeds";

interface StoriesState {
  items: Story[];
  viewerIndex: number | null;
}

const initialState: StoriesState = {
  items: seedStories(),
  viewerIndex: null,
};

export const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    markSeen(state, action: PayloadAction<string>) {
      const s = state.items.find((s) => s.username === action.payload);
      if (s) s.seen = true;
    },
    setViewerIndex(state, action: PayloadAction<number | null>) {
      state.viewerIndex = action.payload;
    },
    hydrate(state, action: PayloadAction<Story[]>) {
      state.items = action.payload;
    },
  },
});

export const { markSeen, setViewerIndex, hydrate: hydrateStories } = storiesSlice.actions;
export default storiesSlice.reducer;
