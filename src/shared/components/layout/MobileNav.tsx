// src/shared/components/layout/MobileNav.tsx
import { Home, Compass, Film, Plus } from "lucide-react";
import type { ViewKey } from "@/shared/types";
import type { Profile } from "@/shared/types";

interface MobileNavProps {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  onCreate: () => void;
  profile: Profile;
}

export function MobileNav({ view, setView, onCreate, profile }: MobileNavProps) {
  return (
    <nav className="mnav">
      <button className="mn" aria-label="ホーム" onClick={() => setView("home")}><Home size={26} strokeWidth={view === "home" ? 2.6 : 2} /></button>
      <button className="mn" aria-label="発見" onClick={() => setView("explore")}><Compass size={26} strokeWidth={view === "explore" ? 2.6 : 2} /></button>
      <button className="mn" aria-label="作成" onClick={onCreate}><Plus size={28} /></button>
      <button className="mn" aria-label="リール" onClick={() => setView("reels")}><Film size={26} strokeWidth={view === "reels" ? 2.6 : 2} /></button>
      <button className={"mn" + (view === "profile" ? " active" : "")} aria-label="プロフィール" onClick={() => setView("profile")}>
        <img className="ava" src={profile.avatar} alt="" />
      </button>
    </nav>
  );
}
