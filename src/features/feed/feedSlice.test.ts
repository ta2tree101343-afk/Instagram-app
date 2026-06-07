import feedReducer, { like, save, comment, create, setOpenId, hydrateFeed } from "./feedSlice";
import type { Post } from "@/shared/types";

const basePost: Post = {
  id: "p1", inFeed: true, mine: false,
  user: { username: "alice", avatar: "", verified: false },
  image: "", fallback: "", caption: "", likes: 10,
  liked: false, saved: false, createdAt: 0, comments: [],
};

describe("feedSlice", () => {
  it("like increments likes and sets liked=true", () => {
    const state = { posts: [basePost], openId: null };
    const next = feedReducer(state, like({ id: "p1", liked: true }));
    expect(next.posts[0].likes).toBe(11);
    expect(next.posts[0].liked).toBe(true);
  });

  it("unlike decrements likes", () => {
    const likedPost = { ...basePost, liked: true, likes: 10 };
    const state = { posts: [likedPost], openId: null };
    const next = feedReducer(state, like({ id: "p1", liked: false }));
    expect(next.posts[0].likes).toBe(9);
    expect(next.posts[0].liked).toBe(false);
  });

  it("save sets saved flag", () => {
    const state = { posts: [basePost], openId: null };
    const next = feedReducer(state, save({ id: "p1", saved: true }));
    expect(next.posts[0].saved).toBe(true);
  });

  it("comment appends a comment", () => {
    const state = { posts: [basePost], openId: null };
    const next = feedReducer(state, comment({ id: "p1", text: "hi", username: "bob", commentId: "c1" }));
    expect(next.posts[0].comments).toHaveLength(1);
    expect(next.posts[0].comments[0].text).toBe("hi");
    expect(next.posts[0].comments[0].id).toBe("c1");
  });

  it("create prepends a new post using payload id and at", () => {
    const state = { posts: [], openId: null };
    const next = feedReducer(state, create({ id: "new1", at: 9999, image: "img.jpg", caption: "test" }));
    expect(next.posts).toHaveLength(1);
    expect(next.posts[0].id).toBe("new1");
    expect(next.posts[0].createdAt).toBe(9999);
    expect(next.posts[0].caption).toBe("test");
    expect(next.posts[0].mine).toBe(true);
  });

  it("setOpenId updates openId", () => {
    const state = { posts: [], openId: null };
    const next = feedReducer(state, setOpenId("p1"));
    expect(next.openId).toBe("p1");
  });

  it("hydrateFeed replaces posts", () => {
    const state = { posts: [basePost], openId: null };
    const next = feedReducer(state, hydrateFeed([]));
    expect(next.posts).toHaveLength(0);
  });
});
