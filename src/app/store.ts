import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import feedReducer from "@/features/feed/feedSlice";
import storiesReducer from "@/features/stories/storiesSlice";
import messagesReducer from "@/features/messages/messagesSlice";
import profileReducer from "@/features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    stories: storiesReducer,
    messages: messagesReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
