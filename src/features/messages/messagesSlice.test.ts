import messagesReducer, { openConv, sendMessage, receiveReply, setTyping, hydrateMessages } from "./messagesSlice";
import type { Conversation } from "@/shared/types";

const baseConv: Conversation = {
  id: "c1",
  user: { username: "alice", avatar: "", verified: false },
  online: true,
  unread: 3,
  messages: [],
};

describe("messagesSlice", () => {
  it("openConv sets activeId", () => {
    const state = { conversations: [baseConv], activeId: null, typingConv: null };
    const next = messagesReducer(state, openConv("c1"));
    expect(next.activeId).toBe("c1");
  });

  it("openConv clears unread count for opened conversation", () => {
    const state = { conversations: [baseConv], activeId: null, typingConv: null };
    const next = messagesReducer(state, openConv("c1"));
    expect(next.conversations[0].unread).toBe(0);
  });

  it("openConv accepts null to close", () => {
    const state = { conversations: [baseConv], activeId: "c1", typingConv: null };
    const next = messagesReducer(state, openConv(null));
    expect(next.activeId).toBeNull();
  });

  it("sendMessage appends a fromMe message using payload id and at", () => {
    const state = { conversations: [baseConv], activeId: null, typingConv: null };
    const next = messagesReducer(state, sendMessage({ convId: "c1", text: "hello", id: "m1", at: 1000 }));
    expect(next.conversations[0].messages).toHaveLength(1);
    expect(next.conversations[0].messages[0].fromMe).toBe(true);
    expect(next.conversations[0].messages[0].text).toBe("hello");
    expect(next.conversations[0].messages[0].id).toBe("m1");
    expect(next.conversations[0].messages[0].at).toBe(1000);
  });

  it("receiveReply appends a fromMe=false message using payload id and at", () => {
    const state = { conversations: [baseConv], activeId: null, typingConv: null };
    const next = messagesReducer(state, receiveReply({ convId: "c1", text: "hi back", id: "m2", at: 2000 }));
    expect(next.conversations[0].messages).toHaveLength(1);
    expect(next.conversations[0].messages[0].fromMe).toBe(false);
    expect(next.conversations[0].messages[0].text).toBe("hi back");
    expect(next.conversations[0].messages[0].id).toBe("m2");
    expect(next.conversations[0].messages[0].at).toBe(2000);
  });

  it("setTyping sets typingConv", () => {
    const state = { conversations: [baseConv], activeId: null, typingConv: null };
    const next = messagesReducer(state, setTyping("c1"));
    expect(next.typingConv).toBe("c1");
  });

  it("setTyping can be cleared to null", () => {
    const state = { conversations: [baseConv], activeId: null, typingConv: "c1" };
    const next = messagesReducer(state, setTyping(null));
    expect(next.typingConv).toBeNull();
  });

  it("hydrateMessages replaces conversations", () => {
    const newConv: Conversation = {
      id: "c2",
      user: { username: "bob", avatar: "", verified: false },
      online: false,
      unread: 0,
      messages: [],
    };
    const state = { conversations: [baseConv], activeId: null, typingConv: null };
    const next = messagesReducer(state, hydrateMessages([newConv]));
    expect(next.conversations).toHaveLength(1);
    expect(next.conversations[0].id).toBe("c2");
  });
});
