import { useState } from "react";
import { gradCss } from "@/shared/utils";

interface MediaProps {
  src: string;
  fallback?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export function Media({ src, fallback, alt = "", className, style, onClick, onDoubleClick }: MediaProps) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={className} onClick={onClick} onDoubleClick={onDoubleClick}
        style={{ ...style, width: "100%", height: "100%", background: gradCss(fallback ?? src ?? alt) }} />
    );
  }
  return (
    <img src={src} alt={alt} className={className} style={style}
      loading="lazy" onError={() => setErr(true)}
      onClick={onClick} onDoubleClick={onDoubleClick} />
  );
}
