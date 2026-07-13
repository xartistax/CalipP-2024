"use client";
import { Box, Container, Stack, Grid, Heading, Button, Flex, SimpleGrid, HStack, Skeleton, SkeletonText, Text, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaSpotify, FaExternalLinkAlt, FaCompactDisc, FaPlay } from "react-icons/fa";

import { SpotifyRelease, SpotifyStats, SpotifyReleasesResponse } from "../../types";
import { SPOTIFY_URL } from "./CaliPWebsite";
import { SectionLabel } from "./StatementSection";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { AnimatedCounter } from "./AnimatedCounter";
import { trackEvent } from "../../lib/analytics";

export function MusicSection() {
  const artistEmbedUrl = "https://open.spotify.com/embed/artist/3ecsQBXTAjmQyO3Nqq0KZV?utm_source=generator&theme=0";
  const [isChanging, setIsChanging] = useState(false);
  const [releases, setReleases] = useState<SpotifyRelease[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<SpotifyRelease | null>(null);

  const [playerUrl, setPlayerUrl] = useState(artistEmbedUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const activeColor = selectedRelease?.dominant_color ?? "rgb(30, 215, 96)";

  const spotifyStats: SpotifyStats = {
    releases: releases.length,

    albums: releases.filter((release) => release.album_type === "album").length,

    singles: releases.filter((release) => release.album_type === "single").length,

    tracks: releases.reduce((total, release) => total + release.total_tracks, 0),

    latestRelease: releases[0]?.name ?? null,
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadReleases() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch("/api/spotify", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Spotify request failed: ${response.status}`);
        }

        const data = (await response.json()) as SpotifyReleasesResponse;

        const uniqueReleases = getUniqueSpotifyReleases(data.items);

        setReleases(uniqueReleases);

        if (uniqueReleases.length > 0) {
          selectSpotifyRelease(uniqueReleases[0]);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Spotify frontend error:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    function selectSpotifyRelease(release: SpotifyRelease) {
      setSelectedRelease(release);

      setPlayerUrl(`https://open.spotify.com/embed/album/${release.id}?utm_source=generator&theme=0`);
    }

    loadReleases();

    return () => controller.abort();
  }, []);

  const handleReleaseSelection = (release: SpotifyRelease) => {
    if (selectedRelease?.id === release.id) return;

    setIsChanging(true);

    setTimeout(() => {
      setSelectedRelease(release);

      setPlayerUrl(`https://open.spotify.com/embed/album/${release.id}?utm_source=generator&theme=0`);

      setIsChanging(false);
    }, 220);
  };

  return (
    <Box id="music" position="relative" py={{ base: 20, md: 28 }} bg="#0d100d" overflow="hidden" scrollMarginTop="90px">
      <Box
        position="absolute"
        inset={0}
        opacity={isChanging ? 0.2 : 0.34}
        transition="background 0.8s ease, opacity 0.3s ease"
        background={`
    radial-gradient(
      circle at 72% 45%,
      ${activeColor} 0%,
      transparent 48%
    )
  `}
        filter="blur(30px)"
        transform="scale(1.15)"
        pointerEvents="none"
      />

      <Container position="relative" maxW="7xl">
        <Stack spacing={{ base: 12, md: 16 }}>
          <Grid
            templateColumns={{
              base: "1fr",
              lg: "1fr 0.8fr",
            }}
            gap={{ base: 8, lg: 16 }}
            alignItems="end"
          >
            <Stack spacing={6}>
              <Reveal>
                <Stack spacing={6}>
                  <SectionLabel>Latest music</SectionLabel>

                  <Heading
                    maxW="760px"
                    fontSize={{
                      base: "4xl",
                      md: "6xl",
                      lg: "7xl",
                    }}
                    lineHeight={0.98}
                    fontWeight={500}
                    letterSpacing="-0.05em"
                  >
                    Choose a release.
                    <Text as="span" display="block" color="#d9ff43">
                      Play it right here.
                    </Text>
                  </Heading>
                </Stack>
              </Reveal>
            </Stack>

            <Stack
              align={{
                base: "flex-start",
                lg: "flex-end",
              }}
              spacing={5}
            >
              <Text
                maxW="530px"
                color="whiteAlpha.600"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight={1.8}
                textAlign={{
                  base: "left",
                  lg: "right",
                }}
              >
                Select a release to load it into the Spotify player without leaving the website.
              </Text>

              <Button
                as="a"
                href={SPOTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("spotify_click", {
                    location: "Spotify Section",
                    destination_url: SPOTIFY_URL,
                  })
                }
                leftIcon={<FaSpotify />}
                rightIcon={<FaExternalLinkAlt />}
                borderRadius="full"
                bg="#1ed760"
                color="black"
                px={7}
                fontWeight={800}
                _hover={{
                  bg: "#54e582",
                  transform: "translateY(-2px)",
                }}
              >
                Follow on Spotify
              </Button>
            </Stack>
          </Grid>

          {!isLoading && !hasError && releases.length > 0 && <SpotifyStatsBar stats={spotifyStats} />}

          {isLoading && <SpotifyReleasesSkeleton />}

          {!isLoading && hasError && <SpotifyErrorFallback />}

          {!isLoading && !hasError && releases.length > 0 && (
            <Grid
              templateColumns={{
                base: "1fr",
                lg: "minmax(0, 1.05fr) minmax(380px, 0.95fr)",
              }}
              gap={{ base: 10, lg: 10 }}
              alignItems="start"
            >
              <Stack spacing={5}>
                <Flex justify="space-between" align="center">
                  <Stack spacing={1}>
                    <Text color="#d9ff43" fontSize="xs" fontWeight={700} letterSpacing="0.18em" textTransform="uppercase">
                      Releases
                    </Text>

                    <Heading
                      fontSize={{
                        base: "2xl",
                        md: "3xl",
                      }}
                      fontWeight={500}
                    >
                      Select what to play
                    </Heading>
                  </Stack>

                  <Text color="whiteAlpha.400" fontSize="sm">
                    {releases.length} releases
                  </Text>
                </Flex>

                <SimpleGrid
                  columns={{
                    base: 1,
                    sm: 2,
                    lg: 2,
                  }}
                  spacing={4}
                >
                  {releases.slice(0, 6).map((release, index) => (
                    <Reveal key={release.id} delay={index * 0.08} distance={20}>
                      <SpotifyReleaseCard release={release} isActive={selectedRelease?.id === release.id} onSelect={() => handleReleaseSelection(release)} />
                    </Reveal>
                  ))}
                </SimpleGrid>
              </Stack>

              <Reveal delay={0.2} distance={24}>
                <SpotifyInteractivePlayer playerUrl={playerUrl} selectedRelease={selectedRelease} isChanging={isChanging} activeColor={activeColor} />
              </Reveal>
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

function SpotifyStatsBar({ stats }: { stats: SpotifyStats }) {
  const items = [
    {
      value: stats.releases,
      label: "Releases",
    },
    {
      value: stats.albums,
      label: "Albums",
    },
    {
      value: stats.singles,
      label: "Singles",
    },
    {
      value: stats.tracks,
      label: "Tracks",
    },
  ];

  return (
    <Box
      overflow="hidden"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius={{ base: "24px", md: "32px" }}
      bg="rgba(255,255,255,0.035)"
      backdropFilter="blur(16px)"
    >
      <SimpleGrid columns={{ base: 2, md: 4 }}>
        {items.map((item, index) => (
          <Stack
            key={item.label}
            spacing={2}
            align="center"
            justify="center"
            minH={{ base: "110px", md: "130px" }}
            px={5}
            py={6}
            borderRight={{
              base: index % 2 === 0 ? "1px solid" : "none",
              md: index < items.length - 1 ? "1px solid" : "none",
            }}
            borderBottom={{
              base: index < 2 ? "1px solid" : "none",
              md: "none",
            }}
            borderColor="whiteAlpha.200"
          >
            <AnimatedCounter
              value={item.value}
              duration={1100 + index * 150}
              color="#d9ff43"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight={700}
              lineHeight={1}
              letterSpacing="-0.04em"
            />

            <Text color="whiteAlpha.500" fontSize="xs" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase">
              {item.label}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Box>
  );
}
function SpotifyReleaseCard({ release, isActive, onSelect }: { release: SpotifyRelease; isActive: boolean; onSelect: () => void }) {
  const cover = release.images[0]?.url;

  return (
    <Box
      as="button"
      type="button"
      w="full"
      p={3}
      border="1px solid"
      borderColor={isActive ? "#d9ff43" : "whiteAlpha.200"}
      borderRadius="22px"
      bg={isActive ? "rgba(217,255,67,0.08)" : "whiteAlpha.50"}
      color="white"
      textAlign="left"
      cursor="pointer"
      role="group"
      transition="all 0.3s ease"
      boxShadow={isActive ? "0 20px 60px rgba(217,255,67,0.12)" : "none"}
      onClick={onSelect}
      _hover={{
        borderColor: "#d9ff43",
        bg: "rgba(217,255,67,0.06)",
        transform: "translateY(-6px)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
      }}
      _focusVisible={{
        outline: "2px solid #d9ff43",
        outlineOffset: "3px",
      }}
    >
      <Grid templateColumns="110px minmax(0, 1fr)" gap={5} alignItems="center">
        <Box position="relative" w="110px" h="110px" overflow="visible">
          {/* Vinyl Wrapper: steuert nur das Herausfahren */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            w="96px"
            h="96px"
            transform={isActive ? "translate(-25%, -50%)" : "translate(-50%, -50%)"}
            transition="transform 0.45s cubic-bezier(.22,.61,.36,1)"
            _groupHover={{
              transform: "translate(-15%, -50%)",
            }}
          >
            {/* Vinyl Disc: steuert nur die Rotation */}
            <Box
              position="relative"
              w="full"
              h="full"
              borderRadius="full"
              bg="radial-gradient(circle at center, #d9ff43 0 8%, #111 9% 18%, #050505 19% 100%)"
              border="1px solid rgba(255,255,255,0.08)"
              boxShadow="0 12px 30px rgba(0,0,0,0.45)"
              animation={isActive ? "vinylSpin 8s linear infinite" : "none"}
              className={isActive ? "vinyl-spin" : undefined}
              _before={{
                content: '""',
                position: "absolute",
                inset: "10%",
                borderRadius: "full",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              _after={{
                content: '""',
                position: "absolute",
                inset: "22%",
                borderRadius: "full",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Vinyl-Glanz */}
              <Box
                position="absolute"
                inset="5%"
                borderRadius="full"
                bg="conic-gradient(
                  from 20deg,
                  transparent 0deg,
                  rgba(255,255,255,0.06) 22deg,
                  transparent 48deg,
                  transparent 180deg,
                  rgba(255,255,255,0.04) 205deg,
                  transparent 235deg
                )"
              />

              {/* Mittelloch */}
              <Box position="absolute" top="50%" left="50%" w="5px" h="5px" borderRadius="full" bg="#050505" transform="translate(-50%, -50%)" zIndex={2} />
            </Box>
          </Box>

          {/* Cover */}
          <Box
            position="relative"
            zIndex={2}
            w="92px"
            h="92px"
            overflow="hidden"
            borderRadius="15px"
            bg="whiteAlpha.100"
            boxShadow="0 14px 30px rgba(0,0,0,0.35)"
            transition="transform 0.3s ease"
            _groupHover={{
              transform: "scale(1.04)",
            }}
          >
            {cover ? (
              <Image
                src={cover}
                alt={`${release.name} cover`}
                fill
                sizes="92px"
                style={{
                  objectFit: "cover",
                }}
              />
            ) : (
              <Flex w="full" h="full" align="center" justify="center" color="whiteAlpha.500">
                <FaCompactDisc size={28} />
              </Flex>
            )}
          </Box>

          {/* Play Badge */}
          <Flex
            position="absolute"
            zIndex={3}
            right="6px"
            bottom="6px"
            align="center"
            justify="center"
            w="30px"
            h="30px"
            borderRadius="full"
            bg={isActive ? "#d9ff43" : "rgba(255,255,255,0.14)"}
            color={isActive ? "#080a08" : "white"}
            backdropFilter="blur(8px)"
            transform={isActive ? "scale(1.1)" : "scale(1)"}
            transition="all 0.25s ease"
            _groupHover={{
              bg: "#d9ff43",
              color: "#080a08",
              transform: "scale(1.12)",
            }}
          >
            <FaPlay size={10} />
          </Flex>
        </Box>

        <Stack spacing={3} minW={0}>
          <Stack spacing={1}>
            <Text noOfLines={2} fontSize="md" fontWeight={700} lineHeight={1.25}>
              {release.name}
            </Text>

            <Text color="whiteAlpha.500" fontSize="sm" textTransform="capitalize">
              {release.album_type} · {release.release_date.slice(0, 4)}
            </Text>
          </Stack>

          <HStack color={isActive ? "#d9ff43" : "whiteAlpha.500"} fontSize="xs" fontWeight={700} letterSpacing="0.04em">
            <FaSpotify />

            <Text>{isActive ? "Now selected" : "Load into player"}</Text>
          </HStack>
        </Stack>
      </Grid>
    </Box>
  );
}
function SpotifyInteractivePlayer({
  playerUrl,
  selectedRelease,
  isChanging,
  activeColor,
}: {
  playerUrl: string;
  selectedRelease: SpotifyRelease | null;
  isChanging: boolean;
  activeColor: string;
}) {
  return (
    <Box
      id="spotify-player"
      position={{ base: "relative", lg: "sticky" }}
      top={{ lg: "120px" }}
      overflow="hidden"
      p={{ base: 5, md: 7 }}
      border="1px solid"
      borderColor={activeColor}
      borderRadius={{ base: "26px", md: "34px" }}
      bg="rgba(8, 10, 8, 0.72)"
      transition="border-color 0.6s ease, box-shadow 0.6s ease"
      boxShadow="0 35px 100px rgba(0,0,0,0.4)"
    >
      {/* Dynamischer Farb-Glow */}
      <Box
        position="absolute"
        inset="-25%"
        bg={activeColor}
        opacity={isChanging ? 0.05 : 0.2}
        filter="blur(110px)"
        transform="scale(1.15)"
        transition="background 0.8s ease, opacity 0.3s ease"
        pointerEvents="none"
      />

      {/* Albumcover im Hintergrund */}
      {selectedRelease?.images?.[0]?.url && (
        <Box position="absolute" inset={0} pointerEvents="none">
          <Image
            key={selectedRelease.id}
            src={selectedRelease.images[0].url}
            alt=""
            fill
            sizes="600px"
            style={{
              objectFit: "cover",
              opacity: 0.1,
              filter: "blur(70px)",
              transform: "scale(1.6)",
              transition: "opacity 0.5s ease",
            }}
          />
        </Box>
      )}

      <Stack position="relative" zIndex={2} spacing={6}>
        <Flex justify="space-between" align="flex-start" gap={5}>
          <Stack spacing={1} minW={0}>
            <HStack color={activeColor} fontSize="xs" fontWeight={700} letterSpacing="0.18em" textTransform="uppercase" transition="color 0.6s ease">
              <FaSpotify />
              <Text>Spotify player</Text>
            </HStack>

            <Heading as={"h2"} noOfLines={2} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={500} letterSpacing="-0.03em">
              {selectedRelease?.name ?? "Cali P"}
            </Heading>

            {selectedRelease && (
              <Text color="whiteAlpha.500" fontSize="sm" textTransform="capitalize">
                {selectedRelease.album_type} · {selectedRelease.total_tracks} tracks
              </Text>
            )}
          </Stack>

          {selectedRelease && (
            <IconButton
              as="a"
              href={selectedRelease.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open release on Spotify"
              icon={<FaExternalLinkAlt />}
              flexShrink={0}
              borderRadius="full"
              bg="whiteAlpha.100"
              color="white"
              _hover={{
                bg: activeColor,
                color: "black",
              }}
            />
          )}
        </Flex>

        <Box
          overflow="hidden"
          borderRadius="20px"
          bg="blackAlpha.400"
          opacity={isChanging ? 0.35 : 1}
          transform={isChanging ? "scale(0.97)" : "scale(1)"}
          transition="opacity 0.25s ease, transform 0.25s ease"
        >
          <iframe
            key={playerUrl}
            title={selectedRelease ? `${selectedRelease.name} on Spotify` : "Cali P on Spotify"}
            src={playerUrl}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{
              display: "block",
              border: 0,
              borderRadius: "20px",
            }}
          />
        </Box>

        <Text color="whiteAlpha.400" fontSize="xs" lineHeight={1.6}>
          Playback is provided by Spotify. Availability may depend on the listener’s Spotify account and region.
        </Text>
      </Stack>
    </Box>
  );
}

function SpotifyReleasesSkeleton() {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        lg: "1.05fr 0.95fr",
      }}
      gap={10}
    >
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid key={index} templateColumns="92px 1fr" gap={4} p={3} border="1px solid" borderColor="whiteAlpha.200" borderRadius="22px">
            <Skeleton w="92px" h="92px" borderRadius="15px" startColor="whiteAlpha.100" endColor="whiteAlpha.200" />

            <SkeletonText mt={2} noOfLines={3} spacing={3} skeletonHeight={3} startColor="whiteAlpha.100" endColor="whiteAlpha.200" />
          </Grid>
        ))}
      </SimpleGrid>

      <Skeleton minH="500px" borderRadius="34px" startColor="whiteAlpha.100" endColor="whiteAlpha.200" />
    </Grid>
  );
}

function SpotifyErrorFallback() {
  return (
    <Stack
      spacing={6}
      align="center"
      p={{ base: 8, md: 14 }}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="32px"
      bg="whiteAlpha.50"
      textAlign="center"
    >
      <FaSpotify size={44} />

      <Heading as={"h2"} size="lg">
        Spotify releases could not be loaded
      </Heading>

      <Text color="whiteAlpha.600">You can still listen to Cali P directly on Spotify.</Text>

      <Button
        as="a"
        href={SPOTIFY_URL}
        target="_blank"
        rel="noopener noreferrer"
        leftIcon={<FaSpotify />}
        borderRadius="full"
        bg="#1ed760"
        color="black"
        _hover={{
          bg: "#54e582",
        }}
      >
        Open Spotify
      </Button>
    </Stack>
  );
}

function getUniqueSpotifyReleases(releases: SpotifyRelease[]): SpotifyRelease[] {
  const uniqueReleases = new Map<string, SpotifyRelease>();

  for (const release of releases) {
    const key = release.name.trim().toLowerCase();

    if (!uniqueReleases.has(key)) {
      uniqueReleases.set(key, release);
    }
  }

  return Array.from(uniqueReleases.values()).sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
}
