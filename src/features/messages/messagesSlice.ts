import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Conversation } from "@/shared/types";
import { seedConversations } from "@/shared/data/seeds";

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
    sendMessage(state, action: PayloadAction<{ convId: string; text: string; id: string; at: number }>) {
      const c = state.conversations.find((c) => c.id === action.payload.convId);
      if (c) c.messages.push({ id: action.payload.id, fromMe: true, text: action.payload.text, at: action.payload.at });
    },
    receiveReply(state, action: PayloadAction<{ convId: string; text: string; id: string; at: number }>) {
      const c = state.conversations.find((c) => c.id === action.payload.convId);
      if (c) c.messages.push({ id: action.payload.id, fromMe: false, text: action.payload.text, at: action.payload.at });
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
