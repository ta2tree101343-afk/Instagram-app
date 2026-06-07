import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Conversation } from "@/shared/types";
import { seedConversations } from "@/shared/data/seeds";
import { uid } from "@/shared/utils";

interface MessagesState {
  conversations: Conversation[];
  activeId: string | null;
  typingConv: string | null;
}

const initialState: MessagesState = {
  conversations: seedConversations(),
  activeId: null,
  typingConv: null,
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    openConv(state, action: PayloadAction<string | null>) {
      state.activeId = action.payload;
      if (action.payload) {
        const c = state.conversations.find((c) => c.id === action.payload);
        if (c) c.unread = 0;
      }
    },
    sendMessage(state, action: PayloadAction<{ convId: string; text: string }>) {
      const c = state.conversations.find((c) => c.id === action.payload.convId);
      if (c) c.messages.push({ id: uid(), fromMe: true, text: action.payload.text, at: Date.now() });
    },
    receiveReply(state, action: PayloadAction<{ convId: string; text: string }>) {
      const c = state.conversations.find((c) => c.id === action.payload.convId);
      if (c) c.messages.push({ id: uid(), fromMe: false, text: action.payload.text, at: Date.now() });
    },
    setTyping(state, action: PayloadAction<string | null>) {
      state.typingConv = action.payload;
    },
    hydrate(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },
  },
});

export const { openConv, sendMessage, receiveReply, setTyping, hydrate: hydrateMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
