import { useRef, useState, useEffect } from "react";
import { Film, Volume2, VolumeX } from "lucide-react";
import { gradCss, USE_REAL_MEDIA } from "@/shared/utils";

interface VideoBoxProps {
  src: string;
  poster?: string;
  onDoubleClick?: () => void;
}

export function VideoBox({ src, poster, onDoubleClick }: VideoBoxProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => { if (ref.current) ref.current.muted = muted; }, [muted]);

  if (!USE_REAL_MEDIA) {
    return (
      <>
        <div className="post-vid vid-ph" onDoubleClick={onDoubleClick} style={{ background: gradCss(src) }}>
          <span className="play-tri" />
        </div>
        <span className="vid-badge"><Film size={14} fill="#fff" /></span>
      </>
    );
  }
  return (
    <>
      <video ref={ref} src={src} poster={poster} autoPlay loop muted playsInline
        className="post-vid" onDoubleClick={onDoubleClick} />
      <button className="vid-mute" onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}>
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
      <span className="vid-badge"><Film size={14} fill="#fff" /></span>
    </>
  );
}
