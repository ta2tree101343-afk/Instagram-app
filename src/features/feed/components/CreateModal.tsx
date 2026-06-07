// src/features/feed/components/CreateModal.tsx
import { useState } from "react";
import { X, ChevronLeft, Camera } from "lucide-react";
import { un } from "@/shared/utils";

interface CreateModalProps {
  onClose: () => void;
  onCreate: (image: string, caption: string) => void;
}

export function CreateModal({ onClose, onCreate }: CreateModalProps) {
  const [step, setStep] = useState(1);
  const [sel, setSel] = useState<string | null>(null);
  const [cap, setCap] = useState("");
  const [choices] = useState(() =>
    [
      "1623341214825-9f4f963727da", "1497636577773-f1231844b336",
      "1501554728187-ce583db33af7", "1604928141064-207cea6f571f",
      "1536098561742-ca998e48cbcc", "1540959733332-eab4deabeeaf",
      "1590212151175-e58edd96185b", "1551632811-561732d1e306",
    ].map((id) => un(id))
  );
  return (
    <div className="overlay" onClick={onClose}>
      <div className="create" onClick={(e) => e.stopPropagation()}>
        <div className="create-head">
          {step === 2
            ? <button onClick={() => setStep(1)}><ChevronLeft size={22} /></button>
            : <button onClick={onClose}><X size={22} /></button>}
          <span>{step === 1 ? "新規投稿を作成" : "シェア"}</span>
          {step === 1
            ? <button onClick={() => sel && setStep(2)} style={{ opacity: sel ? 1 : 0.4, pointerEvents: sel ? "auto" : "none" }}>次へ</button>
            : <button onClick={() => sel && onCreate(sel, cap)}>シェアする</button>}
        </div>
        <div className="create-body">
          {step === 1 ? (
            <>
              <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14, textAlign: "center" }}>
                <Camera size={36} style={{ display: "block", margin: "0 auto 8px" }} />写真を選んでください
              </p>
              <div className="pick-grid">
                {choices.map((src) => (
                  <button className={"pick" + (sel === src ? " sel" : "")} key={src} onClick={() => setSel(src)}>
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="preview">
                {sel && <img src={sel} alt="" />}
                <textarea value={cap} onChange={(e) => setCap(e.target.value)}
                  placeholder="キャプションを入力…" maxLength={2200} />
              </div>
              <div style={{ color: "var(--muted)", fontSize: 12, textAlign: "right" }}>{cap.length}/2,200</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
