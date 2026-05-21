import { useState } from "react";
import { fmtDate, initials } from "../constants/feedData";

export function Skeleton() {
  return (
    <div className="eq-skeleton">
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="eq-skel-line" style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="eq-skel-line" style={{ width: "50%", marginBottom: 6 }} />
          <div className="eq-skel-line" style={{ width: "30%" }} />
        </div>
      </div>
      <div className="eq-skel-line" style={{ width: "80%", height: 16, marginBottom: 10 }} />
      <div className="eq-skel-line" style={{ width: "100%", marginBottom: 6 }} />
      <div className="eq-skel-line" style={{ width: "90%", marginBottom: 6 }} />
      <div className="eq-skel-line" style={{ width: "60%" }} />
    </div>
  );
}

export function PostCard({ post, delay }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 300) + 10);

  const toggleLike = () => { setLiked(p => !p); setLikes(p => liked ? p - 1 : p + 1); };

  if (post.type === "news") {
    return (
      <div className="eq-post" style={{ animationDelay: `${delay}s` }}>
        {/* Agrega aquí el interior original de tu if (post.type === "news") */}
      </div>
    );
  }

  if (post.type === "testimony") {
    // ... interior original de post.type === "testimony"
  }

  if (post.type === "law") {
    // ... interior original de post.type === "law"
  }

  return null;
}