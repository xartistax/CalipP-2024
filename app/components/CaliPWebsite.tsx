"use client";

import { Box, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { ReactNode, useEffect, useRef, useState } from "react";

import { Hero } from "./Hero";
import { Navigation } from "./Navigation";
import { StatementSection } from "./StatementSection";

export const SHOP_URL = "https://senmbelek-store.myshopify.com/";

export const SPOTIFY_URL = "https://open.spotify.com/intl-de/artist/3ecsQBXTAjmQyO3Nqq0KZV";

export const YOUTUBE_URL = "https://www.youtube.com/calipmusic?sub_confirmation=1";

export const TIKTOK_URL = "https://www.tiktok.com/@itscalip";

const MusicSection = dynamic(() => import("./Spotify").then((module) => module.MusicSection), {
  loading: () => <SectionSkeleton height={{ base: "900px", md: "800px" }} />,
});

const TourDates = dynamic(() => import("./TourDates").then((module) => module.TourDates), {
  loading: () => <SectionSkeleton height={{ base: "700px", md: "500px" }} />,
});

const YoutubeSection = dynamic(() => import("./YoutubeSection").then((module) => module.YoutubeSection), {
  loading: () => <SectionSkeleton height={{ base: "900px", md: "700px" }} />,
});

const ShopSection = dynamic(() => import("./Shop").then((module) => module.ShopSection), {
  loading: () => <SectionSkeleton height={{ base: "600px", md: "450px" }} />,
});

const BookingSection = dynamic(() => import("./Booking").then((module) => module.BookingSection), {
  loading: () => <SectionSkeleton height={{ base: "850px", md: "600px" }} />,
});

const PressSection = dynamic(() => import("./PressSection").then((module) => module.PressSection), {
  loading: () => <SectionSkeleton height={{ base: "1000px", md: "850px" }} />,
});

const Footer = dynamic(() => import("./Footer").then((module) => module.Footer));

type ResponsiveHeight = {
  base: string;
  md: string;
};

function SectionSkeleton({ height }: { height: ResponsiveHeight }) {
  return (
    <Box px={{ base: 5, md: 8 }} py={{ base: 16, md: 24 }} bg="#0d100d">
      <Skeleton maxW="7xl" h={height} mx="auto" borderRadius="32px" startColor="whiteAlpha.100" endColor="whiteAlpha.200" />
    </Box>
  );
}

type LazySectionProps = {
  id: string;
  children: ReactNode;
  minHeight: ResponsiveHeight;
  rootMargin?: string;
};

function LazySection({ id, children, minHeight, rootMargin = "800px 0px" }: LazySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element || shouldRender) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setShouldRender(true);
        observer.disconnect();
      },
      {
        rootMargin,
        threshold: 0.01,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <Box
      ref={sectionRef}
      /*
       * Vor dem Laden dient der Wrapper als Anker.
       * Nach dem Laden besitzt die eigentliche Section ihre ID.
       * So entstehen keine doppelten IDs.
       */
      id={shouldRender ? undefined : id}
      minH={shouldRender ? undefined : minHeight}
      scrollMarginTop="90px"
    >
      {shouldRender ? children : null}
    </Box>
  );
}

export default function CaliPWebsite() {
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
    const timer = window.setTimeout(() => {}, 300);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

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
      <Box
        as="a"
        href="#main-content"
        position="fixed"
        top={2}
        left={2}
        zIndex={1000}
        px={4}
        py={3}
        borderRadius="md"
        bg="#d9ff43"
        color="#080a08"
        fontWeight={800}
        transform="translateY(-150%)"
        transition="transform 0.2s ease"
        _focus={{
          transform: "translateY(0)",
        }}
      >
        Skip to content
      </Box>

      <Navigation isScrolled={isScrolled} onNavigate={scrollToSection} />

      <Box as="main" id="main-content">
        <Hero videoRef={videoRef} videoSrc={videoSrc} posterSrc={posterSrc} onNavigate={scrollToSection} />

        <StatementSection />

        <LazySection id="music" minHeight={{ base: "900px", md: "800px" }}>
          <MusicSection />
        </LazySection>

        <LazySection id="tour" minHeight={{ base: "700px", md: "500px" }}>
          <TourDates />
        </LazySection>

        <LazySection id="videos" minHeight={{ base: "900px", md: "700px" }}>
          <YoutubeSection />
        </LazySection>

        <LazySection id="press" minHeight={{ base: "1000px", md: "850px" }}>
          <PressSection />
        </LazySection>

        <LazySection id="shop" minHeight={{ base: "600px", md: "450px" }}>
          <ShopSection />
        </LazySection>

        <LazySection id="booking" minHeight={{ base: "850px", md: "600px" }}>
          <BookingSection />
        </LazySection>
      </Box>

      <LazySection id="footer" minHeight={{ base: "600px", md: "500px" }}>
        <Footer />
      </LazySection>
    </Box>
  );
}
