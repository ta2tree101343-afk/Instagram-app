import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Profile, TabKey } from "@/shared/types";
import { ME } from "@/shared/utils";

interface ProfileState {
  profile: Profile;
  tab: TabKey;
}

const initialState: ProfileState = {
  profile: { ...ME },
  tab: "posts",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<TabKey>) {
      state.tab = action.payload;
    },
    incrementPosts(state) {
      state.profile.posts += 1;
    },
    hydrate(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
  },
});

export const { setTab, incrementPosts, hydrate: hydrateProfile } = profileSlice.actions;
export default profileSlice.reducer;
