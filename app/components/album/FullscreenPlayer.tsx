"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import PlayerBackground from "./PlayerBackground";

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function FullscreenPlayer({ isOpen, onClose }: FullscreenPlayerProps) {
  const { currentTrack, isPlaying, togglePlay, nextTrack, previousTrack, currentTime, duration, seek, shuffle, repeatMode, toggleShuffle, cycleRepeatMode } =
    useAudio();

  return (
    <AnimatePresence>
      {isOpen && currentTrack && (
        <motion.div
          key="fullscreen-player"
          role="dialog"
          aria-modal="true"
          aria-label="Music player"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 280,
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120) onClose();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "#050505",
            color: "#fff",
            overflowY: "auto",
            overscrollBehavior: "contain",
            touchAction: "pan-y",
          }}
        >
          {/* Background glow */}
          <PlayerBackground isPlaying={isPlaying} />

          <div
            style={{
              position: "relative",
              minHeight: "100dvh",
              maxWidth: 520,
              margin: "0 auto",
              padding: "max(24px, env(safe-area-inset-top)) 24px max(32px, env(safe-area-inset-bottom))",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            {/* Header */}
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close player"
                style={{
                  background: "transparent",
                  border: 0,
                  color: "#fff",
                  fontSize: 28,
                  cursor: "pointer",
                  width: 44,
                  height: 44,
                }}
              >
                ⌄
              </button>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: "#F5B52E",
                    fontSize: 10,
                    letterSpacing: 3,
                  }}
                >
                  NOW PLAYING
                </div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    marginTop: 5,
                  }}
                >
                  iTHOUGHTS DELUXE
                </div>
              </div>

              <div style={{ width: 44 }} />
            </header>

            {/* Cover */}
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0.7, scale: 0.94 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) {
                  nextTrack();
                } else if (info.offset.x > 80) {
                  previousTrack();
                }
              }}
              animate={{
                scale: isPlaying ? [1, 1.025, 1] : 1,
              }}
              transition={{
                duration: 5,
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut",
              }}
              style={{
                width: "100%",
                maxWidth: 390,
                aspectRatio: "1",
                margin: "auto",
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 25px 90px rgba(245,181,46,0.18)",
              }}
            >
              <Image
                src="/albums/i-thoughts-10years/front.jpg"
                alt="iThoughts Deluxe"
                fill
                sizes="(max-width: 768px) 90vw, 390px"
                style={{ objectFit: "cover" }}
              />
            </motion.div>

            {/* Controls */}
            <div style={{ width: "100%" }}>
              <div style={{ marginBottom: 32 }}>
                <h2
                  style={{
                    fontSize: "clamp(24px, 6vw, 32px)",
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  {currentTrack.title}
                </h2>

                <p
                  style={{
                    color: "#F5B52E",
                    fontSize: 14,
                    marginTop: 8,
                  }}
                >
                  Cali P
                </p>
              </div>

              {/* Progress */}
              <input
                type="range"
                min={0}
                max={duration || 1}
                value={Math.min(currentTime, duration || 1)}
                onChange={(event) => seek(Number(event.target.value))}
                aria-label="Seek"
                style={{
                  width: "100%",
                  accentColor: "#B6FF00",
                  cursor: "pointer",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#999",
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Playback controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 36,
                  marginTop: 28,
                }}
              >
                <button
                  type="button"
                  onClick={toggleShuffle}
                  aria-label={shuffle ? "Disable shuffle" : "Enable shuffle"}
                  aria-pressed={shuffle}
                  style={{
                    background: "transparent",

                    border: "none",

                    color: shuffle ? "#B6FF00" : "#777",

                    fontSize: 22,

                    cursor: "pointer",

                    padding: 10,
                  }}
                >
                  ⇄
                </button>

                <button
                  onClick={previousTrack}
                  aria-label="Previous track"
                  style={{
                    border: 0,
                    background: "transparent",
                    color: "#fff",
                    fontSize: 32,
                    cursor: "pointer",
                    width: 48,
                    height: 48,
                  }}
                >
                  ⏮
                </button>

                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    border: 0,
                    background: "#B6FF00",
                    color: "#050505",
                    fontSize: 30,
                    cursor: "pointer",
                    boxShadow: "0 0 35px rgba(182,255,0,0.2)",
                  }}
                >
                  {isPlaying ? "Ⅱ" : "▶"}
                </button>

                <button
                  onClick={nextTrack}
                  aria-label="Next track"
                  style={{
                    border: 0,
                    background: "transparent",
                    color: "#fff",
                    fontSize: 32,
                    cursor: "pointer",
                    width: 48,
                    height: 48,
                  }}
                >
                  ⏭
                </button>

                <button
                  type="button"
                  onClick={cycleRepeatMode}
                  aria-label={`Repeat mode: ${repeatMode}`}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: repeatMode !== "off" ? "#B6FF00" : "#777",
                    fontSize: 22,
                    cursor: "pointer",
                    padding: 10,
                    position: "relative",
                  }}
                >
                  ↻
                  {repeatMode === "one" && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: -4,
                        fontSize: 10,
                        fontWeight: 800,
                      }}
                    >
                      1
                    </span>
                  )}
                </button>
              </div>

              <div
                style={{
                  marginTop: 40,
                  textAlign: "center",
                  fontSize: 10,
                  color: "#777",
                  letterSpacing: 3,
                }}
              >
                CALI P · EXCLUSIVE DELUXE EXPERIENCE
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
