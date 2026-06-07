import profileReducer, { setTab, incrementPosts, hydrateProfile } from "./profileSlice";
import type { Profile } from "@/shared/types";

const baseProfile: Profile = {
  username: "testuser",
  name: "Test User",
  avatar: "",
  verified: false,
  bio: "",
  posts: 5,
  followers: 100,
  following: 50,
};

describe("profileSlice", () => {
  it("setTab updates the active tab", () => {
    const state = { profile: baseProfile, tab: "posts" as const };
    const next = profileReducer(state, setTab("saved"));
    expect(next.tab).toBe("saved");
  });

  it("setTab can switch back to posts", () => {
    const state = { profile: baseProfile, tab: "saved" as const };
    const next = profileReducer(state, setTab("posts"));
    expect(next.tab).toBe("posts");
  });

  it("incrementPosts increases posts count by 1", () => {
    const state = { profile: baseProfile, tab: "posts" as const };
    const next = profileReducer(state, incrementPosts());
    expect(next.profile.posts).toBe(6);
  });

  it("incrementPosts is cumulative", () => {
    const state = { profile: baseProfile, tab: "posts" as const };
    const s1 = profileReducer(state, incrementPosts());
    const s2 = profileReducer(s1, incrementPosts());
    expect(s2.profile.posts).toBe(7);
  });

  it("hydrateProfile replaces profile", () => {
    const newProfile: Profile = { ...baseProfile, username: "newuser", posts: 99 };
    const state = { profile: baseProfile, tab: "posts" as const };
    const next = profileReducer(state, hydrateProfile(newProfile));
    expect(next.profile.username).toBe("newuser");
    expect(next.profile.posts).toBe(99);
  });
});
