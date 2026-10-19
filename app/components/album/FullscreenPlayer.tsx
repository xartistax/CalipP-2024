"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { IoChevronDown, IoPlaySkipBack, IoPlaySkipForward, IoPlay, IoPause, IoShuffle, IoRepeat, IoArrowForwardOutline } from "react-icons/io5";

import { useAudio } from "./AudioProvider";
import PlayerBackground from "./PlayerBackground";
import Link from "next/link";

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

const COLORS = {
  background: "#050505",
  white: "#FFFFFF",
  gold: "#F5B52E",
  green: "#B6FF00",
  muted: "#777777",
  secondary: "#999999",
};

const controlButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  minWidth: 0,
  padding: 0,
  border: "none",
  borderRadius: "50%",
  background: "transparent",
  color: COLORS.white,
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  touchAction: "manipulation",
  flexShrink: 0,
};

export default function FullscreenPlayer({ isOpen, onClose }: FullscreenPlayerProps) {
  const { currentTrack, isPlaying, togglePlay, nextTrack, previousTrack, currentTime, duration, seek, shuffle, repeatMode, toggleShuffle, cycleRepeatMode } =
    useAudio();

  // Prevent background scrolling while the player is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Close player with Escape.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
          dragDirectionLock
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120) {
              onClose();
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            width: "100%",
            height: "100dvh",
            overflowX: "hidden",
            overflowY: "auto",
            overscrollBehavior: "contain",
            background: COLORS.background,
            color: COLORS.white,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Animated background */}
          <PlayerBackground isPlaying={isPlaying} />

          {/* Player layout */}
          <div className="fullscreen-player-layout">
            {/* Header */}
            <header className="fullscreen-player-header">
              <button type="button" onClick={onClose} aria-label="Close player" style={controlButtonStyle}>
                <IoChevronDown size={28} />
              </button>

              <div className="fullscreen-player-heading">
                <span className="fullscreen-player-label">NOW PLAYING</span>

                <span className="fullscreen-player-album">iTHOUGHTS DELUXE</span>
              </div>

              <div style={{ width: 44, flexShrink: 0 }} />
            </header>

            {/* Album artwork */}
            <div className="fullscreen-player-artwork-area">
              <motion.div
                key={currentTrack.id}
                className="fullscreen-player-artwork"
                initial={{ opacity: 0.7, scale: 0.96 }}
                animate={{
                  opacity: 1,
                  scale: isPlaying ? [1, 1.015, 1] : 1,
                }}
                transition={{
                  duration: 5,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "easeInOut",
                }}
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
              >
                <Image
                  src="/albums/i-thoughts-10years/front.jpg"
                  alt="Cali P – iThoughts Deluxe"
                  fill
                  priority
                  sizes="(max-width: 520px) 90vw, 390px"
                  style={{
                    objectFit: "cover",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
                />
              </motion.div>
            </div>

            {/* Track information and controls */}
            <div className="fullscreen-player-bottom">
              {/* Track information */}
              <div className="fullscreen-player-track-info">
                <h2 className="fullscreen-player-track-title">{currentTrack.title}</h2>

                <p className="fullscreen-player-artist">Cali P</p>
              </div>

              {/* Progress bar */}
              <div className="fullscreen-player-progress">
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  value={Math.min(currentTime, duration || 1)}
                  step={0.1}
                  onChange={(event) => {
                    seek(Number(event.target.value));
                  }}
                  aria-label="Seek"
                  style={{
                    width: "100%",
                    margin: 0,
                    accentColor: COLORS.green,
                    cursor: "pointer",
                    touchAction: "pan-x",
                  }}
                />

                <div className="fullscreen-player-time">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback controls */}
              <div className="fullscreen-player-controls">
                {/* Shuffle */}
                <button
                  type="button"
                  onClick={toggleShuffle}
                  aria-label={shuffle ? "Disable shuffle" : "Enable shuffle"}
                  aria-pressed={shuffle}
                  style={{
                    ...controlButtonStyle,
                    color: shuffle ? COLORS.green : COLORS.muted,
                  }}
                >
                  <IoShuffle size={23} />
                </button>

                {/* Previous */}
                <button type="button" onClick={previousTrack} aria-label="Previous track" style={controlButtonStyle}>
                  <IoPlaySkipBack size={28} />
                </button>

                {/* Play / Pause */}
                <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="fullscreen-player-play-button">
                  {isPlaying ? <IoPause size={34} /> : <IoPlay size={34} />}
                </button>

                {/* Next */}
                <button type="button" onClick={nextTrack} aria-label="Next track" style={controlButtonStyle}>
                  <IoPlaySkipForward size={28} />
                </button>

                {/* Repeat */}
                <button
                  type="button"
                  onClick={cycleRepeatMode}
                  aria-label={`Repeat mode: ${repeatMode}`}
                  style={{
                    ...controlButtonStyle,
                    color: repeatMode !== "off" ? COLORS.green : COLORS.muted,
                    position: "relative",
                  }}
                >
                  <IoRepeat size={23} />

                  {repeatMode === "one" && <span className="fullscreen-player-repeat-one">1</span>}
                </button>
              </div>

              {/* Footer */}

              <footer className="fullscreen-player-footer">
                <span>CALI P · EXCLUSIVE DELUXE EXPERIENCE</span>

                <Link href="/" className="fullscreen-player-website" aria-label="Visit Cali P official website">
                  calipmusic.com
                  <IoArrowForwardOutline size={13} />
                </Link>
              </footer>
            </div>
          </div>

          <style jsx>{`
            .fullscreen-player-footer {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 12px;
              margin-top: 28px;
              text-align: center;
              font-size: 10px;
              color: #777;
              letter-spacing: 2px;
            }

            .fullscreen-player-website {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              color: #999;
              font-size: 12px;
              font-weight: 500;
              letter-spacing: 0.3px;
              text-decoration: none;
              transition: color 0.2s ease;
            }

            .fullscreen-player-website:hover {
              color: #f5b52e;
            }

            .fullscreen-player-layout {
              position: relative;
              z-index: 1;
              display: flex;
              flex-direction: column;
              width: 100%;
              max-width: 520px;
              min-height: 100dvh;
              margin: 0 auto;
              padding: max(16px, env(safe-area-inset-top)) 24px max(20px, env(safe-area-inset-bottom));
              gap: 20px;
              box-sizing: border-box;
            }

            .fullscreen-player-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              flex-shrink: 0;
            }

            .fullscreen-player-heading {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 5px;
              text-align: center;
            }

            .fullscreen-player-label {
              color: ${COLORS.gold};
              font-size: 10px;
              font-weight: 500;
              letter-spacing: 3px;
            }

            .fullscreen-player-album {
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.3px;
            }

            .fullscreen-player-artwork-area {
              display: flex;
              align-items: center;
              justify-content: center;
              flex: 1 1 auto;
              min-height: 0;
              width: 100%;
              padding: 8px 0;
            }

            .fullscreen-player-artwork {
              position: relative;
              width: 100%;
              max-width: 390px;
              aspect-ratio: 1 / 1;
              flex-shrink: 0;
              overflow: hidden;
              border-radius: 14px;
              box-shadow: 0 20px 70px rgba(245, 181, 46, 0.15);
              touch-action: pan-y;
            }

            .fullscreen-player-bottom {
              display: flex;
              flex-direction: column;
              width: 100%;
              flex-shrink: 0;
            }

            .fullscreen-player-track-info {
              margin-bottom: 24px;
            }

            .fullscreen-player-track-title {
              margin: 0;
              font-size: clamp(24px, 6vw, 32px);
              font-weight: 800;
              line-height: 1.2;
              overflow-wrap: anywhere;
            }

            .fullscreen-player-artist {
              margin: 10px 0 0;
              color: ${COLORS.gold};
              font-size: 15px;
            }

            .fullscreen-player-progress {
              width: 100%;
            }

            .fullscreen-player-time {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
              color: ${COLORS.secondary};
              font-size: 12px;
            }

            .fullscreen-player-controls {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              gap: 8px;
              margin-top: 24px;
            }

            .fullscreen-player-play-button {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 72px;
              height: 72px;
              flex-shrink: 0;
              padding: 0;
              border: none;
              border-radius: 50%;
              background: ${COLORS.green};
              color: ${COLORS.background};
              cursor: pointer;
              box-shadow: 0 0 35px rgba(182, 255, 0, 0.2);
              -webkit-tap-highlight-color: transparent;
              touch-action: manipulation;
            }

            .fullscreen-player-repeat-one {
              position: absolute;
              right: 0;
              bottom: 0;
              font-size: 10px;
              font-weight: 800;
              color: ${COLORS.green};
            }

            .fullscreen-player-footer {
              margin-top: 28px;
              text-align: center;
              font-size: 10px;
              color: ${COLORS.muted};
              letter-spacing: 2px;
            }

            /* Smartphones */
            @media (max-width: 520px) {
              .fullscreen-player-layout {
                padding-left: 20px;
                padding-right: 20px;
                gap: 16px;
              }

              .fullscreen-player-artwork {
                width: min(100%, 42dvh);
              }

              .fullscreen-player-track-info {
                margin-bottom: 20px;
              }

              .fullscreen-player-controls {
                margin-top: 20px;
              }

              .fullscreen-player-footer {
                margin-top: 24px;
                font-size: 9px;
                letter-spacing: 1.5px;
              }
            }

            /* Smaller phones / landscape */
            @media (max-height: 740px) {
              .fullscreen-player-layout {
                gap: 12px;
              }

              .fullscreen-player-artwork {
                width: min(100%, 35dvh);
              }

              .fullscreen-player-track-info {
                margin-bottom: 14px;
              }

              .fullscreen-player-controls {
                margin-top: 14px;
              }

              .fullscreen-player-play-button {
                width: 64px;
                height: 64px;
              }

              .fullscreen-player-footer {
                margin-top: 16px;
              }
            }

            @media (max-width: 360px) {
              .fullscreen-player-layout {
                padding-left: 16px;
                padding-right: 16px;
              }

              .fullscreen-player-controls {
                gap: 4px;
              }

              .fullscreen-player-play-button {
                width: 62px;
                height: 62px;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .fullscreen-player-play-button {
                transition: none;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
