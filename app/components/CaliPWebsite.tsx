"use client";

import { Box, useBreakpointValue } from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";

import { StatementSection } from "./StatementSection";
import { Hero } from "./Hero";
import { MusicSection } from "./Spotify";
import { ShopSection } from "./Shop";
import { BookingSection } from "./Booking";
import { Footer } from "./Footer";
import { Navigation } from "./Navigation";
import { Marquee } from "./Marquee";
import { TourDates } from "./TourDates";
import { YoutubeSection } from "./YoutubeSection";

export const SHOP_URL = "https://senmbelek-store.myshopify.com/";
export const SPOTIFY_URL = "https://open.spotify.com/intl-de/artist/3ecsQBXTAjmQyO3Nqq0KZV";
export const YOUTUBE_URL = "https://www.youtube.com/calipmusic?sub_confirmation=1";
export const TIKTOK_URL = "https://www.tiktok.com/@itscalip";

export default function CaliPWebsite() {
  const [isReady, setIsReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc = useBreakpointValue({
    base: "/video/hero-video-web.mp4",
    md: "/video/hero-video-web.mp4",
  });

  const posterSrc = useBreakpointValue({
    base: "/caliCover.jpg",
    md: "/caliCover.jpg",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, 300);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box minH="100vh" overflowX="hidden" bg="#080a08" color="white">
      <Navigation isScrolled={isScrolled} onNavigate={scrollToSection} />

      <Hero videoRef={videoRef} videoSrc={videoSrc} posterSrc={posterSrc} isReady={isReady} onNavigate={scrollToSection} />

      <StatementSection />

      <MusicSection />
      <TourDates />
      <YoutubeSection />
      <ShopSection />

      <BookingSection />

      <Marquee />
      <Footer />
    </Box>
  );
}
