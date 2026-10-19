"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";

import type { Track } from "./TrackList";

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (time: number) => void;
  shuffle: boolean;
  repeatMode: "off" | "all" | "one";
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children, tracks }: { children: ReactNode; tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  const playTrack = useCallback(
    async (track: Track) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentTrack?.id !== track.id) {
        audio.src = `/api/audio/${track.id}`;
        audio.load();

        setCurrentTrack(track);
        setCurrentTime(0);
      }

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Playback failed:", error);
        setIsPlaying(false);
      }
    },
    [currentTrack],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!currentTrack || tracks.length === 0) return;

      // Repeat current song
      if (repeatMode === "one") {
        audio.currentTime = 0;
        void audio.play();
        return;
      }

      const index = tracks.findIndex((track) => track.id === currentTrack.id);

      // Shuffle
      if (shuffle && tracks.length > 1) {
        const otherTracks = tracks.filter((track) => track.id !== currentTrack.id);

        const randomTrack = otherTracks[Math.floor(Math.random() * otherTracks.length)];

        void playTrack(randomTrack);
        return;
      }

      // Normal playback
      const next = tracks[index + 1];

      if (next) {
        void playTrack(next);
      } else if (repeatMode === "all") {
        void playTrack(tracks[0]);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack, tracks, playTrack, shuffle, repeatMode]);

  const toggleShuffle = () => {
    setShuffle((prev) => !prev);
  };

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      if (currentTrack) {
        void playTrack(currentTrack);
      } else if (tracks.length) {
        void playTrack(tracks[0]);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;

    if (shuffle && tracks.length > 1) {
      const otherTracks = tracks.filter((track) => track.id !== currentTrack.id);

      const randomTrack = otherTracks[Math.floor(Math.random() * otherTracks.length)];

      void playTrack(randomTrack);
      return;
    }

    const index = tracks.findIndex((track) => track.id === currentTrack.id);

    const next = tracks[(index + 1) % tracks.length];

    if (next) void playTrack(next);
  };

  const previousTrack = () => {
    if (!currentTrack) return;

    const index = tracks.findIndex((track) => track.id === currentTrack.id);

    const previous = tracks[(index - 1 + tracks.length) % tracks.length];

    if (previous) void playTrack(previous);
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        playTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        seek,
        shuffle,
        repeatMode,
        toggleShuffle,
        cycleRepeatMode,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }

  return context;
}
