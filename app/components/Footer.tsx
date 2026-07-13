import { Box, Button, Container, HStack, Stack, Text, Heading, Flex, Skeleton } from "@chakra-ui/react";
import Image from "next/image";
import { FaSpotify, FaShoppingBag, FaYoutube, FaTiktok, FaPlay } from "react-icons/fa";
import { SHOP_URL, SPOTIFY_URL, TIKTOK_URL, YOUTUBE_URL } from "./CaliPWebsite";
import { SocialButton } from "./intro/intro";
import { useState, useEffect } from "react";
import { SpotifyRelease, SpotifyResponse } from "../../types";
import { trackEvent } from "../../lib/analytics";

export function Footer() {
  const [latestRelease, setLatestRelease] = useState<SpotifyRelease | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLatestRelease() {
      try {
        const response = await fetch("/api/spotify");

        if (!response.ok) {
          throw new Error("Spotify release could not be loaded.");
        }

        const data = (await response.json()) as SpotifyResponse;

        const releases = [...data.items].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());

        setLatestRelease(releases[0] ?? null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLatestRelease();
  }, []);
  return (
    <Box position="relative" overflow="hidden" bg="#050505" pt={{ base: 20, md: 28 }} pb={10} borderTop="1px solid" borderColor="whiteAlpha.100">
      {/* Glow */}
      <Box
        position="absolute"
        top="-220px"
        left="50%"
        transform="translateX(-50%)"
        w="700px"
        h="700px"
        borderRadius="full"
        bg="rgba(217,255,67,.08)"
        filter="blur(130px)"
      />

      {/* Big Text */}
      <Text
        position="absolute"
        top="30px"
        left="50%"
        transform="translateX(-50%)"
        fontSize={{
          base: "90px",
          md: "220px",
        }}
        fontWeight={900}
        letterSpacing="-0.08em"
        color="whiteAlpha.50"
        userSelect="none"
        pointerEvents="none"
        whiteSpace="nowrap"
      >
        CALI P
      </Text>

      <Container maxW="7xl" position="relative" zIndex={2}>
        <Stack spacing={8} align="center" textAlign="center">
          <Box
            position="relative"
            w={{
              base: "180px",
              md: "260px",
            }}
            h={{
              base: "70px",
              md: "100px",
            }}
          >
            <Image
              src="/logo.png"
              alt="Cali P"
              fill
              sizes="260px"
              style={{
                objectFit: "contain",
              }}
            />
          </Box>

          <Heading
            maxW="750px"
            fontWeight={500}
            lineHeight={1.1}
            fontSize={{
              base: "2xl",
              md: "4xl",
            }}
          >
            One Love.
            <Text as="span" color="#d9ff43">
              {" "}
              One Message.
            </Text>
          </Heading>

          <Text
            maxW="650px"
            color="whiteAlpha.600"
            fontSize={{
              base: "md",
              md: "lg",
            }}
            lineHeight={1.8}
          >
            Reggae music connecting people across cultures through positive vibrations, consciousness and unity.
          </Text>

          <HStack spacing={4} flexWrap="wrap" justify="center">
            <Button
              as="a"
              href={SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("spotify_click", {
                  location: "footer_primary",
                  destination_url: SPOTIFY_URL,
                })
              }
              leftIcon={<FaSpotify />}
              bg="#1ED760"
              color="black"
              borderRadius="full"
              size="lg"
              px={8}
              _hover={{
                transform: "translateY(-3px)",
              }}
            >
              Spotify
            </Button>

            <Button
              as="a"
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("store_click", {
                  location: "footer_primary",
                  destination_url: SHOP_URL,
                })
              }
              leftIcon={<FaShoppingBag />}
              variant="outline"
              borderRadius="full"
              borderColor="whiteAlpha.300"
              color="white"
              size="lg"
              px={8}
              _hover={{
                bg: "white",
                color: "black",
              }}
            >
              Official Store
            </Button>
          </HStack>

          <HStack spacing={5}>
            <SocialButton
              label="Spotify"
              href={SPOTIFY_URL}
              onClick={() =>
                trackEvent("social_click", {
                  platform: "spotify",
                  location: "footer_socials",
                  destination_url: SPOTIFY_URL,
                })
              }
            >
              <FaSpotify />
            </SocialButton>

            <SocialButton
              label="YouTube"
              href={YOUTUBE_URL}
              onClick={() =>
                trackEvent("social_click", {
                  platform: "youtube",
                  location: "footer_socials",
                  destination_url: YOUTUBE_URL,
                })
              }
            >
              <FaYoutube />
            </SocialButton>

            <SocialButton
              label="TikTok"
              href={TIKTOK_URL}
              onClick={() =>
                trackEvent("social_click", {
                  platform: "tiktok",
                  location: "footer_socials",
                  destination_url: TIKTOK_URL,
                })
              }
            >
              <FaTiktok />
            </SocialButton>
          </HStack>

          <Box
            w="full"
            maxW="720px"
            p={{ base: 4, md: 5 }}
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="24px"
            bg="whiteAlpha.50"
            backdropFilter="blur(14px)"
          >
            {isLoading ? (
              <Skeleton h="90px" borderRadius="18px" />
            ) : latestRelease ? (
              <Flex direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }} gap={5}>
                <Box position="relative" flexShrink={0} w={{ base: "full", sm: "90px" }} aspectRatio={1} overflow="hidden" borderRadius="16px">
                  <Image
                    src={latestRelease.images[0]?.url}
                    alt={`${latestRelease.name} cover`}
                    fill
                    sizes="90px"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Stack flex={1} spacing={1} textAlign={{ base: "center", sm: "left" }}>
                  <Text color="#d9ff43" fontSize="xs" fontWeight={800} letterSpacing="0.16em" textTransform="uppercase">
                    Latest release
                  </Text>

                  <Heading as={"h2"} fontSize={{ base: "xl", md: "2xl" }} fontWeight={600}>
                    {latestRelease.name}
                  </Heading>

                  <Text color="whiteAlpha.500" fontSize="sm">
                    {latestRelease.release_date}
                  </Text>
                </Stack>

                <Button
                  as="a"
                  href={latestRelease.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("release_play_click", {
                      location: "footer_latest_release",
                      release_name: latestRelease.name,
                      release_date: latestRelease.release_date,
                      release_type: latestRelease.album_type,
                      destination_url: latestRelease.external_urls.spotify,
                    })
                  }
                  leftIcon={<FaPlay />}
                  flexShrink={0}
                  borderRadius="full"
                  bg="#1ed760"
                  color="black"
                  _hover={{
                    bg: "#54e582",

                    transform: "translateY(-2px)",
                  }}
                >
                  Play
                </Button>
              </Flex>
            ) : (
              <Text color="whiteAlpha.500">Latest release unavailable.</Text>
            )}
          </Box>

          <Box w="100%" h="1px" bg="whiteAlpha.200" mt={4} />

          <Text color="whiteAlpha.400" fontSize="sm">
            © {new Date().getFullYear()} Cali P · All Rights Reserved
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
