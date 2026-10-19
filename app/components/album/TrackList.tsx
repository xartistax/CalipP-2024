"use client";

import { motion } from "framer-motion";

import { useAudio } from "./AudioProvider";

export interface Track {
  id: string;
  title: string;
  track_number: number;
  duration?: number | null;
}

interface TrackListProps {
  tracks: Track[];
  onTrackSelect?: (track: Track) => void;
}

export default function TrackList({ tracks, onTrackSelect }: TrackListProps) {
  const { currentTrack, isPlaying, playTrack } = useAudio();

  const handleSelect = (track: Track) => {
    playTrack(track);
    onTrackSelect?.(track);
  };

  return (
    <section
      id="tracklist"
      style={{
        width: "100%",
        maxWidth: "760px",
        margin: "0 auto",
        padding: "80px 20px 120px",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ marginBottom: "40px" }}
      >
        <span
          style={{
            color: "#F5B52E",
            fontSize: "11px",
            letterSpacing: "4px",
          }}
        >
          THE SOUNDTRACK
        </span>

        <h2
          style={{
            fontSize: "clamp(30px, 7vw, 48px)",
            fontWeight: 800,
            margin: "12px 0",
            letterSpacing: "-1px",
          }}
        >
          TRACKLIST
          <span style={{ color: "#B6FF00" }}>.</span>
        </h2>

        <p style={{ color: "#888", fontSize: "14px" }}>{tracks.length} TRACKS · DELUXE EDITION</p>
      </motion.div>

      {/* Tracks */}
      <div>
        {tracks.map((track, index) => {
          const active = currentTrack?.id === track.id;

          return (
            <motion.button
              key={track.id}
              type="button"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.04, 0.3),
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(track)}
              aria-pressed={active}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                width: "100%",
                minHeight: "68px",
                padding: "12px 16px",
                marginBottom: "6px",
                borderRadius: "12px",
                border: active ? "1px solid rgba(182,255,0,0.3)" : "1px solid transparent",
                background: active ? "rgba(182,255,0,0.07)" : "rgba(255,255,255,0.025)",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {/* Track number / Equalizer */}
              <div
                style={{
                  width: "28px",
                  flexShrink: 0,
                  color: active ? "#B6FF00" : "#F5B52E",
                  fontSize: "13px",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {active && isPlaying ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "3px",
                      height: "20px",
                    }}
                  >
                    {[1, 2, 3].map((bar) => (
                      <motion.span
                        key={bar}
                        animate={{
                          height: [5, 17, 8, 14, 5],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: bar * 0.12,
                        }}
                        style={{
                          width: "3px",
                          background: "#B6FF00",
                          borderRadius: "2px",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  String(track.track_number).padStart(2, "0")
                )}
              </div>

              {/* Track title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: active ? 700 : 500,
                    color: active ? "#B6FF00" : "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {track.title}
                </div>

                <div
                  style={{
                    color: "#777",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  Cali P
                </div>
              </div>

              {/* Duration */}
              <span
                style={{
                  color: "#888",
                  fontSize: "12px",
                  flexShrink: 0,
                }}
              >
                {formatDuration(track.duration) ?? "—:—"}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom detail */}
      <div
        style={{
          marginTop: "45px",
          textAlign: "center",
          color: "#555",
          fontSize: "11px",
          letterSpacing: "2px",
        }}
      >
        CALI P · ITHOUGHTS DELUXE EXPERIENCE
      </div>
    </section>
  );
}
function formatDuration(seconds?: number | null): string {
  if (seconds == null || !Number.isFinite(seconds)) {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}
