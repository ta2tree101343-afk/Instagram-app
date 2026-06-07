import type { Post, Story, Conversation, Profile, Message, Comment, ViewKey, TabKey } from "./index";

it("types compile", () => {
  const comment: Comment = { id: "c1", user: "alice", text: "hi" };
  const post: Post = {
    id: "p1", inFeed: true, mine: false,
    user: { username: "alice", avatar: "", verified: false },
    image: "", fallback: "", caption: "", likes: 0, liked: false,
    saved: false, createdAt: 0, comments: [comment],
  };
  const story: Story = { username: "alice", avatar: "", seen: false };
  const msg: Message = { id: "m1", fromMe: true, text: "hi", at: 0 };
  const conv: Conversation = {
    id: "c1", user: { username: "alice", avatar: "", verified: false },
    online: true, unread: 0, messages: [msg],
  };
  const profile: Profile = {
    username: "u", name: "n", avatar: "", verified: false,
    bio: "", posts: 0, followers: 0, following: 0,
  };
  const view: ViewKey = "home";
  const tab: TabKey = "posts";
  expect(post.id).toBe("p1");
  expect(story.username).toBe("alice");
  expect(conv.id).toBe("c1");
  expect(profile.username).toBe("u");
  expect(view).toBe("home");
  expect(tab).toBe("posts");
});
