// src/app/App.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Sun, Moon, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "./store";
import type { ViewKey, Post, Story, Conversation } from "@/shared/types";
import { like, save, comment, create, setOpenId, hydrateFeed } from "@/features/feed/feedSlice";
import { markSeen, setViewerIndex, hydrateStories } from "@/features/stories/storiesSlice";
import { openConv, sendMessage, receiveReply, setTyping, hydrateMessages } from "@/features/messages/messagesSlice";
import { setTab } from "@/features/profile/profileSlice";
import { loadState, saveState } from "@/shared/lib/storage";
import { cannedReplies } from "@/shared/data/seeds";
import { uid } from "@/shared/utils";
import { Feed } from "@/features/feed/components/Feed";
import { Explore } from "@/features/explore/components/Explore";
import { Profile } from "@/features/profile/components/Profile";
import { Reels } from "@/features/reels/components/Reels";
import { Messages } from "@/features/messages/components/Messages";
import { PostModal } from "@/features/feed/components/PostModal";
import { CreateModal } from "@/features/feed/components/CreateModal";
import { Stories } from "@/features/stories/components/Stories";
import { StoryViewer } from "@/features/stories/components/StoryViewer";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { MobileNav } from "@/shared/components/layout/MobileNav";

export default function App() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((s) => s.feed.posts);
  const openId = useAppSelector((s) => s.feed.openId);
  const stories = useAppSelector((s) => s.stories.items);
  const storyIdx = useAppSelector((s) => s.stories.viewerIndex);
  const conversations = useAppSelector((s) => s.messages.conversations);
  const activeConv = useAppSelector((s) => s.messages.activeId);
  const typingConv = useAppSelector((s) => s.messages.typingConv);
  const profile = useAppSelector((s) => s.profile.profile);
  const tab = useAppSelector((s) => s.profile.tab);

  const [dark, setDark] = useState(false);
  const [view, setView] = useState<ViewKey>("home");
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dmReplyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Grand+Hotel&display=swap";
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const saved = await loadState();
        if (saved) {
          if (Array.isArray(saved.posts)) dispatch(hydrateFeed(saved.posts as Post[]));
          if (Array.isArray(saved.stories)) dispatch(hydrateStories(saved.stories as Story[]));
          if (Array.isArray(saved.conversations)) dispatch(hydrateMessages(saved.conversations as Conversation[]));
        }
      } catch (err) {
        console.error("[App] Failed to hydrate state from storage", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => saveState({ posts, stories, conversations }), 400);
    return () => clearTimeout(t);
  }, [posts, stories, conversations, loaded]);

  useEffect(() => {
    return () => {
      if (dmReplyTimer.current) clearTimeout(dmReplyTimer.current);
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const onLike = useCallback((id: string, liked: boolean) => dispatch(like({ id, liked })), [dispatch]);
  const onSave = useCallback((id: string, saved: boolean) => {
    dispatch(save({ id, saved }));
    showToast(saved ? "保存しました" : "保存を解除しました");
  }, [dispatch, showToast]);
  const onComment = useCallback((id: string, text: string) =>
    dispatch(comment({ id, text, username: profile.username, commentId: uid() })), [dispatch, profile.username]);

  const handleCreate = useCallback((image: string, caption: string) => {
    dispatch(create({ image, caption, id: uid(), at: Date.now() }));
    setCreateOpen(false);
    setView("home");
    showToast("投稿をシェアしました 🎉");
  }, [dispatch, showToast]);

  const handleSendDM = useCallback((convId: string, text: string) => {
    dispatch(sendMessage({ convId, text, id: uid(), at: Date.now() }));
    dispatch(setTyping(convId));
    if (dmReplyTimer.current) clearTimeout(dmReplyTimer.current);
    dmReplyTimer.current = setTimeout(() => {
      const reply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
      dispatch(receiveReply({ convId, text: reply, id: uid(), at: Date.now() }));
      dispatch(setTyping(null));
    }, 1500);
  }, [dispatch]);

  const openPost = posts.find((p) => p.id === openId) ?? null;
  const unreadTotal = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <div className={"lumina" + (dark ? " dark" : "")}>
      <Sidebar view={view} setView={setView} dark={dark} setDark={setDark}
        onCreate={() => setCreateOpen(true)} profile={profile} unread={unreadTotal} />

      <div className="main">
        <div className="topbar">
          <div className="logo">Lumina</div>
          <div className="tb-right">
            <button onClick={() => setDark(!dark)}>{dark ? <Sun size={24} /> : <Moon size={24} />}</button>
            <button onClick={() => showToast("通知はありません")}><Heart size={24} /></button>
            <button onClick={() => setView("messages")} style={{ position: "relative" }}>
              <Send size={24} />
              {unreadTotal > 0 && (
                <span style={{ position: "absolute", top: -5, right: -6, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: "var(--like)", color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>{unreadTotal}</span>
              )}
            </button>
          </div>
        </div>

        {view === "home" && (
          <Feed
            header={<Stories stories={stories} onOpen={(i) => dispatch(setViewerIndex(i))} />}
            posts={posts}
            onLike={onLike} onSave={onSave} onComment={onComment}
            onOpen={(id) => dispatch(setOpenId(id))} onToast={showToast} />
        )}
        {view === "explore" && <Explore posts={posts} onOpen={(id) => dispatch(setOpenId(id))} />}
        {view === "reels" && <Reels posts={posts} onLike={onLike} onToast={showToast} />}
        {view === "profile" && (
          <Profile profile={profile} posts={posts} tab={tab}
            setTab={(t) => dispatch(setTab(t))}
            onOpen={(id) => dispatch(setOpenId(id))} onToast={showToast} />
        )}
        {view === "messages" && (
          <Messages conversations={conversations} activeId={activeConv}
            openConv={(id) => dispatch(openConv(id))} onSend={handleSendDM} typingConv={typingConv} />
        )}
      </div>

      <MobileNav view={view} setView={setView} onCreate={() => setCreateOpen(true)} profile={profile} />

      {openPost && (
        <PostModal p={openPost} onClose={() => dispatch(setOpenId(null))}
          onLike={onLike} onSave={onSave} onComment={onComment} onToast={showToast} />
      )}
      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} onCreate={handleCreate} />}
      {storyIdx !== null && (
        <StoryViewer stories={stories} index={storyIdx}
          onClose={() => dispatch(setViewerIndex(null))}
          onSeen={(u) => dispatch(markSeen(u))} />
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
