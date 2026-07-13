"use client";

import { Box, Button, Flex, HStack, IconButton, Stack, Text, VStack, VisuallyHidden, chakra, useBreakpointValue } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { FaEnvelope, FaShoppingBag, FaSpotify, FaTiktok, FaVolumeMute, FaVolumeUp, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import { trackEvent } from "../../../lib/analytics";

const SHOP_URL = "https://senmbelek-store.myshopify.com/";

export const SocialButton = ({ children, label, href, onClick }: { children: ReactNode; label: string; href: string; onClick?: () => void }) => (
  <chakra.a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    onClick={onClick}
    aria-label={label}
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    w="42px"
    h="42px"
    borderRadius="full"
    border="1px solid"
    borderColor="whiteAlpha.300"
    bg="blackAlpha.400"
    color="white"
    backdropFilter="blur(10px)"
    transition="all 0.25s ease"
    _hover={{
      bg: "white",
      color: "black",
      transform: "translateY(-3px)",
      borderColor: "white",
    }}
  >
    <VisuallyHidden>{label}</VisuallyHidden>
    {children}
  </chakra.a>
);

export default function Intro() {
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoSrc = useBreakpointValue({
    base: "/video/jah_blessing_mobile.mp4",
    md: "/video/jah_blessing_croped_small.mp4",
  });

  const posterSrc = useBreakpointValue({
    base: "/video/poster_mobile.jpg",
    md: "/video/poster_screen.jpg",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, 400);

    return () => window.clearTimeout(timer);
  }, []);

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <Flex position="relative" w="full" minH="100svh" overflow="hidden" bg="black">
      {/* Background video */}
      <Box position="absolute" inset={0}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={posterSrc}
          key={`${videoSrc}-${posterSrc}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isReady ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>

      {/* Overlays */}
      <Box position="absolute" inset={0} bgGradient="linear(to-b, blackAlpha.700 0%, blackAlpha.300 45%, blackAlpha.800 100%)" />

      <Box position="absolute" inset={0} bgGradient="linear(to-r, blackAlpha.600, transparent 65%)" />

      {/* Navigation */}
      <Flex
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={2}
        align="center"
        justify="flex-end"
        gap={{ base: 2, md: 4 }}
        px={{ base: 4, md: 8 }}
        py={{ base: 4, md: 6 }}
      >
        <Button
          variant="ghost"
          color="white"
          fontSize="sm"
          fontWeight={500}
          textTransform="uppercase"
          letterSpacing="0.12em"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={scrollToBooking}
        >
          Booking
        </Button>

        <Button
          as="a"
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("store_click", {
              location: "intro",
              destination_url: SHOP_URL,
            })
          }
          leftIcon={<FaShoppingBag />}
          borderRadius="full"
          bg="white"
          color="black"
          px={{ base: 5, md: 7 }}
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="0.1em"
          transition="all 0.25s ease"
          _hover={{
            bg: "whiteAlpha.900",
            transform: "translateY(-2px)",
          }}
        >
          Shop
        </Button>
      </Flex>

      {/* Hero content */}
      <VStack position="relative" zIndex={1} w="full" minH="100svh" justify="center" spacing={{ base: 6, md: 8 }} px={6} pt={24} pb={16} textAlign="center">
        <Stack
          maxW="800px"
          align="center"
          spacing={{ base: 5, md: 7 }}
          opacity={isReady ? 1 : 0}
          transform={isReady ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 1.2s ease, transform 1.2s ease"
        >
          <Box w={{ base: "230px", md: "340px" }} filter="drop-shadow(0 10px 25px rgba(0,0,0,0.4))">
            <Image
              src="/logo.png"
              width={500}
              height={170}
              alt="Cali P"
              priority
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </Box>

          <Text maxW="650px" color="whiteAlpha.900" fontSize={{ base: "md", md: "lg" }} fontWeight={300} lineHeight={1.7} letterSpacing="0.02em">
            Bridging cultures, elevating consciousness and inspiring change through music.
          </Text>

          <HStack spacing={{ base: 3, md: 4 }} flexWrap="wrap" justify="center">
            <Button
              as="a"
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("store_click", {
                  location: "intro",
                  destination_url: SHOP_URL,
                })
              }
              leftIcon={<FaShoppingBag />}
              size="lg"
              borderRadius="full"
              bg="white"
              color="black"
              px={8}
              textTransform="uppercase"
              letterSpacing="0.1em"
              fontSize="sm"
              _hover={{
                bg: "whiteAlpha.900",
                transform: "translateY(-2px)",
              }}
            >
              Visit the shop
            </Button>

            <Button
              size="lg"
              borderRadius="full"
              variant="outline"
              borderColor="whiteAlpha.600"
              color="white"
              px={8}
              textTransform="uppercase"
              letterSpacing="0.1em"
              fontSize="sm"
              backdropFilter="blur(10px)"
              _hover={{
                bg: "white",
                color: "black",
                borderColor: "white",
              }}
              onClick={scrollToBooking}
            >
              Booking
            </Button>
          </HStack>

          <HStack spacing={4} pt={3}>
            <SocialButton label="Email" href="mailto:info@calipmusic.com">
              <FaEnvelope />
            </SocialButton>

            <SocialButton label="Spotify" href="https://open.spotify.com/intl-de/artist/3ecsQBXTAjmQyO3Nqq0KZV">
              <FaSpotify />
            </SocialButton>

            <SocialButton label="YouTube" href="https://www.youtube.com/calipmusic?sub_confirmation=1">
              <FaYoutube />
            </SocialButton>

            <SocialButton label="TikTok" href="https://www.tiktok.com/@itscalip">
              <FaTiktok />
            </SocialButton>
          </HStack>
        </Stack>
      </VStack>

      {/* Sound button */}
      <IconButton
        aria-label={isMuted ? "Enable sound" : "Mute sound"}
        icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        position="absolute"
        right={{ base: 4, md: 8 }}
        bottom={{ base: 4, md: 8 }}
        zIndex={2}
        borderRadius="full"
        border="1px solid"
        borderColor="whiteAlpha.300"
        bg="blackAlpha.500"
        color="white"
        backdropFilter="blur(10px)"
        _hover={{ bg: "white", color: "black" }}
        onClick={toggleMute}
      />
    </Flex>
  );
}
