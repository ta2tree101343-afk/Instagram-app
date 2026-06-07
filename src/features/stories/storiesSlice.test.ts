import storiesReducer, { markSeen, setViewerIndex, hydrateStories } from "./storiesSlice";
import type { Story } from "@/shared/types";

const baseStory: Story = {
  username: "alice",
  avatar: "",
  seen: false,
};

describe("storiesSlice", () => {
  it("markSeen sets seen=true for matching username", () => {
    const state = { items: [baseStory], viewerIndex: null };
    const next = storiesReducer(state, markSeen("alice"));
    expect(next.items[0].seen).toBe(true);
  });

  it("markSeen does not affect non-matching username", () => {
    const state = { items: [baseStory], viewerIndex: null };
    const next = storiesReducer(state, markSeen("bob"));
    expect(next.items[0].seen).toBe(false);
  });

  it("setViewerIndex sets the index", () => {
    const state = { items: [baseStory], viewerIndex: null };
    const next = storiesReducer(state, setViewerIndex(2));
    expect(next.viewerIndex).toBe(2);
  });

  it("setViewerIndex can be set to null", () => {
    const state = { items: [baseStory], viewerIndex: 2 };
    const next = storiesReducer(state, setViewerIndex(null));
    expect(next.viewerIndex).toBeNull();
  });

  it("hydrateStories replaces items", () => {
    const newStory: Story = { username: "bob", avatar: "", seen: true };
    const state = { items: [baseStory], viewerIndex: null };
    const next = storiesReducer(state, hydrateStories([newStory]));
    expect(next.items).toHaveLength(1);
    expect(next.items[0].username).toBe("bob");
  });
});
