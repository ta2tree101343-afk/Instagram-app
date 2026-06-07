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
      <button className="mn" onClick={() => setView("home")}><Home size={26} strokeWidth={view === "home" ? 2.6 : 2} /></button>
      <button className="mn" onClick={() => setView("explore")}><Compass size={26} strokeWidth={view === "explore" ? 2.6 : 2} /></button>
      <button className="mn" onClick={onCreate}><Plus size={28} /></button>
      <button className="mn" onClick={() => setView("reels")}><Film size={26} strokeWidth={view === "reels" ? 2.6 : 2} /></button>
      <button className={"mn" + (view === "profile" ? " active" : "")} onClick={() => setView("profile")}>
        <img className="ava" src={profile.avatar} alt="" />
      </button>
    </nav>
  );
}
