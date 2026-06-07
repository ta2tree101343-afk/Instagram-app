// src/features/messages/components/Messages.tsx
import { useRef, useEffect, useState } from "react";
import { Send, Smile, BadgeCheck, ChevronLeft } from "lucide-react";
import type { Conversation } from "@/shared/types";
import { PenSquare } from "@/shared/components/icons";
import { ME, ago } from "@/shared/utils";

interface MessagesProps {
  conversations: Conversation[];
  activeId: string | null;
  openConv: (id: string | null) => void;
  onSend: (convId: string, text: string) => void;
  typingConv: string | null;
}

export function Messages({ conversations, activeId, openConv, onSend, typingConv }: MessagesProps) {
  const active = conversations.find((c) => c.id === activeId) ?? null;
  const [text, setText] = useState("");
  const msgsRef = useRef<HTMLDivElement>(null);
  const total = conversations.reduce((s, c) => s + c.unread, 0);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [active?.messages.length, typingConv, activeId]);

  const send = () => {
    if (!text.trim() || !active) return;
    onSend(active.id, text.trim());
    setText("");
  };

  return (
    <div className={"dm" + (active ? " thread-open" : "")}>
      <div className="dm-list">
        <div className="dm-list-head">
          <div className="me">{ME.username}{ME.verified && <BadgeCheck size={16} className="v" fill="var(--accent)" color="#fff" />}</div>
          <button><PenSquare /></button>
        </div>
        <div style={{ padding: "0 18px 10px", fontWeight: 700, fontSize: 15 }}>
          メッセージ{total > 0 && <span style={{ color: "var(--muted)", fontWeight: 400 }}>（未読 {total}）</span>}
        </div>
        <div className="dm-convs">
          {conversations.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <button key={c.id} className={"conv" + (c.id === activeId ? " active" : "")} onClick={() => openConv(c.id)}>
                <div className="av-wrap">
                  <img src={c.user.avatar} alt="" />
                  {c.online && <span className="online" />}
                </div>
                <div className="ci">
                  <div className="cn">{c.user.username}{c.user.verified && <BadgeCheck size={13} className="v" fill="var(--accent)" color="#fff" />}</div>
                  <div className={"cp" + (c.unread ? " bold" : "")}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{last.fromMe ? "あなた: " : ""}{last.text}</span>
                    <span>· {ago(last.at)}</span>
                  </div>
                </div>
                {c.unread > 0 && <span className="badge" />}
              </button>
            );
          })}
        </div>
      </div>
      <div className="dm-thread">
        {active ? (
          <>
            <div className="dm-thread-head">
              <button className="back" onClick={() => openConv(null)}><ChevronLeft size={26} /></button>
              <img src={active.user.avatar} alt="" />
              <div>
                <div className="th-name">{active.user.username}{active.user.verified && <BadgeCheck size={14} className="v" fill="var(--accent)" color="#fff" />}</div>
                <div className="th-status">{active.online ? "アクティブ" : "オフライン"}</div>
              </div>
            </div>
            <div className="dm-msgs" ref={msgsRef}>
              {active.messages.map((m, idx) => {
                const prev = active.messages[idx - 1];
                const showAva = !m.fromMe && (!prev || prev.fromMe);
                return (
                  <div className={"brow " + (m.fromMe ? "me" : "them")} key={m.id}>
                    {!m.fromMe && (showAva ? <img src={active.user.avatar} alt="" /> : <div style={{ width: 24, flex: "0 0 auto" }} />)}
                    <div className={"bubble " + (m.fromMe ? "me" : "them")}>{m.text}</div>
                  </div>
                );
              })}
              {typingConv === active.id && (
                <div className="brow them">
                  <img src={active.user.avatar} alt="" />
                  <div className="typing"><span /><span /><span /></div>
                </div>
              )}
            </div>
            <div className="dm-input">
              <Smile size={24} color="var(--muted)" />
              <input value={text} onChange={(e) => setText(e.target.value)}
                placeholder="メッセージを送信…" onKeyDown={(e) => e.key === "Enter" && send()} />
              {text.trim() ? <button className="snd" onClick={send}>送信</button> : <Send size={22} color="var(--accent)" />}
            </div>
          </>
        ) : (
          <div className="dm-empty">
            <div className="circle"><Send size={40} /></div>
            <div style={{ fontSize: 20 }}>あなたのメッセージ</div>
            <p>友達や知り合いにメッセージを送りましょう</p>
          </div>
        )}
      </div>
    </div>
  );
}
