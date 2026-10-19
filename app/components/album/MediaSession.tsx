"use client";

import { useEffect } from "react";
import { useAudio } from "./AudioProvider";

export default function MediaSession() {
  const { currentTrack, isPlaying, currentTime, duration, togglePlay, nextTrack, previousTrack, seek } = useAudio();

  // Songinformationen an das Betriebssystem übergeben
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: "Cali P",
      album: "iThoughts – 10 Years",
      artwork: [
        {
          src: "/albums/i-thoughts-10years/front.jpg",
          sizes: "512x512",
          type: "image/jpeg",
        },
      ],
    });

    return () => {
      navigator.mediaSession.metadata = null;
    };
  }, [currentTrack]);

  // Wiedergabestatus synchronisieren
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  // Hardware- und Sperrbildschirm-Steuerung
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const actions: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      [
        "play",
        () => {
          if (!isPlaying) togglePlay();
        },
      ],
      [
        "pause",
        () => {
          if (isPlaying) togglePlay();
        },
      ],
      ["previoustrack", previousTrack],
      ["nexttrack", nextTrack],
      [
        "seekto",
        (details) => {
          if (details.seekTime !== undefined) {
            seek(details.seekTime);
          }
        },
      ],
    ];

    for (const [action, handler] of actions) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Nicht jeder Browser unterstützt jede Aktion.
      }
    }

    return () => {
      for (const [action] of actions) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // Aktion wird nicht unterstützt.
        }
      }
    };
  }, [isPlaying, togglePlay, previousTrack, nextTrack, seek]);

  // Fortschritt an den Sperrbildschirm übergeben
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!currentTrack) return;

    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(currentTime)) {
      return;
    }

    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: 1,
        position: Math.min(Math.max(currentTime, 0), duration),
      });
    } catch {
      // PositionState wird nicht überall unterstützt.
    }
  }, [currentTrack, currentTime, duration]);

  return null;
}
