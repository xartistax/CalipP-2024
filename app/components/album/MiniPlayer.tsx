"use client";

import Image from "next/image";
import { useAudio } from "./AudioProvider";
import { useState } from "react";
import FullscreenPlayer from "./FullscreenPlayer";

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, currentTime, duration } = useAudio();
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "10px 12px max(10px, env(safe-area-inset-bottom))",
          background: "rgba(5,5,5,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(245,181,46,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "760px",
            margin: "auto",
          }}
        >
          <Image src="/albums/i-thoughts-10years/front.jpg" alt="Album Cover" width={48} height={48} style={{ borderRadius: "6px" }} />

          <div
            onClick={() => setIsFullscreenOpen(true)}
            style={{
              flex: 1,

              minWidth: 0,

              cursor: "pointer",
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentTrack.title}
            </div>

            <div style={{ color: "#F5B52E", fontSize: "11px" }}>Cali P</div>
          </div>

          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              background: "#B6FF00",
              color: "#000",
              border: 0,
              borderRadius: "50%",
              width: 42,
              height: 42,
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>

          <button
            onClick={nextTrack}
            aria-label="Next track"
            style={{
              background: "transparent",
              color: "#fff",
              border: 0,
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ⏭
          </button>
        </div>

        <div
          style={{
            height: "3px",
            background: "#333",
            marginTop: "10px",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#B6FF00",
              transition: "width 0.2s linear",
            }}
          />
        </div>
      </div>
      <FullscreenPlayer isOpen={isFullscreenOpen} onClose={() => setIsFullscreenOpen(false)} />
    </>
  );
}
