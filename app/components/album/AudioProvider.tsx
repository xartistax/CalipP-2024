"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";

import type { Track } from "./TrackList";
import { trackEvent } from "../../../lib/analytics";

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

const analyticsParams = {
  album: "i-thoughts-10years",
  campaign: "nfc_promo_2026",
};

export function AudioProvider({ children, tracks }: { children: ReactNode; tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<Track | null>(null);
  const lastCompletedRef = useRef(false);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);

      const track = currentTrackRef.current;

      if (!track) return;

      trackEvent("track_play", {
        ...analyticsParams,
        track_id: track.id,
        track_title: track.title,
        track_number: track.track_number,
      });
    };

    const handlePause = () => {
      setIsPlaying(false);

      const track = currentTrackRef.current;

      if (!track || audio.ended) return;

      trackEvent("track_pause", {
        ...analyticsParams,
        track_id: track.id,
        track_title: track.title,
        track_number: track.track_number,
        position_seconds: Math.floor(audio.currentTime),
      });
    };

    const handleEnded = () => {
      const track = currentTrackRef.current;

      if (!track || lastCompletedRef.current) return;

      lastCompletedRef.current = true;

      trackEvent("track_complete", {
        ...analyticsParams,
        track_id: track.id,
        track_title: track.title,
        track_number: track.track_number,
        duration_seconds: Math.floor(audio.duration || 0),
      });
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);

      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      audioRef.current = null;
    };
  }, []);

  const playTrack = useCallback(async (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    const isNewTrack = currentTrackRef.current?.id !== track.id;

    if (isNewTrack) {
      const previousTrack = currentTrackRef.current;

      if (previousTrack) {
        trackEvent("track_skip", {
          ...analyticsParams,
          from_track: previousTrack.title,
          to_track: track.title,
        });
      }

      currentTrackRef.current = track;
      lastCompletedRef.current = false;

      audio.src = `/api/audio/${track.id}`;
      audio.load();

      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(0);
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback failed:", error);
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!currentTrack || tracks.length === 0) return;

      // Repeat current song
      if (repeatMode === "one") {
        lastCompletedRef.current = false;
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
