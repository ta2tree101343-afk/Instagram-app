// src/shared/components/layout/Sidebar.tsx
import { Home, Compass, Film, Send, Plus, User, Sun, Moon } from "lucide-react";
import type { ViewKey } from "@/shared/types";
import type { Profile } from "@/shared/types";

interface SidebarProps {
  view: ViewKey | "create";
  setView: (v: ViewKey) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  onCreate: () => void;
  profile: Profile;
  unread: number;
}

export function Sidebar({ view, setView, dark, setDark, onCreate, profile, unread }: SidebarProps) {
  const items = [
    { k: "home" as const, icon: Home, label: "ホーム" },
    { k: "explore" as const, icon: Compass, label: "発見" },
    { k: "reels" as const, icon: Film, label: "リール" },
    { k: "messages" as const, icon: Send, label: "メッセージ", badge: unread },
    { k: "create" as const, icon: Plus, label: "作成" },
    { k: "profile" as const, icon: User, label: "プロフィール", avatar: profile.avatar },
  ];
  return (
    <nav className="side">
      <div className="logo">Lumina</div>
      {items.map((it) => {
        const Icon = it.icon;
        const active = view === it.k;
        return (
          <button key={it.k} className={"nav-item" + (active ? " active" : "")}
            onClick={() => it.k === "create" ? onCreate() : setView(it.k)}>
            {"avatar" in it && it.avatar
              ? <img className="ava" src={it.avatar} alt="" style={{ outline: active ? "2px solid var(--text)" : "none" }} />
              : <span style={{ position: "relative", display: "grid", placeItems: "center" }}>
                  <Icon size={26} strokeWidth={active ? 2.6 : 2} />
                  {"badge" in it && (it.badge ?? 0) > 0 && (
                    <span style={{ position: "absolute", top: -4, right: -6, minWidth: 17, height: 17, padding: "0 4px", borderRadius: 9, background: "var(--like)", color: "#fff", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center" }}>{it.badge}</span>
                  )}
                </span>}
            <span>{it.label}</span>
          </button>
        );
      })}
      <div className="spacer" />
      <button className="nav-item" onClick={() => setDark(!dark)}>
        {dark ? <Sun size={26} /> : <Moon size={26} />}
        <span>{dark ? "ライト" : "ダーク"}モード</span>
      </button>
    </nav>
  );
}
