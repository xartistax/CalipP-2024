import { Flex, Box, Container, Stack, HStack, Heading, Button, Text } from "@chakra-ui/react";
import { FaSpotify, FaShoppingBag, FaYoutube, FaTiktok, FaEnvelope, FaArrowDown } from "react-icons/fa";

import { SPOTIFY_URL, SHOP_URL, YOUTUBE_URL, TIKTOK_URL } from "./CaliPWebsite";
import Image from "next/image";
import { SocialButton } from "./intro/intro";

export function Hero({
  videoRef,
  videoSrc,
  posterSrc,
  isReady,

  onNavigate,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoSrc?: string;
  posterSrc?: string;
  isReady: boolean;

  onNavigate: (id: string) => void;
}) {
  return (
    <Flex id="home" position="relative" minH={{ base: "100svh", md: "100vh" }} align="center" overflow="hidden" bg="black">
      {/* Video */}
      <Box
        position="absolute"
        inset={0}
        sx={{
          video: {
            objectPosition: {
              base: "58% center",
              md: "center center",
            },
          },
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          poster={posterSrc}
          key={`${videoSrc}-${posterSrc}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isReady ? 1 : 0,
            transition: "opacity 1s ease",
            transform: "scale(1.05)",
            animation: "heroZoom 18s ease-in-out infinite alternate",
            willChange: "transform",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </Box>

      {/* Grundabdunklung */}
      <Box position="absolute" inset={0} bg="rgba(0, 0, 0, 0.32)" />

      {/* Kontrast hinter dem Hero-Inhalt */}
      <Box
        position="absolute"
        inset={0}
        bgGradient={{
          base: "linear(to-b, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.72) 72%, #080a08 100%)",
          md: "linear(to-r, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.28) 70%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      {/* Übergang zur nächsten Section */}
      <Box position="absolute" inset={0} bgGradient="linear(to-t, #080a08 0%, rgba(8,10,8,0.45) 18%, transparent 42%)" />

      {/* Vignette */}
      <Box position="absolute" inset={0} bg="radial-gradient(circle at center, transparent 38%, rgba(0,0,0,0.5) 100%)" />

      <Container position="relative" zIndex={2} maxW="7xl" px={{ base: 5, md: 8 }} pt={{ base: 24, sm: 28, md: 32 }} pb={{ base: 20, md: 20 }}>
        <Stack
          maxW={{ base: "560px", md: "760px" }}
          spacing={{ base: 5, sm: 6, md: 9 }}
          align={{ base: "center", md: "flex-start" }}
          textAlign={{ base: "center", md: "left" }}
          opacity={isReady ? 1 : 0}
          transform={isReady ? "translateY(0)" : "translateY(30px)"}
          transition="opacity 1.2s ease, transform 1.2s ease"
        >
          <HStack
            spacing={{ base: 2, md: 3 }}
            color="#d9ff43"
            fontSize={{ base: "10px", sm: "xs" }}
            fontWeight={700}
            letterSpacing={{ base: "0.14em", md: "0.22em" }}
            textTransform="uppercase"
          >
            <Box w={{ base: "20px", md: "34px" }} h="1px" bg="#d9ff43" />

            <Text>Reggae · Culture · Consciousness</Text>
          </HStack>

          <Box
            position="relative"
            w={{
              base: "210px",
              sm: "280px",
              md: "470px",
            }}
            h={{
              base: "80px",
              sm: "105px",
              md: "170px",
            }}
          >
            <Image
              src="/logo.png"
              alt="Cali P"
              fill
              priority
              sizes="(max-width: 480px) 210px, (max-width: 768px) 280px, 470px"
              style={{
                objectFit: "contain",
                objectPosition: "left center",
                filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.7))",
              }}
            />
          </Box>

          <Heading
            as="h1"
            maxW="700px"
            fontSize={{
              base: "2.4rem",
              sm: "4xl",
              md: "6xl",
              lg: "7xl",
            }}
            lineHeight={{ base: 1.05, md: 0.98 }}
            fontWeight={500}
            letterSpacing="-0.045em"
            textShadow="0 4px 24px rgba(0,0,0,0.85)"
          >
            Music with a message.
            <Text as="span" color="#d9ff43">
              {" "}
              Energy with purpose.
            </Text>
          </Heading>

          <Text
            maxW={{ base: "340px", sm: "500px", md: "600px" }}
            color="whiteAlpha.900"
            fontSize={{ base: "sm", sm: "md", md: "lg" }}
            lineHeight={{ base: 1.65, md: 1.8 }}
            fontWeight={300}
            textShadow="0 3px 16px rgba(0,0,0,0.9)"
          >
            Bridging cultures, elevating consciousness and inspiring change through music.
          </Text>

          <Stack direction={{ base: "column", sm: "row" }} spacing={4} w={{ base: "full", sm: "auto" }} maxW={{ base: "360px", sm: "none" }}>
            <Button
              as="a"
              href={SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FaSpotify />}
              size="lg"
              w={{ base: "full", sm: "auto" }}
              h={{ base: "54px", md: "58px" }}
              borderRadius="full"
              bg="#d9ff43"
              color="#080a08"
              px={8}
              fontSize="sm"
              fontWeight={800}
              letterSpacing="0.08em"
              textTransform="uppercase"
              transition="all 0.25s ease"
              _hover={{
                bg: "#ecff9b",
                transform: "translateY(-3px)",
              }}
            >
              Listen on Spotify
            </Button>

            <Button
              as="a"
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FaShoppingBag />}
              size="lg"
              w={{ base: "full", sm: "auto" }}
              h={{ base: "54px", md: "58px" }}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.400"
              bg="blackAlpha.300"
              color="white"
              px={8}
              fontSize="sm"
              fontWeight={700}
              letterSpacing="0.08em"
              textTransform="uppercase"
              backdropFilter="blur(12px)"
              transition="all 0.25s ease"
              _hover={{
                bg: "white",
                color: "#080a08",
                borderColor: "white",
                transform: "translateY(-3px)",
              }}
            >
              Visit store
            </Button>
          </Stack>

          <HStack spacing={{ base: 3, md: 4 }} pt={2}>
            <SocialButton label="Spotify" href={SPOTIFY_URL}>
              <FaSpotify />
            </SocialButton>

            <SocialButton label="YouTube" href={YOUTUBE_URL}>
              <FaYoutube />
            </SocialButton>

            <SocialButton label="TikTok" href={TIKTOK_URL}>
              <FaTiktok />
            </SocialButton>

            <SocialButton label="Email" href="mailto:info@calipmusic.com">
              <FaEnvelope />
            </SocialButton>
          </HStack>
        </Stack>
      </Container>

      <Button
        display={{ base: "none", md: "flex" }}
        position="absolute"
        bottom={8}
        left="50%"
        zIndex={3}
        transform="translateX(-50%)"
        variant="ghost"
        color="whiteAlpha.600"
        leftIcon={<FaArrowDown />}
        fontSize="xs"
        letterSpacing="0.18em"
        textTransform="uppercase"
        onClick={() => onNavigate("music")}
        _hover={{
          bg: "transparent",
          color: "#d9ff43",
        }}
      >
        Explore
      </Button>
    </Flex>
  );
}
